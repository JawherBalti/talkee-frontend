import React, { useEffect, useRef, useState } from 'react';
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

  const [newMessage, setNewMessage] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const scrollRef = useRef();
  const socket = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.oneConversation]);

  useEffect(() => {
    socket.current = io('ws://localhost:3001');
  }, []);

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
          dispatch(receiveMessage(data));
          dispatch(updateReceivedMessage(userIds));
          socket.current.on('getIsTyping', (data) => {
            console.log(data);
            if (data.isTyping) setIsTyping(true);
            else setIsTyping(false);
          });
        } else {
          setUnreadMessages((prev) => [
            ...prev,
            {
              senderId: data.firstUser.senderId,
              unreadMessage: data.unreadMessageSecondUser,
            },
          ]);
        }
      });
    }
  }, [dispatch, user.userLogin.user]);

  //Add user in socket server, init getUsers and getMessage
  // useEffect(() => {
  //   if (socket) {
  //     socket.current.emit('addUser', user.userLogin.user.id);

  //     socket.current.on('getMessage', (data) => {
  //       console.log(data);
  //     });
  //     // socket.current.on('getConversation', (data) => {
  //     //   setConversations((prev) => [data.conversation, ...prev]);
  //     // });
  //   }
  //   return () => socket?.current.close();
  // }, [user, socket]);

  // Add current chat in socket server
  // useEffect(() => {
  //   if (currentChat) {
  //     socket.current.emit('addConversation', {
  //       userId: user.id,
  //       convId: currentChat.id,
  //     });
  //     setConversations((prev) =>
  //       prev.map((conv) => {
  //         // if (conv.id === currentChat.id) {
  //         //   conv.firstUserId === user.id
  //         //     ? (conv.unreadMessageFirstUser = 0)
  //         //     : (conv.unreadMessageSecondUser = 0);
  //         //   return conv;
  //         // } else return conv;
  //         return conv;
  //       })
  //     );
  //   }
  // }, [
  //   currentChat,
  //   socket,
  //   user,
  //   conversation.conversationsLoading,
  //   conversation.conversationCreatedLoading,
  // ]);

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
      }, 1000);
      setNewMessage('');
    }

    // const message = {
    //   firstUserId: user.userLogin.user.id,
    //   secondUserId: userSelectedId,
    //   message: newMessage,
    // };

    // const recieverId = conversation.conversations.find(
    //   (user) => user.secondUserId
    // );

    // socket.current.emit('sendMessage', {
    //   senderId: user.userLogin.user.id,
    //   recieverId: userSelectedId,
    //   text: newMessage,
    // });
  };

  const handleOpenConversation = (otherUser) => {
    dispatch(getOneConversation(otherUser.id));
    dispatch(getUser(otherUser.id));
    dispatch(updateOneConversation(otherUser.id));
    setUserSelected(true);
    setNewMessage('');
    userSelectedId = otherUser.id;
    console.log(userSelectedId);

    setUnreadMessages(
      unreadMessages?.filter((msg) => parseInt(msg.senderId) !== userSelectedId)
    );
  };

  const typing = (e) => {
    if (e.keyCode !== 13) {
      console.log(isFocused);
      const data = {
        userId: userSelectedId,
        isTyping: true,
      };
      socket.current.emit('isTyping', data);
    } else {
      console.log(!isFocused);
      const data = {
        userId: userSelectedId,
        isTyping: false,
      };
      socket.current.emit('isTyping', data);
    }
  };

  return (
    <div className="chat">
      <div className="add-message">
        <div className="chat-messages">
          {user.user.user.id !== user.userLogin.user.id && (
            <h6>
              Talk to {user.user.user.firstName} {user.user.user.familyName}
            </h6>
          )}
          {conversation.oneConversation.length !== 0 && userSelected ? (
            <div>
              {conversation.oneConversation?.map((conversation) => (
                <div
                  ref={scrollRef}
                  className={
                    parseInt(conversation?.senderId) === user.userLogin.user.id
                      ? 'message-sender'
                      : 'message-receiver'
                  }
                  key={conversation?.id}
                >
                  <img
                    className="avatar"
                    src={
                      parseInt(conversation?.senderId) ===
                      user.userLogin.user.id
                        ? imageApi + user.currentUser.user?.photoUrl
                        : imageApi + user.user.user?.photoUrl
                    }
                    alt="avatar"
                  />

                  <p className="sender">
                    {parseInt(conversation?.senderId) === user.userLogin.user.id
                      ? user.currentUser.user?.firstName +
                        ' ' +
                        user.currentUser.user?.familyName
                      : user.user.user?.firstName +
                        ' ' +
                        user.user.user?.familyName}
                  </p>

                  <p className="message">{conversation?.message}</p>
                </div>
              ))}
            </div>
          ) : conversation.oneConversation.length === 0 && userSelected ? (
            'You have No Messages!'
          ) : (
            'Select a user to chat with !'
          )}
        </div>

        {userSelected && (
          <form className="send-message" onSubmit={handleSubmit}>
            <i className="fas fa-paper-plane message-icon"></i>
            <input
              className="message-input"
              placeholder={isTyping ? 'Typing...' : 'Send a message...'}
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              onKeyUp={typing}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button className="comment-button" type="submit"></button>
          </form>
        )}
      </div>

      <div className="chat-users">
        {user.users
          .filter((u) => u.id !== user.userLogin.user.id)
          .map((user) => (
            <div
              onClick={() => handleOpenConversation(user)}
              className="chat-user"
              key={user.id}
              style={{
                backgroundColor:
                  user.id === userSelectedId ? '#203040' : 'transparent',
              }}
            >
              {user.photoUrl && (
                <img
                  className="avatar"
                  src={imageApi + user.photoUrl}
                  alt="avatar"
                />
              )}
              <p>{user.firstName + ' ' + user.familyName}</p>

              {unreadMessages.length !== 0 ? (
                unreadMessages?.filter((msg) => msg.senderId === user.id)
                  .length <
                  10 +
                    conversation.conversations?.filter(
                      (msg) => parseInt(msg.senderId) === user.id
                    ).length &&
                unreadMessages?.filter((msg) => msg.senderId === user.id)
                  .length +
                  conversation.conversations?.filter(
                    (msg) => parseInt(msg.senderId) === user.id
                  ).length >
                  0 ? (
                  <span className="unread-msg-count">
                    {unreadMessages?.filter(
                      (msg) => parseInt(msg.senderId) === user.id
                    ).length +
                      conversation.conversations?.filter(
                        (msg) => parseInt(msg.senderId) === user.id
                      ).length}
                  </span>
                ) : unreadMessages?.filter(
                    (msg) => parseInt(msg.senderId) === user.id
                  ).length +
                    conversation.conversations?.filter(
                      (msg) => parseInt(msg.senderId) === user.id
                    ).length ===
                  0 ? null : (
                  <span className="unread-msg-count">9+</span>
                )
              ) : conversation.conversations?.filter(
                  (msg) => parseInt(msg.senderId) === user.id
                ).length < 10 &&
                conversation.conversations?.filter(
                  (msg) => parseInt(msg.senderId) === user.id
                ).length > 0 ? (
                <span className="unread-msg-count">
                  {
                    conversation.conversations?.filter(
                      (msg) => parseInt(msg.senderId) === user.id
                    ).length
                  }
                </span>
              ) : conversation.conversations?.filter(
                  (msg) => parseInt(msg.senderId) === user.id
                ).length === 0 ? null : (
                <span className="unread-msg-count">9+</span>
              )}
              {/* {user.online ? (
                <span className="online"></span>
              ) : (
                <span className="offline"></span>
              )} */}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Messages;
