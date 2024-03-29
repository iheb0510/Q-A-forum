import React, { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../actions/profile';
import axios from 'axios';
import GithubScreen from './GithubScreen';
import Alert from '../Components/Alert';
import baseURL from '../baseURL';
import DevAboutScreen from './DevAboutScreen';
import ProfileQuestionScreen from './ProfileQuestionScreen';
import Spinner from '../Components/Spinner';
import { v4 as uuidv4 } from 'uuid';
import { createChatRoom } from '../actions/chat';

const ProfileViewScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[4];
  const [roomId, setRoomId] = useState('');

  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;

  const devProfile = useSelector((state) => state.profile);
  const { loading, error, current } = devProfile;

  useEffect(() => {
    const fetch = () => {
      dispatch(getUser(id));
      console.log('3DDD3', id);
    };

    return fetch;
  }, [dispatch, id]);

  const createRoomForNewConversation = (receiverId) => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    const roomInfo = {
      roomId: newRoomId,
      receiver: receiverId,
      user_fname: current?.fullname,
      user_dp: current?.dp,
    };
    dispatch(createChatRoom(roomInfo));
    setTimeout(() => {
      navigate(`/h/messages/${newRoomId}`);
    }, 1000);
  };

  return (
    <div className='profile p-1'>
      {error && <Alert fail msg={error} />}
      <div className='bg-white dark:bg-gray-800'>
        <div className='shadow rounded mb-4'>
          <div className='dev_dp_cover w-full'>
            <div className='cover w-full'>
              {loading ? (
                <div className='animate-pulse w-full h-48 bg-gray-200'></div>
              ) : (
                <img
                  className='image_center w-full h-48'
                  src={
                    current?.cover
                      ? baseURL + '/' + current?.cover
                      : 'https://picsum.photos/1920'
                  }
                  alt='cover'
                />
              )}
            </div>
            <div className='dp w-40'>
              {loading ? (
                <div className='animate-pulse relative border-2 border-indigo-400 rounded-full w-full h-40 bg-gray-200'></div>
              ) : (
                <img
                  className='image_center relative border-2 border-indigo-400 rounded-full w-full h-40'
                  src={
                    current?.dp
                      ? baseURL + '/' + current?.dp
                      : 'https://picsum.photos/200'
                  }
                  alt='dp'
                />
              )}
            </div>
          </div>
          <div className='name_others mt-1 px-3 mb-1 bg-white dark:bg-gray-800'>
            {loading ? (
              <div className='name_address_location animate-pulse'>
                <span className='bg-gray-200 p-3 mb-1 px-28 w-40 block'></span>
                <span className='bg-gray-200 h-3 mb-1 w-20 block'></span>
                <div className='h-5 mb-1 w-44 bg-gray-200'></div>
                <span className='bg-gray-200 h-3 mb-1 w-28 block'></span>
                <span className='bg-gray-200 h-3 mb-1 w-40 block'></span>
                <span className='bg-gray-200 h-3 mb-1 w-20 block'></span>
              </div>
            ) : (
              <div className='name_address_location text-gray-500 dark:text-gray-300 text-sm'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-2xl font-extrabold'>
                    {current?.fullname}
                  </h4>
                  <div className='flex items-center'>
                    {current?._id !== userInfo?.user?._id && (
                      <button
                        onClick={() =>
                          createRoomForNewConversation(current?._id)
                        }
                        className='border border-indigo-500 font-semibold bg-indigo-500 focus:outline-none px-2 py-1 text-sm hover:bg-indigo-600 text-white rounded'
                      >
                        {loading ? (
                          <Spinner small />
                        ) : (
                          <i className='fas fa-paper-plane mr-1'></i>
                        )}{' '}
                        Send Message
                      </button>
                    )}
                  </div>
                </div>
                <div className='flex items-center'>
                  <span className='text-gray-400 mr-4'>
                    @{current?.username}
                  </span>
                  <span className='mr-4'>
                    {current?.points && <i className='mr-2 fas fa-star'></i>}
                    {current?.points}
                    {' points'}
                  </span>
                  <span className='mr-4'>
                    {current?.badge && <i className='mr-2 fas fa-crown'></i>}
                    {current?.badge}
                  </span>

                  {current?.workStatus !== 'off' && (
                    <div className='ml-2 flex justify-start items-center text-xs'>
                      <span className='w-3 h-3 rounded-full bg-green-400 mr-1'></span>
                      <span className='text-gray-400'>
                        Open to Work ({current?.workStatus})
                      </span>
                    </div>
                  )}
                </div>
                <div className='h-5 mb-1'>{current?.bio}</div>
                <span className='mr-4'>
                  {current?.email && (
                    <i className='mr-2 fas fa-envelope-open-text'></i>
                  )}
                  {current?.email}
                </span>
                <span>
                  {current?.website && <i className='mr-2 fas fa-globe'></i>}
                  <a
                    className='hover:text-indigo-500 hover:underline'
                    target='_blank'
                    rel='noreferrer'
                    href={current?.website}
                  >
                    {current?.website}
                  </a>
                </span>

                <div className='flex items-center '>
                  <span className='mr-4'>
                    <i className='mr-2 far fa-calendar-alt'></i>Joined{' '}
                    {new Date(current?.createdAt).toLocaleDateString('en-gb', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className=''>
                    {current?.location && (
                      <i className='fas mr-2 fa-map-marker-alt'></i>
                    )}
                    {current?.location}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className='social_links cursor-pointer px-3 pb-2 text-xl flex items-center space-x-2'>
            {loading ? (
              <div className='h-5 bg-gray-200 w-full'></div>
            ) : (
              current?.social?.length > 0 &&
              current?.social?.reverse().map((el, idx) => {
                const icn_cls =
                  el.platform === 'facebook'
                    ? 'fab fa-facebook text-blue-600 hover:text-blue-700'
                    : el.platform === 'twitter'
                    ? 'fab fa-twitter text-blue-400 hover:text-blue-500'
                    : el.platform === 'instagram'
                    ? 'fab fa-instagram text-pink-600 hover:text-pink-700'
                    : el.platform === 'linkedin'
                    ? 'fab fa-linkedin text-blue-700 hover:text-blue-800'
                    : el.platform === 'medium'
                    ? 'fab fa-medium text-blue-700 hover:text-blue-800'
                    : el.platform === 'github'
                    ? 'fab fa-github text-gray-800 dark:text-gray-600 dark:hover:text-gray-400 hover:text-gray-900'
                    : el.platform === 'dribble'
                    ? 'fas fa-basketball-ball text-pink-500 hover:text-pink-600'
                    : el.platform === 'behance'
                    ? 'fab fa-behance-square text-blue-800 hover:text-blue-900'
                    : el.platform === 'portfolio'
                    ? 'fas fa-globe-asia text-gray-400 hover:text-gray-500'
                    : el.platform === 'stackoverflow' &&
                      'fab fa-stack-overflow text-yellow-600 hover:text-amber-700';
                return (
                  <Link
                    to={'/h/profile/about'}
                    key={idx}
                    onClick={() =>
                      window.open(
                        el.link.includes('http')
                          ? el.link
                          : `http://${el.link}`,
                        '_blank'
                      )
                    }
                  >
                    <i className={icn_cls}></i>
                  </Link>
                );
              })
            )}
          </div>
        </div>
        <div className='others mt-2'>
          <nav className='bg-gray-100 dark:bg-gray-700'>
            <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-2'>
              <div className='flex items-center justify-between h-10'>
                <div className='flex items-center'>
                  <div className='flex items-baseline space-x-'>
                    <Link to={`/h/user/${id}/about`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          (currentPath === 'about' || undefined) &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='far fa-address-card mr-2 text-blue-500'></i>
                        <span className='h-full'>About</span>
                      </div>
                    </Link>
                    <Link to={`/h/user/${id}/gh-profile`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          currentPath === 'gh-profile' &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='fas fa-code-branch mr-2 text-green-600'></i>
                        <span className='h-full'>GitHub</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className='question_article_feed p-2 bg-white dark:bg-gray-800 w-full'>
            <Routes>
              {/* <Route
                exact
                path={path}
                component={() => <DevAboutScreen profile={user && user} />}
              /> */}
              <Route
                path={`about`}
                element={<DevAboutScreen profile={current} loading={loading} />}
              />
              <Route
                path={`gh-profile`}
                element={<GithubScreen username={current?.github} />}
              />
              <Route
                path={`ques`}
                element={<ProfileQuestionScreen id={id} />}
              />
              <Route
                path='*'
                element={<Navigate to={`/h/user/${id}/about`} replace />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewScreen;
