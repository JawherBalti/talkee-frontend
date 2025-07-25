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
  getUser,
} from '../features/user/userSlice';

const imageApi = 'http://localhost:3001/images/';
let userSelectedId = 0;

function Messages() {
  const user = useSelector((state) => state.user);
  const conversation = useSelector((state) => state.conversation);
  
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingStatus, setTypingStatus] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showContacts, setShowContacts] = useState(false);
  
  const scrollRef = useRef();
  const socket = useRef();
  const dispatch = useDispatch();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
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
      const response = await axios.get('http://localhost:3001/api/conversations/unread-counts');
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
    dispatch(getOneConversation(otherUser.id));
    dispatch(getUser(otherUser.id));
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
          {user.users
            .filter(u => u.id !== user.userLogin.user.id)
            .map(user => (
              <div 
                className={`contact-card ${user.id === userSelectedId ? 'active' : ''}`}
                key={user.id}
                onClick={() => handleOpenConversation(user)}
              >
                <div className="avatar-container">
                  <img 
                    src={user.photoUrl} 
                    alt={user.firstName}
                    className="contact-avatar"
                  />
                  <span className={`status-dot ${user.isOnline ? 'online' : ''}`}></span>
                </div>
                
                <div className="contact-info">
                  <h4>{user.firstName} {user.familyName}</h4>
                  <p className="last-message">
                    {getLastMessage(user.id)}
                  </p>
                </div>
                
                {unreadCounts[user.id] > 0 && (
                  <span className="unread-badge">
                    {unreadCounts[user.id] > 9 ? '9+' : unreadCounts[user.id]}
                  </span>
                )}
              </div>
            ))}
        </div>
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
                  src={user.user.user?.photoUrl} 
                  alt={user.user.user?.firstName}
                  className="chat-avatar"
                />
                <div>
                  <h3>{user.user.user?.firstName} {user.user.user?.familyName}</h3>
                  <p className="status-text">
                    {isTyping ? (
                      <span className="typing-indicator">typing...</span>
                    ) : (
                      user.user.user?.isOnline ? 'online' : 'offline'
                    )}
                  </p>
                </div>
              </div>
              <button className="more-options">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>

            <div onClick={() => setShowContacts(!showContacts)} className="messages-container" ref={scrollRef}>
              {conversation.oneConversation.length > 0 ? (
                conversation.oneConversation.map(msg => {
                  if (!msg) return null;
                  
                  const isSent = parseInt(msg.senderId) === user.userLogin.user.id;
                  const senderPhoto = isSent 
                    ? user.currentUser.user?.photoUrl 
                    : user.user.user?.photoUrl;
                  
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
              <div ref={scrollRef} style={{ float: "left", clear: "both" }}></div>
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