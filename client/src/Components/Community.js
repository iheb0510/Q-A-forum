import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import baseURL from '../baseURL';
import Spinner from './Spinner';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './Alert';
import { deleteRequest, exitCommunity, getRequests, joinCommunity } from '../actions/community';

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
  const deleteHandler = () => {
    if (community) {
       const request = requests?.find((u) => u.sentby === user._id && u.community === community?._id)
      dispatch(deleteRequest(request?._id));
    }
  };
  const exitHandler = () => {
    if (community) {
      dispatch(exitCommunity(community?._id));
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
        {community?.members?.filter((u) => u._id === user._id).length <= 0 ? (
          requests?.filter(
            (u) => u.sentby === user._id && u.community === community?._id
          ).length > 0 ? (
            <button
              onClick={deleteHandler}
              className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600'
            >
              Delete Request
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
        ) : community?.createdby?._id !== user._id ? (
          <button
              onClick={exitHandler}
              className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600'
            >
              Exit community
            </button>
        ) : (
          <div className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600 disabled'>
            yours
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;
