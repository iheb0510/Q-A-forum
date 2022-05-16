import React, { useState } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MyTextField from '../Components/MyTextField';
import * as yup from 'yup';
import { resetPassword } from '../actions/auth';
import Spinner from '../Components/Spinner';
import Alert from '../Components/Alert';

const RecoverPassword = () => {
  const dispatch = useDispatch();
  const [ok, setOk] = useState(false);

  const { token } = useParams();

  const info = useSelector((state) => state.auth);
  const { loading, error } = info;

  const formValidationSchema = yup.object().shape({
    new_password: yup
      .string()
      .min(6, 'Minimum 6 character!')
      .max(15, 'Maximum 10 character!')
      .required('Required!'),
    confirm_password: yup
      .string()
      .min(6, 'Minimum 6 character!')
      .max(15, 'Maximum 10 character!')
      .required('Required!'),
  });

  return (
    <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full bg-gray-50 p-6 space-y-8'>
        <p className='text-gray-600 text-xl font-semibold'>Reset Password</p>
        <Formik
          initialValues={{
            new_password: '',
            confirm_password: '',
          }}
          validationSchema={formValidationSchema}
          onSubmit={(data, { setSubmitting }) => {
            dispatch(
              resetPassword(token, data?.new_password, data?.confirm_password)
            );
            setSubmitting(false);
            setOk(true);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
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
                  'loading' && 'bg-indigo-300'
                } focus:outline-none focus:bg-indigo-500 py-1.5 w-full rounded font-semibold mt-2`}
                disabled={isSubmitting}
              >
                {loading ? <Spinner small /> : 'Reset'}
              </button>
            </form>
          )}
        </Formik>
        <div className='mt-2'>
          {!error && ok ? (
            <Alert success msg={'Password reset successfully!!'} />
          ) : (
            error && <Alert fail msg={error} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
