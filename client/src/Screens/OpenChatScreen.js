import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Message from '../Components/Message';
import Alert from '../Components/Alert';
import Loader from '../Components/Loader';
import { socket } from '../App';
import { deleteChat } from '../actions/chat';

const OpenChatScreen = () => {
  const bottomListRef = useRef();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { roomId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;

  const devProfile = useSelector((state) => state.profile);
  const { user } = devProfile;

  const chatDelete = useSelector((state) => state.chat);
  const { loading, success, error } = chatDelete;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    socket.emit('getMessages', roomId);
    socket.on('returnMessages', ({ conversationMessages }) => {
      setMessages(conversationMessages);
    });
  }, [roomId, inputRef]);

  useEffect(() => {
    if (user?.username) {
      socket.emit('join', {
        name: user?.username,
        room: roomId,
      });
    }
    socket.on('message', ({ conversationMessages }) => {
      setMessages(conversationMessages);
    });
  }, [roomId, user?.username]);

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit('sendMessage', newMessage, user?.username, roomId, () => {
      setNewMessage('');
    });
    bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const chatDeleteHandler = () => {
    dispatch(deleteChat(roomId));
    navigate('/h/messages');
  };

  return (
    <div className='w-full h-full'>
      <div className='h-12 text-center w-full bg-white dark:bg-gray-800 dark:border-gray-700 border-b-2 flex items-center justify-between'>
        <div></div>
        <div className='text-red-500 mr-2 text-xs cursor-pointer hover:text-red-600'>
          {loading ? (
            <Loader />
          ) : (
            <button onClick={chatDeleteHandler} className='focus:outline-none'>
              <i className='fas fa-trash-alt mr-1'></i>Delete chat
            </button>
          )}
        </div>
      </div>
      {error && <Alert fail msg={error} />}
      <div className='flex flex-col h-full' style={{ height: '85vh' }}>
        <div className='overflow-auto h-full w-full'>
          <div className='py-4 max-w-screen-lg mx-auto w-full'>
            <div className='mx-2 pb-8'>
              {messages?.map((data, idx) => (
                <Message
                  key={idx}
                  text={data?.text}
                  userName={data?.userName}
                  right={
                    data?.userName.toString() === user?.username?.toString()
                  }
                />
              ))}
            </div>
            <div ref={bottomListRef}></div>
          </div>
        </div>
        <div className='w-full'>
          <form
            onSubmit={submitHandler}
            className='flex flex-row bg-gray-200 dark:bg-gray-700 rounded-md px-4 py-3 z-10 max-w-screen-lg mx-auto dark:text-white shadow-md'
          >
            <input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Write here...'
              className='flex-1 bg-transparent outline-none'
            />
            <button
              disabled={newMessage === ''}
              className='focus:outline-none uppercase font-semibold text-sm tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors'
            >
              <i className='fas fa-paper-plane'></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OpenChatScreen;
