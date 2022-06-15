import React, { useEffect, useState } from 'react';
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
import { editCommunity, getCommunity } from '../actions/community';
import User from '../Components/User';
import Modal from '../Components/Modal';
import { Field, FieldArray, Formik } from 'formik';
import MyTextField from '../Components/MyTextField';
import * as yup from 'yup';
import Checkbox from '../Components/Checkbox';

const CommunityViewScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[4];

  const [membersModal, setmembersModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;

  const devProfile = useSelector((state) => state.profile);
  const { user } = devProfile;

  const communityInfo = useSelector((state) => state.community);
  const { loading, error, community } = communityInfo;

  const [dp, setDp] = useState(community?.dp);
  const [cover, setCover] = useState(community?.cover);
  const [coverImage, setCoverImage] = useState(
    baseURL + '/' + community?.cover
  );
  const [photoImage, setPhotoImage] = useState(baseURL + '/' + community?.dp);

  useEffect(() => {
    const fetch = () => {
      dispatch(getCommunity(id));
    };

    return fetch;
  }, [dispatch, id]);

  useEffect(() => {
    if (!editModal) {
      setCoverImage(baseURL + '/' + community?.cover);
      setPhotoImage(baseURL + '/' + community?.dp);
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
      .min(5, 'Min 5 charecter'),
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
    <div className='profile p-1'>
      {error && <Alert fail msg={error} />}
      <div className='bg-white dark:bg-gray-800'>
        <div className='shadow rounded mb-4'>
          <div className='dev_dp_cover w-full'>
            <div className='cover w-full'>
              {loading ? (
                <div className='animate-pulse w-full h-48 bg-gray-200'></div>
              ) : (
                <img
                  className='image_center w-full h-48'
                  src={
                    community?.cover
                      ? baseURL + '/' + community?.cover
                      : 'https://picsum.photos/1920'
                  }
                  alt='cover'
                />
              )}
            </div>
            <div className='dp w-40'>
              {loading ? (
                <div className='animate-pulse relative border-2 border-indigo-400 rounded-full w-full h-40 bg-gray-200'></div>
              ) : (
                <img
                  className='image_center relative border-2 border-indigo-400 rounded-full w-full h-40'
                  src={
                    community?.dp
                      ? baseURL + '/' + community?.dp
                      : 'https://picsum.photos/200'
                  }
                  alt='dp'
                />
              )}
            </div>
          </div>
          <div className='name_others mt-1 px-3 mb-1 bg-white dark:bg-gray-800'>
            {loading ? (
              <div className='name_address_location animate-pulse'>
                <span className='bg-gray-200 p-3 mb-1 px-28 w-40 block'></span>
                <span className='bg-gray-200 h-3 mb-1 w-20 block'></span>
                <div className='h-5 mb-1 w-44 bg-gray-200'></div>
                <span className='bg-gray-200 h-3 mb-1 w-28 block'></span>
                <span className='bg-gray-200 h-3 mb-1 w-40 block'></span>
                <span className='bg-gray-200 h-3 mb-1 w-20 block'></span>
              </div>
            ) : (
              <div className='name_address_location text-gray-500 dark:text-gray-300 text-sm'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-2xl font-extrabold'>{community?.name}</h4>
                  {user?._id == community?.createdby?._id ? (
                    <button
                      onClick={() => setEditModal(!editModal)}
                      className='border border-indigo-500 font-semibold bg-indigo-500 focus:outline-none px-2 py-1 text-sm hover:bg-indigo-600 text-white rounded'
                    >
                      <i className='fas fa-edit mr-1'></i>Edit Community
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <div className='flex items-center'>
                  <span className='text-gray-400 mr-4'>
                    @{community?.createdby?.fullname}
                  </span>
                </div>
                <div className='h-5 mb-1'>{community?.description}</div>
                <div className='flex items-center space-x-2'>
                  <i className='fas fa-users mr-1'></i>
                  <button
                    onClick={() => setmembersModal(true)}
                    className='focus:outline-none hover:text-indigo-500'
                  >
                    {community?.members?.length} Members
                  </button>
                </div>

                <div className='flex items-center '>
                  <span className='mr-4'>
                    <i className='mr-2 far fa-calendar-alt'></i>Created{' '}
                    {new Date(community?.createdAt).toLocaleDateString(
                      'en-gb',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='others mt-2'>
          <nav className='bg-gray-100 dark:bg-gray-700'>
            <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-2'>
              <Link to={`/h/community/${id}/ques`}>
                <div
                  className={`flex justify-center cursor-pointer ${
                    currentPath === 'ques' &&
                    'bg-white dark:bg-gray-800 border-indigo-500'
                  }  text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                >
                  <i className='fas fa-question mr-2 text-red-500'></i>

                  <span className='h-full'> questions</span>
                </div>
              </Link>
            </div>
          </nav>
          <Modal
            modalOpen={editModal}
            setModalOpen={setEditModal}
            title='Edit Profile'
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
                name: community?.name,
                description: community?.description,
                private: community?.private,
              }}
              validationSchema={fieldValidationSchema}
              onSubmit={async (data, { setSubmitting }) => {
                await dispatch(editCommunity(dp, cover, data, id));
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
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </form>
              )}
            </Formik>
          </Modal>
          <Modal
            modalOpen={membersModal}
            setModalOpen={setmembersModal}
            title={`Members (${
              community?.members ? community?.members?.length : '0'
            })`}
            titleIcon='fas fa-users'
          >
            {community?.members?.map((u, idx) => (
              <>
                <User key={idx} user={u} />
              </>
            ))}
          </Modal>
          <div className='question_article_feed p-2 bg-white dark:bg-gray-800 w-full'>
            <Routes>
              {/* <Route
                exact
                path={path}
                component={() => <DevAboutScreen profile={user && user} />}
              /> */}
              {/*  <Route
                path={`about`}
                element={<DevAboutScreen profile={current} loading={loading} />}
              />*/}
              <Route path={`timeline`} element={<></>} />
              <Route path={`ques`} element={<></>} />
              <Route
                path='*'
                element={<Navigate to={`/h/community/${id}/ques`} replace />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityViewScreen;
