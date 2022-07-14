import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link,Route, Routes, Navigate, useLocation } from 'react-router-dom';
import baseURL from '../baseURL';
import Alert from '../Components/Alert';
import OpenChatScreen from './OpenChatScreen';
import Loader from '../Components/Loader';
import { getChatRooms } from '../actions/chat';


const ChatScreen = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[3];

  const devChatRoomsGet = useSelector((state) => state.chat);
  const { loading, rooms, error } = devChatRoomsGet;
  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;

  const loggedUserId = userInfo?.user?._id;

  useEffect(() => {
    // get user chat rooms
    dispatch(getChatRooms(loggedUserId));
  }, [dispatch, loggedUserId]);

  return (
    <div className='grid grid-cols-4 w-full h-full'>
      <div className='col-span-1 bg-white dark:bg-gray-800 border-l dark:border-gray-700'>
        <div className='h-12 border-b-2 dark:border-gray-700'>
          <p className='inline-block dark:text-gray-200 text-xl p-2 font-bold text-gray-600'>
            Chats
          </p>
          <span className='italic text-xs text-gray-400'>Beta</span>
        </div>
        <div>
          {loading ? (
            <Loader />
          ) : error ? (
            <Alert fail msg={error} />
          ) : rooms?.length > 0 ? (
            rooms?.map((room) => (
              <Link key={room?._id} to={`/h/messages/${room?.roomId}`}>
                {console.log('room', room)}
                <div className='flex items-center h-12 border-b dark:border-gray-700 p-1 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer'>
                  <div className='ml-2 flex items-center'>
                    <div className='h-8 w-8 mr-2'>
                      <img
                        alt='dp'
                        src={
                          room?.sender === loggedUserId
                            ? room?.user_dp
                              ? baseURL + '/' + room?.user_dp
                              : 'https://picsum.photos/200'
                            : room?.sender_dp
                            ? baseURL + '/' + room?.sender_dp
                            : 'https://picsum.photos/200'
                        }
                        className='w-full h-full rounded-full'
                      />
                    </div>
                    <div>
                      {loggedUserId && (
                        <p className='text-gray-500 dark:text-gray-300 font-semibold'>
                          {room?.sender === loggedUserId
                            ? room?.user_fname
                            : room?.sender_fname}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className='text-gray-400 p-1 text-center text-sm'>Empty chat</p>
          )}
        </div>
      </div>
      <div className='col-span-3 h-screen border-l dark:border-gray-700 border-r'>
        {/* chat open here */}
        <Routes>
          <Route path={`:roomId`} element={<OpenChatScreen />} />
        </Routes>
      </div>
    </div>
  );
};

export default ChatScreen;
