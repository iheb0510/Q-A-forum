import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeWorkStatus,
  getProfile,
  reset_new_password,
} from '../actions/profile';
import Modal from '../Components/Modal';
import MyTextField from '../Components/MyTextField';
import Alert from '../Components/Alert';
import { Formik } from 'formik';
import * as yup from 'yup';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const [resetModal, setResetModal] = useState(false);

  const devProfile = useSelector((state) => state.profile);
  const { user, success, loading, error } = devProfile;

  const signInDev = useSelector((state) => state.auth);
  const { userInfo } = signInDev;

  useEffect(() => {
    dispatch(getProfile(userInfo?.user?._id));
    return () => {};
  }, [dispatch, userInfo?.user?._id]);

  useEffect(() => {
    if (success) {
      setResetModal(false);
    }
  }, [success]);

  const formValidationSchema = yup.object().shape({
    old_password: yup
      .string()
      .min(6, 'Minimum 6 character!')
      .max(10, 'Maximum 10 character!')
      .required('Previous Password Required!'),
    new_password: yup
      .string()
      .min(6, 'Minimum 6 character!')
      .max(10, 'Maximum 10 character!')
      .required('Previous Password Required!'),
    confirm_password: yup
      .string()
      .min(6, 'Minimum 6 character!')
      .max(10, 'Maximum 10 character!')
      .required('Previous Password Required!'),
  });

  return (
    <div className='p-1 text-gray-500'>
      <div className='account_wrapper shadow rounded mb-2 bg-white dark:bg-gray-700 dark:text-gray-300 w-full h-12 px-3 flex items-center'>
        <div className=''>
          <p className='text-lg font-semibold'>Account settings</p>
        </div>
        <div className='ml-auto'></div>
      </div>
      <div className='privacy_wrapper shadow rounded dark:bg-gray-700 dark:text-gray-300 mb-2 bg-white w-full h-12 px-3 flex items-center'>
        <div className=''>
          <div>
            <p className='text-lg font-semibold'>Open to Work?</p>
          </div>
        </div>
        <div className='ml-auto'>
          <select
            className='border bg-gray-100 dark:bg-gray-800 rounded p-1 font-semibold shadow-inner focus:outline-none'
            value={user?.workStatus}
            onChange={(e) =>
              dispatch(changeWorkStatus({ workStatus: e.target.value }))
            }
          >
            <option value='off'>Off</option>
            <option value='full-time'>Full-Time</option>
            <option value='part-time'>Part-Time</option>
          </select>
        </div>
      </div>
      <div className='mb-2 bg-white dark:bg-gray-700 dark:text-gray-300 shadow rounded w-full h-12 px-3 flex items-center'>
        <div className=''>
          <p className='text-lg font-semibold'>Reset Password</p>
        </div>
        <div className='ml-auto'>
          <button
            onClick={() => setResetModal(true)}
            className='h-8 rounded px-4 bg-green-500 outline-none focus:outline-none text-sm font-semibold text-white'
          >
            <i className='fas fa-sync-alt mr-2'></i>Reset
          </button>
        </div>
      </div>
      <Modal
        modalOpen={resetModal}
        setModalOpen={setResetModal}
        title='Reset Password'
        titleIcon='fas fa-key'
      >
        <Formik
          initialValues={{
            old_password: '',
            new_password: '',
            confirm_password: '',
          }}
          validationSchema={formValidationSchema}
          onSubmit={(data, { setSubmitting }) => {
            dispatch(reset_new_password(data));
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <MyTextField
                label='Previous Password'
                name='old_password'
                type='password'
                placeholder='Enter previous password'
              />
              <MyTextField
                label='New Password'
                name='new_password'
                type='password'
                placeholder='Enter new password'
              />
              <MyTextField
                label='Retype Password'
                name='confirm_password'
                type='password'
                placeholder='Retype new password'
              />
              <button
                type='submit'
                className={`text-white bg-indigo-600 ${
                  loading && 'bg-indigo-300'
                } focus:outline-none focus:bg-indigo-500 py-1.5 w-full rounded font-semibold mt-2`}
                disabled={isSubmitting}
              >
                {loading ? 'Reseting...' : 'Reset'}
              </button>
            </form>
          )}
        </Formik>
        {error && <Alert fail msg={error} />}
      </Modal>
    </div>
  );
};

export default SettingsScreen;
