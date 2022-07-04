import React, { useEffect } from 'react';
import './styles/main.css';
import '@pathofdev/react-tag-input/build/index.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from './Screens/ForgotPassword';
import HomeScreen from './Screens/HomeScreen';
import LoginPage from './Screens/LoginPage';
import RegPage from './Screens/RegPage';
import Welcome from './Screens/Welcome';
import Header from './Components/Header';
import RecoverPassword from './Screens/RecoverPassword';
import ActivateAccount from './Screens/ActivateAccount';
import PrivateRoute from './Components/PrivateRoute';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000');

function App() {
  return (
    <div className='bg-white w-full min-h-screen dark:bg-gray-900'>
      <div className='max-w-7xl h-full mx-auto bg-white dark:bg-gray-900'>
        <Header />
        <div className='w-full px-4 sm:px-6 h-auto lg:px-8'>
          <Routes>
            <Route path='/' exact element={<Welcome />} />
            <Route path='/registration' element={<RegPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route
              path='/recover-password/:token'
              element={<RecoverPassword />}
            />
            <Route path='/activate/:token' element={<ActivateAccount />} />
            <Route
              path='/h/*'
              element={
                <PrivateRoute>
                  <HomeScreen />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
