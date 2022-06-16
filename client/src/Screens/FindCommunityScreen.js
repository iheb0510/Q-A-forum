import React, { useEffect, useState } from 'react';
import FindCommunityContainer from '../Container/FindCommunityContainer';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../actions/profile';
import axios from 'axios';
import GithubScreen from './GithubScreen';
import Alert from '../Components/Alert';
import baseURL from '../baseURL';
import DevAboutScreen from './DevAboutScreen';
import { addCommunity } from '../actions/community';
import User from '../Components/User';
import Modal from '../Components/Modal';
import { Field, FieldArray, Formik } from 'formik';
import MyTextField from '../Components/MyTextField';
import * as yup from 'yup';
import Checkbox from '../Components/Checkbox';

const FindCommunityScreen = () => {
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState(false);

  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;

  const devProfile = useSelector((state) => state.profile);
  const { user } = devProfile;

  const communityInfo = useSelector((state) => state.community);
  const { loading, error, community } = communityInfo;

  const [dp, setDp] = useState(null);
  const [cover, setCover] = useState(null );
  const [coverImage, setCoverImage] = useState(
    baseURL + '/uploads/images/cover.png'
  );
  const [photoImage, setPhotoImage] = useState(baseURL + '/uploads/images/community.jpg' );


  useEffect(() => {
    if (!editModal) {
      setCoverImage(baseURL + '/uploads/images/cover.png');
      setPhotoImage(baseURL + '/uploads/images/community.jpg' );
      setDp(null);
      setCover(null);
    }
  }, [editModal]);

  const fieldValidationSchema = yup.object().shape({
    name: yup
      .string()
      .max(35, 'Must be 35 charecters or less!')
      .min(4, 'At least 4 charecter!')
      .required('Required!'),
    description: yup
      .string()
      .max(150, 'Max 150 charecters')
      .min(5, 'Min 5 charecter')
      .required('Required!'),
  });

  const uploadDpFileHandler = (e) => {
    const file = e.target.files[0];
    setPhotoImage((window.URL || Window.webkitURL).createObjectURL(file));
    setDp(file);
  };
  const uploadCoverFileHandler = async (e) => {
    const file = e.target.files[0];
    setCoverImage((window.URL || Window.webkitURL).createObjectURL(file));
    setCover(file);
  };

  return (
    <div className='grid grid-cols-4 h-full'>
      <div className='col-span-4 md:col-span-3'>
        <div className='mb-2 text-xl text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full font-bold p-3 flex items-center justify-between'>
          <div className=' flex items-center mb-2 text-xl text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 '>
            Find Community
          </div>

          <div>
            <button className='text-sm bg-indigo-500 text-white font-semibold py-3 px-6 rounded-md focus:outline-none hover:bg-indigo-600'
            onClick={() => setEditModal(!editModal)}>
             <i className='fas fa-plus mr-1'></i>
              Add Community
            </button>
          </div>
        </div>
        <div>
          <FindCommunityContainer />
        </div>
        <Modal
            modalOpen={editModal}
            setModalOpen={setEditModal}
            title='Create Community'
            titleIcon='fas fa-edit'
            large
          >
            <>
              <div className='dp_cover_uplaod flex '>
                <div className='w-2/5 flex flex-col space-y-2 justify-center'>
                  <img
                    className='rounded-full w-40 h-40 image_center'
                    src={photoImage}
                    alt={user?.username}
                  />
                  <input
                    onChange={uploadDpFileHandler}
                    type='file'
                    className='none text-sm focus:outline-none'
                  />
                  <div></div>
                </div>
                <div className='w-3/5 flex flex-col space-y-1 justify-center'>
                  <img
                    className='w-full rounded-xl h-40 image_center'
                    src={coverImage}
                    alt={user?.username}
                  />
                  <input
                    type='file'
                    onChange={uploadCoverFileHandler}
                    className='none text-sm focus:outline-none'
                  />
                </div>
              </div>
            </>
            {error && <Alert fail msg={error} />}
            <Formik
              initialValues={{
                name: '',
                description: '',
                private: false,
              }}
              validationSchema={fieldValidationSchema}
              onSubmit={async (data, { setSubmitting }) => {
                await dispatch(addCommunity(dp, cover, data));
                setSubmitting(false);
              }}
            >
              {({ values, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <MyTextField
                    id='fnamee'
                    type='text'
                    name='name'
                    label='Community name'
                    placeholder='Your community name'
                    flex_content
                  />
                  <MyTextField
                    id='bioo'
                    type='text'
                    name='description'
                    label='description'
                    placeholder='Write a short description'
                    flex_content
                  />

                  <Checkbox
                    id='private'
                    type='checkbox'
                    name='private'
                    label='private'
                    flex_content
                  />

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full rounded py-2 mt-6 font-medium tracking-widest text-white uppercase text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none'
                  >
                    {loading ? 'Updating...' : 'Create'}
                  </button>
                </form>
              )}
            </Formik>
          </Modal>
      </div>
    </div>
  );
};

export default FindCommunityScreen;
