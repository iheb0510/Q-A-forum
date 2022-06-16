import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCommunities,getRequests } from '../actions/community';
import Loader from '../Components/Loader';
import Alert from '../Components/Alert';
import Community from '../Components/Community';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';

function FindCommunityContainer() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[3];
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const devProfile = useSelector((state) => state.profile);
  const { user } = devProfile;
  
    const CommunityiNFO = useSelector((state) => state.community);
    const { loading, communities, error,requests } = CommunityiNFO;
  
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
         <nav className='bg-gray-100 dark:bg-gray-700'>
            <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-2'>
              <div className='flex items-center justify-between h-10'>
                <div className='flex items-center'>
                  <div className='flex items-baseline space-x-'>
                    <Link to={`/h/communities/all`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          (currentPath === 'all' || undefined) &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='far fa-address-card mr-2 text-blue-500'></i>
                        <span className='h-full'>All</span>
                      </div>
                    </Link>
                    <Link to={`/h/communities/me`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          currentPath === 'me' &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='fas fa-stream mr-2 text-yellow-700'></i>
                        <span className='h-full'>Created</span>
                      </div>
                    </Link>
                    <Link to={`/h/communities/joined`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          (currentPath === 'joined' || undefined) &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='far fa-address-card mr-2 text-blue-500'></i>
                        <span className='h-full'>Joined</span>
                      </div>
                    </Link>
                    <Link to={`/h/communities/discover`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          (currentPath === 'discover' || undefined) &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='far fa-address-card mr-2 text-blue-500'></i>
                        <span className='h-full'>Discover</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
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
        <Routes>
              {/* <Route
              exact
              path={path}
              component={() => <DevAboutScreen profile={user && user} />}
            /> */}
              <Route
                path={`all`}
                element= {<>{error && (
                  <Alert fail msg={error} />
                )} 
                {communitiesList?.length > 0 ? (
                  communitiesList
                    ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))
                    ?.map((community) =>  <Community key={community?._id} community={community} />)
                ) : (
                  <Alert warning msg='No Communities' />
                )}
              </>}/>
              <Route
                path={`me`}
                element= {<>{error && (
                  <Alert fail msg={error} />
                )} 
                {communitiesList?.length > 0 ? (
                  communitiesList
                    ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))?.filter((community) => community?.members?.filter((u) => u._id === user._id).length > 0 && community?.createdby._id === user._id)
                    ?.map((community) =>  <Community key={community?._id} community={community} />)
                ) : (
                  <Alert warning msg='No Communities created by you' />
                )}
              </>}/>
              <Route
                path={`joined`}
                element= {<>{error && (
                  <Alert fail msg={error} />
                )} 
                {communitiesList?.length > 0 ? (
                  communitiesList
                    ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))?.filter((community) => community?.members?.filter((u) => u._id === user._id).length > 0 && community?.createdby._id !== user._id)
                    ?.map((community) =>  <Community key={community?._id} community={community} />)
                ) : (
                  <Alert warning msg='No Communities joined to' />
                )}
              </>}/>
              <Route
                path={`discover`}
                element= {<>{error && (
                  <Alert fail msg={error} />
                )} 
                {communitiesList?.length > 0 ? (
                  communitiesList
                    ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))?.filter((community) => community?.members?.filter((u) => u._id === user._id).length <= 0 )
                    ?.map((community) =>  <Community key={community?._id} community={community} />)
                ) : (
                  <Alert warning msg='No Communities to join' />
                )}
              </>}/>
              <Route path='*' element={<Navigate to='/h/communities/all' replace />} />
            </Routes>
      </div>
    );
}

export default FindCommunityContainer