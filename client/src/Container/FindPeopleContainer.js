import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../actions/profile';
import Loader from '../Components/Loader';
import Alert from '../Components/Alert';
import User from '../Components/User';

const FindPeopleContainer = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');

  const usersGet = useSelector((state) => state.profile);
  const { loading, users, error } = usersGet;

  useEffect(() => {
    dispatch(getUsers());
    
  }, [dispatch]);

  const usersList = users?.filter((user) =>
    searchText !== ''
      ? user?.fullname?.toLowerCase().includes(searchText?.toLocaleLowerCase())
      : user
  );
  return (
    <div className='px-2'>
      <div className='w-full mb-2 shadow bg-white dark:bg-gray-700 rounded p-2'>
        <div>
          <p
            className='font-semibold text-gray-500 dark:text-gray-300 text-sm'
            htmlFor='srcName'
          >
            Search by Name
          </p>
        </div>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder='Type a name...'
          className='dark:bg-gray-800 rounded w-full p-1 dark:text-gray-300 dark:border-gray-600 focus:outline-none border-b focus:border-blue-500 dark:focus:border-blue-500 focus:border-b-2 text-sm'
        />
      </div>
      <div>
        {loading ? (
          <Loader />
        ) : error ? (
          <Alert fail msg={error} />
        ) : usersList?.length > 0 ? (
          usersList
            ?.sort((a, b) => (a?.fullname > b?.fullname ? 1 : -1))
            ?.map((user) =>  <User key={user?._id} user={user} />)
        ) : (
          <Alert msg='No Users!' />
        )}
      </div>
    </div>
  );
};

export default FindPeopleContainer;
