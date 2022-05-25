import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import baseURL from '../baseURL';
import Spinner from './Spinner';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './Alert';

const User = ({ user }) => {
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
          <Link to={`${`/h/user/${user?._id}`}`}>
            {console.log('eede', user)}
            <p className='hover:text-indigo-500 font-semibold'>
              {user?.fullname}
            </p>
          </Link>
          <p className='-mt-1 text-xs italic'>{user?.bio}</p>
          <div className={`flex mt-1 items-center text-xs`}>
            {user?.topSkills?.map((skill, idx) => (
              <span
                key={idx}
                className='pl-1 dark:bg-gray-700 dark:text-gray-300 bg-gray-200 mr-2 mb-2 text-xs text-gray-500 py-.5 px-1 rounded mb-1'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
