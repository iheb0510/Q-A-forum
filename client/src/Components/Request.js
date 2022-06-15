import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import baseURL from '../baseURL';
import Spinner from './Spinner';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './Alert';
import {
  acceptRequest,
  getRequests,
  refuseRequest,
} from '../actions/community';

const Request = ({ request }) => {
  const dispatch = useDispatch();
  const devProfile = useSelector((state) => state.profile);
  const { error, user } = devProfile;
  const devvom = useSelector((state) => state.community);
  const { loading, requests } = devvom;

  const AcceptHandler = () => {
    if (request) {
      dispatch(acceptRequest(request?._id));
    }
  };
  const RefuseHandler = () => {
    if (request) {
      dispatch(refuseRequest(request?._id));
    }
  };
  return (
    <div className='w-full bg-white dark:bg-gray-800 rounded p-2 shadow mb-2 flex items-center justify-between'>
      <div className='flex items-center'>
        <div className='w-10 h-10 mr-2'>
          <Link to={`${`/h/user/${user?._id}`}`}>
            <img
              className='w-full h-full rounded-full'
              src={
                user?.dp
                  ? baseURL + '/' + user?.dp
                  : 'https://picsum.photos/200'
              }
              alt='dp'
            />
          </Link>
        </div>
        <div className='text-gray-500 dark:text-gray-300'>
          <Link to={`${`/h/user/${request?.sentby?._id}`}`}>
            <p className='hover:text-indigo-500 font-semibold'>
              {request?.sentby?.fullname}
            </p>
          </Link><span> <p className='-mt-1 text-xs italic'>send a request to join</p></span>
         <span>
         <Link to={`${`/h/community/${request?.community?._id}`}`}>
            <p className='hover:text-indigo-500 font-semibold'>
              {request?.community?.name}
            </p>
          </Link>
         </span>
         
        </div>
      </div>
      <div>
        <button
          onClick={AcceptHandler}
          className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600'
        >
          <i className='fas fa-user-minus mr-1'></i>
          Accept
        </button>
        <span> </span>
        <button
          onClick={RefuseHandler}
          className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600'
        >
          <i className='fas fa-user-minus mr-1'></i>
          Refuse
        </button>
      </div>
    </div>
  );
};

export default Request;
