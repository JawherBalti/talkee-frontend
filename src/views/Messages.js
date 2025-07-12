import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
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
var userSelectedId = 0;

function Messages() {
  const user = useSelector((state) => state.user);
  const conversation = useSelector((state) => state.conversation);
  
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingStatus, setTypingStatus] = useState({});

  const [newMessage, setNewMessage] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const scrollRef = useRef();
  const socket = useRef();

  const dispatch = useDispatch();

  // const scrollToBottom = () => {
  //   scrollRef.current?.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'end',
  //     inline: 'nearest'
  //   });
  // };

const scrollToBottom = () => {
  const container = document.querySelector('.messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

  useEffect(() => {
    scrollToBottom();
  }, [conversation.oneConversation]); // Triggers when messages change

  useEffect(() => {
    socket.current = io('ws://localhost:3001');
  }, []);

// 2. Add this useEffect for typing status
useEffect(() => {
  const socketInstance = socket.current;
  
  const handleTypingStatus = (data) => {
    if (data.senderId === userSelectedId) {
      setIsTyping(data.isTyping);
    }
    // Update the typing status for all users if needed
    setTypingStatus(prev => ({
      ...prev,
      [data.senderId]: data.isTyping
    }));
  };

  socketInstance?.on('getIsTyping', handleTypingStatus);

  return () => {
    socketInstance?.off('getIsTyping', handleTypingStatus);
  };
}, [userSelectedId]);

const handleTyping = (e) => {
  if (!userSelectedId) return;

  const isTyping = e.target.value.length > 0;
  
  const data = {
    senderId: user.userLogin.user.id,
    receiverId: userSelectedId,
    isTyping: isTyping
  };
  
  socket.current.emit('isTyping', data);
  
  // Clear typing status after a delay if user stops typing
  if (!isTyping) {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    return () => clearTimeout(timer);
  }
};

  useEffect(() => {
    dispatch(getAllUsers());
    userSelectedId = 0;
    setUserSelected(false);
  }, [dispatch]);

  // useEffect(() => {
  //   user.users
  //     .filter((u) => u.id !== user.userLogin.user.id)
  //     .forEach((user) => {
  //       dispatch(getOneConversation(user.id));
  //     });
  // }, []);

  useEffect(() => {
    dispatch(getAllConversations());
    dispatch(getCurrentUser(user.userLogin.user.id));
  }, [
    dispatch,
    conversation.updateConversationLoading,
    user.user.user.id,
    conversation.messageReceived,
  ]);

  useEffect(() => {
    if (user.userLogin.user) {
      const data = {
        status: 'online',
        userId: user.userLogin.user.id,
      };
      socket?.current.emit('addUser', data);
    }
  }, []);

useEffect(() => {
  if (user.userLogin.user) {
    socket.current.on('getMessage', (data) => {
      if (data.firstUser.senderId === userSelectedId) {
        const userIds = {
          senderId: data.firstUser.senderId,
          receiverId: data.secondUser.receiverId,
        };
        dispatch(updateReceivedMessage(userIds));
        dispatch(receiveMessage(data));
        // Mark as read since user is viewing this conversation
        socket.current.emit('markAsRead', {
          senderId: data.firstUser.senderId,
          receiverId: user.userLogin.user.id
        });
      } else {
        // Update unread count for this sender
        setUnreadCounts(prev => ({
          ...prev,
          [data.firstUser.senderId]: (prev[data.firstUser.senderId] || 0) + 1
        }));
      }
    });
    //Take the getIsTyping listener out of the getMessage listener
    socket.current.on('getIsTyping', (data) => {
      console.log(data);
      if (data.isTyping) setIsTyping(true);
      else setIsTyping(false);
    });
    // Handle when messages are marked as read
    socket.current.on('messagesRead', ({ senderId }) => {
      setUnreadCounts(prev => ({
        ...prev,
        [senderId]: 0
      }));
    });
  }

    return () => {
    // Clean up all listeners when component unmounts
    socket.current?.off('getMessage');
    socket.current?.off('messagesRead');
    socket.current?.off('getIsTyping');
  };
}, [dispatch, user.userLogin.user]);

//debounce function to prevent rapid firing of typing events
const debounce = (func, delay) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const debouncedTyping = useMemo(() => debounce(handleTyping, 300), [userSelectedId]);

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
      // dispatch(getConversations(data.secondUserId));
      setTimeout(() => {
        socket.current.emit('sendMessage', data);
        scrollToBottom();
      }, 1000);
      setNewMessage('');
    }

  };

const handleOpenConversation = (otherUser) => {
  dispatch(getOneConversation(otherUser.id));
  dispatch(getUser(otherUser.id));
  dispatch(updateOneConversation(otherUser.id));
  setUserSelected(true);
  setNewMessage('');
  userSelectedId = otherUser.id;
  
  // Mark messages as read when opening conversation
  if (unreadCounts[otherUser.id]) {
    setUnreadCounts(prev => ({
      ...prev,
      [otherUser.id]: 0
    }));
    
    socket.current.emit('markAsRead', {
      senderId: otherUser.id,
      receiverId: user.userLogin.user.id
    });
  }

  // Scroll after a small delay to allow DOM update
  setTimeout(() => {
    scrollToBottom();
  }, 100);
};

return (
  <div className="messaging-app">
    {/* Contacts sidebar */}
    <div className="contacts-sidebar">
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
                <span className={`status-dot ${user.status === 'online' ? 'online' : ''}`}></span>
              </div>
              
              <div className="contact-info">
                <h4>{user.firstName} {user.familyName}</h4>
                <p className="last-message">
                  {conversation.conversations.find(c => 
                    c.firstUser?.senderId === user.id || c.secondUser?.receiverId === user.id
                  )?.message?.substring(0, 25) || 'Start a conversation'}
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
                    user.user.user?.status || 'offline'
                  )}
                </p>
              </div>
            </div>
            <button className="more-options">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>

          <div className="messages-container" ref={scrollRef}>
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
              {/* Add this empty div at the end for scrolling reference */}
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
        <div className="welcome-screen">
          <div className="welcome-content">
            <i className="fas fa-comments welcome-icon"></i>
            <h2>Select a conversation</h2>
            <p>Choose a contact to start chatting</p>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default Messages;
