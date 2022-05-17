import React from 'react';
import { Link, useLocation, Route, Routes, Navigate } from 'react-router-dom';
import SidebarMenu from '../Components/SidebarMenu';
import AskQuestionsScreen from './AskQuestionsScreen';
import ProfileScreen from './ProfileScreen';
import ProfileViewScreen from './ProfileViewScreen';
import FindPeopleScreen from './FindPeopleScreen';
import SettingsScreen from './SettingsScreen';
import FindCommunityScreen from './FindCommunityScreen';
import CommunityViewScreen from './CommunityViewScreen';

const HomeScreen = () => {
  const location = useLocation();
  const pathName = location.pathname.split('/')[2];

  return (
    <div className='border-t-2 dark:border-gray-800 h-full'>
      <div className='dark:bg-gray-900 grid grid-cols-5'>
        <div className='col-span-1 h-full'>
          <div className='text-gray-600 dark:text-gray-400 h-full'>
            <Link
              to={`/h/forum`}
              className={
                pathName === 'forum' || undefined ? 'text-indigo-600' : ''
              }
            >
              <SidebarMenu fontAwesome='fas fa-users' text={'Forum'} />
            </Link>
            <Link
              to={`/h/people`}
              className={pathName === 'people' ? 'text-indigo-600' : ''}
            >
              <SidebarMenu
                fontAwesome='fas fa-user-plus'
                text={'Find People'}
              />
            </Link>
            <Link
              to={`/h/communities`}
              className={pathName === 'communities' ? 'text-indigo-600' : ''}
            >
              <SidebarMenu
                fontAwesome='fas fa-user-plus'
                text={'Find Community'}
              />
            </Link>
            <Link
              to={`/h/settings`}
              className={pathName === 'settings' ? 'text-indigo-600' : ''}
            >
              <SidebarMenu fontAwesome='fas fa-cog' text={'Settings'} />
            </Link>
            <Link
              to={`/h/profile`}
              className={pathName === 'profile' ? 'text-indigo-600' : ''}
            >
              <SidebarMenu fontAwesome='fas fa-user-circle' text='Profile' />
            </Link>
          </div>
        </div>
        <div className='col-span-4 bg-gray-50 dark:bg-gray-900 w-full h-full'>
          <Routes>
            <Route path={`forum`} element={<AskQuestionsScreen />} />
            <Route path={`people`} element={<FindPeopleScreen />} />
            <Route path={`communities`} element={<FindCommunityScreen />} />
            <Route path={`settings`} element={<SettingsScreen />} />
            <Route path={`profile`} element={<ProfileScreen />} />
            <Route path={`user/:id`} element={<ProfileViewScreen />} />
            <Route path={`community/:id`} element={<CommunityViewScreen />} />
            <Route path='*' element={<Navigate to='/h/forum' replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
