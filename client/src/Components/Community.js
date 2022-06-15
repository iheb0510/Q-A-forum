import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import baseURL from '../baseURL';
import Spinner from './Spinner';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './Alert';
import { getRequests, joinCommunity } from '../actions/community';

function Community({ community }) {
  const dispatch = useDispatch();
  const devProfile = useSelector((state) => state.profile);
  const { error, user } = devProfile;
  const devvom = useSelector((state) => state.community);
  const { loading, requests } = devvom;

  const joinHandler = () => {
    if (community) {
      dispatch(joinCommunity(community?._id));
    }
  };
  return (
    <div className='w-full bg-white dark:bg-gray-800 rounded p-2 shadow mb-2 flex items-center justify-between'>
      <div className='flex items-center'>
        <div className='w-10 h-10 mr-2'>
          <Link to={`${`/h/community/${community?._id}`}`}>
            <img
              className='w-full h-full rounded-full'
              src={
                community?.dp
                  ? baseURL + '/' + community?.dp
                  : 'https://picsum.photos/200'
              }
              alt='dp'
            />
          </Link>
        </div>
        <div className='text-gray-500 dark:text-gray-300'>
          <Link to={`${`/h/community/${community?._id}`}`}>
            <p className='hover:text-indigo-500 font-semibold'>
              {community?.name}
            </p>
          </Link>
          <p className='-mt-1 text-xs italic'>{community?.description}</p>
        </div>
      </div>
      <div>
        {community?.members?.filter((u) => u === user._id).length <= 0 ? (
          requests?.filter(
            (u) => u.sentby === user._id && u.community === community?._id
          ).length > 0 ? (
            <button className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600'>
              Request already sent
            </button>
          ) : (
            <button
              onClick={joinHandler}
              className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600'
            >
              <i className='fas fa-user-minus mr-1'></i>
              Join     
            </button>
          )
        ) : (
          <button className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600'>
            Joined
          </button>
        )}
      </div>
    </div>
  );
}

export default Community;
