import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
  createConversations,
  getAllConversations,
  getOneConversation,
  receiveMessage,
  updateOneConversation,
  updateReceivedMessage,
} from '../features/conversation/conversationSlice';
import {
  getAllUsers,
  getCurrentUser,
  getFollowedUsers,
  getSelectedUser,
} from '../features/user/userSlice';
import { useLocation } from 'react-router-dom';

let userSelectedId = 0;

function Messages() {
  const location = useLocation();
  const { selectedUserId } = location.state || {};

  const user = useSelector((state) => state.user);
  const conversation = useSelector((state) => state.conversation);
  
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingStatus, setTypingStatus] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showContacts, setShowContacts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [followedUsersPage, setFollowedUsersPage] = useState(1);
  const followedUsers = useSelector((state) => state.user.followedUsers);
  const followedUsersPagination = useSelector((state) => state.user.followedUsersPagination);
  const getFollowedUsersLoading = useSelector((state) => state.user.getFollowedUsersLoading);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const socket = useRef();
  const dispatch = useDispatch();

  // Add this useEffect to handle the selected user from navigation
  useEffect(() => {
      if (selectedUserId) {
          const friend = user.users.find(u => u.id === selectedUserId);
          if (friend) {
              handleOpenConversation(friend);
          }
      }
  }, [selectedUserId, user.users]);

  useEffect(() => {
    dispatch(getFollowedUsers({ 
      userId: user.userLogin.user.id, 
      page: 1 
    }));
  }, [dispatch, user.userLogin.user.id]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (conversation.pagination.currentPage === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.oneConversation, conversation.pagination.currentPage]);


  const loadMoreFollowedUsers = () => {
    if (!getFollowedUsersLoading && followedUsersPagination.hasNextPage) {
      const nextPage = followedUsersPage + 1;
      dispatch(getFollowedUsers({ 
        userId: user.userLogin.user.id, 
        page: nextPage 
      }));
      setFollowedUsersPage(nextPage);
    }
  };

  // Load more older messages
  const loadMoreMessages = async () => {
    if (loadingMore || !conversation.pagination.hasMore) return;
    
    // Save current scroll position
    const container = messagesContainerRef.current;
    const prevHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;
    
    setLoadingMore(true);
    try {
      const nextPage = conversation.pagination.currentPage + 1;
      await dispatch(getOneConversation({
        id: userSelectedId,
        page: nextPage,
        limit: 5
      })).unwrap();
      
      // Maintain scroll position after loading
      setTimeout(() => {
        const container = document.querySelector('.messages-container');
        if (container) {
          container.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: adds smooth scrolling
          });        
        }
      }, 0);
    } catch (error) {
    } finally {
      setLoadingMore(false);
    }
  };

  // Debounce function for typing indicators
  const debounce = (func, delay) => {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch unread counts from API
  const fetchUnreadCounts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/conversation/unread-counts');
      const counts = {};
      response.data.forEach(item => {
        counts[item.otherUserId] = item.unreadCount;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  // Optimized socket message handler
  const handleSocketMessage = (data) => {
    const isActiveConversation = data.firstUser.senderId === userSelectedId;
    
    if (isActiveConversation) {
      const userIds = {
        senderId: data.firstUser.senderId,
        receiverId: data.secondUser.receiverId,
      };
      dispatch(updateReceivedMessage(userIds));
      dispatch(receiveMessage(data));
      
      // Optimistic UI update
      setUnreadCounts(prev => ({
        ...prev,
        [data.firstUser.senderId]: 0
      }));
    } else {
      // Optimistic UI update for unread count
      setUnreadCounts(prev => ({
        ...prev,
        [data.firstUser.senderId]: (prev[data.firstUser.senderId] || 0) + 1
      }));
    }
  };

  // Handle typing events
  const handleTyping = (e) => {
    if (!userSelectedId) return;

    const isTyping = e.target.value.length > 0;
    const data = {
      senderId: user.userLogin.user.id,
      receiverId: userSelectedId,
      isTyping: isTyping
    };
    
    socket.current.emit('isTyping', data);
    
    if (!isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  };

  const debouncedTyping = useMemo(() => debounce(handleTyping, 300), [userSelectedId]);

  // Handle opening a conversation
  const handleOpenConversation = (otherUser) => {
    dispatch(getOneConversation({
      id: otherUser.id,
      page: 1, // Always start with page 1 when opening a new conversation
      limit: 5
    }));
    
    dispatch(getSelectedUser(otherUser.id));
    dispatch(updateOneConversation(otherUser.id));
    setUserSelected(true);
    setNewMessage('');
    userSelectedId = otherUser.id;
    
    // Mark messages as read optimistically
    setUnreadCounts(prev => ({
      ...prev,
      [otherUser.id]: 0
    }));

    if (isMobile) {
      setShowContacts(false);
    }

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage && userSelectedId !== 0) {
      const data = {
        message: newMessage,
        secondUserId: userSelectedId,
        firstUser: {
          senderId: user.currentUser.user.id,
          firstName: user.currentUser.user.firstName,
          familyName: user.currentUser.user.familyName,
          photoUrl: user.currentUser.user.photoUrl,
        },
        secondUser: {
          receiverId: user.user.user.id,
          firstName: user.user.user.firstName,
          familyName: user.user.user.familyName,
          photoUrl: user.user.user.photoUrl,
        },
        unreadMessageSecondUser: 1,
      };
      dispatch(createConversations(data));
      setTimeout(() => {
        socket.current.emit('sendMessage', data);
        scrollToBottom();
      }, 1000);
      setNewMessage('');
    }
  };

  // Effects
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation.oneConversation]);

  useEffect(() => {
    socket.current = io('ws://localhost:3001');
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const socketInstance = socket.current;
    
    const handleTypingStatus = (data) => {
      if (data.senderId === userSelectedId) {
        setIsTyping(data.isTyping);
      }
      setTypingStatus(prev => ({
        ...prev,
        [data.senderId]: data.isTyping
      }));
    };

    socketInstance?.on('getIsTyping', handleTypingStatus);
    socketInstance?.on('getMessage', handleSocketMessage);

    return () => {
      socketInstance?.off('getIsTyping', handleTypingStatus);
      socketInstance?.off('getMessage', handleSocketMessage);
    };
  }, [userSelectedId]);

  useEffect(() => {
    dispatch(getAllUsers());
    userSelectedId = 0;
    setUserSelected(false);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllConversations());
    dispatch(getCurrentUser(user.userLogin.user.id));
    fetchUnreadCounts(); // Initial fetch of unread counts
  }, [dispatch, user.userLogin.user.id]);

  useEffect(() => {
    if (user.userLogin.user) {
      const data = {
        status: 'online',
        userId: user.userLogin.user.id,
      };
      socket?.current.emit('addUser', data);
    }
  }, [user.userLogin.user]);

  // Get last message for a conversation
  const getLastMessage = (userId) => {
    const convs = conversation.conversations?.filter(c => 
      c.firstUserId === userId || c.secondUserId === userId
    );
    if (!convs || convs.length === 0) return 'Start a conversation';
    
    const lastConv = convs.reduce((latest, current) => 
      new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest
    );
    return lastConv.message?.substring(0, 25) || 'Start a conversation';
  };

  return (
    <div className="messaging-app">
      {/* Contacts sidebar */}
      <div className={`contacts-sidebar ${isMobile ? (showContacts ? 'mobile-visible' : '') : ''}`}>
        <div className="sidebar-header">
          <h2>Messages</h2>
          <button className="settings-btn">
            <i className="fas fa-cog"></i>
          </button>
        </div>
        
        <div className="contacts-list">
          {followedUsers
            .filter(u => u.id !== user.userLogin.user.id)
            .map(friend => (
              <div 
                className={`contact-card ${friend.id === userSelectedId ? 'active' : ''}`}
                key={friend.id}
                onClick={() => handleOpenConversation(friend)}
              >
                <div className="avatar-container">
                  <img 
                    src={friend.photoUrl} 
                    alt={friend.firstName}
                    className="contact-avatar"
                  />
                  <span className={`status-dot ${friend.isOnline ? 'online' : ''}`}></span>
                </div>
                
                <div className="contact-info">
                  <h4>{friend.firstName} {friend.familyName}</h4>
                  <p className="last-message">
                    {getLastMessage(friend.id)}
                  </p>
                </div>
                
                {unreadCounts[friend.id] > 0 && (
                  <span className="unread-badge">
                    {unreadCounts[friend.id] > 9 ? '9+' : unreadCounts[friend.id]}
                  </span>
                )}
              </div>
            ))}
        </div>
        {followedUsersPagination.hasNextPage && (
          <div className="load-more-contacts">
            <button 
            className='load-more-btn'
              onClick={loadMoreFollowedUsers}
              disabled={getFollowedUsersLoading}
            >
              {getFollowedUsersLoading ? 'Loading...' : 'Load More Contacts'}
            </button>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="chat-area">
        {userSelected ? (
          <>
            <div className="chat-header">
              {isMobile && (
                <button 
                  className="back-button"
                  onClick={() => setShowContacts(true)}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
              )}
              <div className="chat-partner">
                <img 
                  src={user?.selectedUser?.photoUrl} 
                  alt={user?.selectedUser?.firstName}
                  className="chat-avatar"
                />
                <div>
                  <h3>{user?.selectedUser?.firstName} {user?.selectedUser?.familyName}</h3>
                  <p className="status-text">
                    {isTyping ? (
                      <span className="typing-indicator">typing...</span>
                    ) : (
                      user?.selectedUser?.isOnline ? 'online' : 'offline'
                    )}
                  </p>
                </div>
              </div>
              <button className="more-options">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>

            <div onClick={() => setShowContacts(!showContacts)} className="messages-container" ref={messagesContainerRef}>

              {/* "Show More" button at the bottom */}
              {conversation.pagination.hasMore && (
                <div className="show-more-container">
                  <button 
                    onClick={loadMoreMessages}
                    disabled={loadingMore}
                    className="show-more-btn"
                  >
                    {loadingMore ? (
                      <><i className="fas fa-spinner fa-spin"></i> Loading...</>
                    ) : (
                      'Show Older Messages'
                    )}
                  </button>
                </div>
              )}
              {/* Empty div for auto-scrolling to top */}
              {conversation.oneConversation.length > 0 ? (
                conversation.oneConversation.map(msg => {
                  if (!msg) return null;
                  
                  const isSent = parseInt(msg.senderId) === user.userLogin.user.id;
                  const senderPhoto = isSent 
                    ? user.currentUser.user?.photoUrl 
                    : user?.selectedUser?.photoUrl;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`message ${isSent ? 'sent' : 'received'}`}
                    >
                      {!isSent && (
                        <img 
                          src={senderPhoto} 
                          alt="sender" 
                          className="message-avatar"
                        />
                      )}
                      
                      <div className="message-content">
                        <p className="message-text">{msg.message}</p>
                        <div className="message-meta">
                          <span className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          {isSent && (
                            <span className="message-status">
                              <i className={`fas fa-check${msg.read ? '-double' : ''}`}></i>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-chat">
                  <p>No messages yet. Say hello!</p>
                </div>
              )}
              <div ref={messagesEndRef} style={{ float: "left", clear: "both" }}></div>
            </div>

            <form className="message-input-area" onSubmit={handleSubmit}>
              <input
                type="text"
                className="message-input"
                placeholder={isTyping ? `${user.user.user.firstName} is typing...` : 'Type a message...'}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  debouncedTyping(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTyping({ target: { value: '' } });
                  }
                }}
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!newMessage.trim()}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div onClick={() => setShowContacts(!showContacts)} className="welcome-screen">
            <div className="welcome-content">
              <i className="fas fa-comments welcome-icon"></i>
              <h2>Select a conversation</h2>
              {!isMobile && <p>Choose a contact to start chatting</p> }
              {isMobile && (
                <button 
                  className="secondary"
                  onClick={() => setShowContacts(!showContacts)}
                >
                  Choose Contact
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;