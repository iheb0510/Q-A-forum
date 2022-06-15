import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCommunities,getRequests } from '../actions/community';
import Loader from '../Components/Loader';
import Alert from '../Components/Alert';
import Community from '../Components/Community';

function FindCommunityContainer() {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
  
    const CommunityiNFO = useSelector((state) => state.community);
    const { loading, communities, error } = CommunityiNFO;
  
    useEffect(() => {
      dispatch(getRequests());
      dispatch(getAllCommunities());
    }, [dispatch]);
  
    const communitiesList = communities?.filter((community) =>
      searchText !== ''
        ? community?.name?.toLowerCase().includes(searchText?.toLocaleLowerCase())
        : community
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
          {error && (
            <Alert fail msg={error} />
          )} 
          {communitiesList?.length > 0 ? (
            communitiesList
              ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))
              ?.map((community) =>  <Community key={community?._id} community={community} />)
          ) : (
            <Alert msg='No Communities!' />
          )}
        </div>
      </div>
    );
}

export default FindCommunityContainer