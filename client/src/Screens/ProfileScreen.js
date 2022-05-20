import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile, getProfile } from '../actions/profile';

import axios from 'axios';
import GithubScreen from './GithubScreen';
import Alert from '../Components/Alert';
import baseURL from '../baseURL';
import Modal from '../Components/Modal';
import Loader from '../Components/Loader';
import Spinner from '../Components/Spinner';
import { Field, FieldArray, Formik } from 'formik';
import MyTextField from '../Components/MyTextField';
import * as yup from 'yup';
import DevAboutScreen from './DevAboutScreen';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[3];

  const [editModal, setEditModal] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);

  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;

  const devProfile = useSelector((state) => state.profile);
  const { loading, error, user } = devProfile;

  const [dp, setDp] = useState(user?.dp);
  const [cover, setCover] = useState(user?.cover);
  const [coverImage, setCoverImage] = useState(baseURL + '/' + user?.cover);
  const [photoImage, setPhotoImage] = useState(baseURL + '/' + user?.dp);

  useEffect(() => {
    const fetch = () => {
      dispatch(getProfile(userInfo?.user?._id));
      console.log(userInfo?.user?._id);
    };

    return fetch;
  }, [dispatch, userInfo?.user?._id]);

  useEffect(() => {
    if (editModal) {
      setCoverImage(baseURL + '/' + user?.cover);
      setPhotoImage(baseURL + '/' + user?.dp);
      setDp(null);
      setCover(null);
    }
    dispatch(getProfile(userInfo?.user?._id));
  }, [editModal]);

  const fieldValidationSchema = yup.object().shape({
    fullname: yup
      .string()
      .max(35, 'Must be 35 charecters or less!')
      .min(4, 'At least 4 charecter!')
      .required('Required!'),
    username: yup
      .string()
      .max(15, 'Must be 15 charecter or less!')
      .min(4, 'At least 4 charecter!')
      .required('Required!'),
    bio: yup.string().max(150, 'Max 150 charecters').min(5, 'Min 5 charecter'),
    location: yup.string().max(100).min(5, 'Min 5 charecter'),
    website: yup.string().max(100).min(5, 'Min 5 charecter').url(),
    social: yup.array().of(
      yup.object().shape({
        link: yup.string().url(),
      })
    ),
    education: yup.array().of(
      yup.object().shape({
        institute: yup.string().max(100).min(5).required(),
        from: yup
          .number()
          .min(1950, 'Min year 1950!')
          .max(2021, 'Max year 2021!')
          .required(),
        to: yup
          .number()
          .min(1950, 'Min year 1950!')
          .max(2021, 'Max year 2021!'),
        desc: yup.string().max(100),
        type: yup.string().max(50),
      })
    ),
    experience: yup.array().of(
      yup.object().shape({
        company: yup.string().max(100).min(5).required(),
        role: yup.string().max(50).min(5).required(),
        from: yup
          .number()
          .min(1950, 'Min year 1950!')
          .max(2021, 'Max year 2021!')
          .required(),
        to: yup
          .number()
          .min(1950, 'Min year 1950!')
          .max(2021, 'Max year 2021!'),
        desc: yup.string().max(100),
      })
    ),
    github: yup.string().min(1).max(20),
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
                    user?.cover
                      ? baseURL + '/' + user?.cover
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
                    user?.dp
                      ? baseURL + '/' + user?.dp
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
                  <h4 className='text-2xl font-extrabold'>{user?.fullname}</h4>
                  <button
                    onClick={() => setEditModal(!editModal)}
                    className='border border-indigo-500 font-semibold bg-indigo-500 focus:outline-none px-2 py-1 text-sm hover:bg-indigo-600 text-white rounded'
                  >
                    <i className='fas fa-edit mr-1'></i>Edit Profile
                  </button>
                </div>
                <div className='flex items-center'>
                  <span className='text-gray-400'>@{user?.username}</span>
                  {user?.workStatus !== 'off' && (
                    <div className='ml-2 flex justify-start items-center text-xs'>
                      <span className='w-3 h-3 rounded-full bg-green-400 mr-1'></span>
                      <span className='text-gray-400'>
                        Open to Work ({user?.workStatus})
                      </span>
                    </div>
                  )}
                </div>
                <div className='h-5 mb-1'>{user?.bio}</div>
                <span className='mr-4'>
                  {user?.email && (
                    <i className='mr-2 fas fa-envelope-open-text'></i>
                  )}
                  {user?.email}
                </span>
                <span>
                  {user?.website && <i className='mr-2 fas fa-globe'></i>}
                  <a
                    className='hover:text-indigo-500 hover:underline'
                    target='_blank'
                    rel='noreferrer'
                    href={user?.website}
                  >
                    {user?.website}
                  </a>
                </span>
                <div className='flex items-center space-x-2'>
                  <i className='fas fa-users mr-1'></i>
                  <button
                    onClick={() => setFollowerModal(true)}
                    className='focus:outline-none hover:text-indigo-500'
                  >
                    {user?.followers?.length} Followers
                  </button>
                  <button
                    onClick={() => setFollowingModal(true)}
                    className='focus:outline-none hover:text-indigo-500'
                  >
                    {user?.following?.length} Following
                  </button>
                </div>
                <div className='flex items-center '>
                  <span className='mr-4'>
                    <i className='mr-2 far fa-calendar-alt'></i>Joined{' '}
                    {new Date(user?.createdAt).toLocaleDateString('en-gb', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className=''>
                    {user?.location && (
                      <i className='fas mr-2 fa-map-marker-alt'></i>
                    )}
                    {user?.location}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className='social_links cursor-pointer px-3 pb-2 text-xl flex items-center space-x-2'>
            {loading ? (
              <div className='h-5 bg-gray-200 w-full'></div>
            ) : (
              user?.socials?.length > 0 &&
              user?.socials?.reverse().map((el, idx) => {
                const icn_cls =
                  el.platform === 'facebook'
                    ? 'fab fa-facebook text-blue-600 hover:text-blue-700'
                    : el.platform === 'twitter'
                    ? 'fab fa-twitter text-blue-400 hover:text-blue-500'
                    : el.platform === 'instagram'
                    ? 'fab fa-instagram text-pink-600 hover:text-pink-700'
                    : el.platform === 'linkedin'
                    ? 'fab fa-linkedin text-blue-700 hover:text-blue-800'
                    : el.platform === 'medium'
                    ? 'fab fa-medium text-blue-700 hover:text-blue-800'
                    : el.platform === 'github'
                    ? 'fab fa-github text-gray-800 dark:text-gray-600 dark:hover:text-gray-400 hover:text-gray-900'
                    : el.platform === 'dribble'
                    ? 'fas fa-basketball-ball text-pink-500 hover:text-pink-600'
                    : el.platform === 'behance'
                    ? 'fab fa-behance-square text-blue-800 hover:text-blue-900'
                    : el.platform === 'portfolio'
                    ? 'fas fa-globe-asia text-gray-400 hover:text-gray-500'
                    : el.platform === 'stackoverflow' &&
                      'fab fa-stack-overflow text-yellow-600 hover:text-amber-700';
                return (
                  <a key={idx} href={el.link}>
                    <i className={icn_cls}></i>
                  </a>
                );
              })
            )}
          </div>
        </div>
        <div className='others mt-2'>
          <nav className='bg-gray-100 dark:bg-gray-700'>
            <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-2'>
              <div className='flex items-center justify-between h-10'>
                <div className='flex items-center'>
                  <div className='flex items-baseline space-x-'>
                    <Link to={`/h/profile/about`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          (currentPath === 'about' || undefined) &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='far fa-address-card mr-2 text-blue-500'></i>
                        <span className='h-full'>About</span>
                      </div>
                    </Link>
                    <Link to={`/h/profile/timeline`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          currentPath === 'timeline' &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='fas fa-stream mr-2 text-yellow-700'></i>
                        <span className='h-full'>Timeline</span>
                      </div>
                    </Link>
                    <Link to={`/h/profile/gh-profile`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          currentPath === 'gh-profile' &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        } text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='fas fa-code-branch mr-2 text-green-600'></i>
                        <span className='h-full'>GitHub</span>
                      </div>
                    </Link>
                    <Link to={`/h/profile/ques`}>
                      <div
                        className={`flex items-center cursor-pointer ${
                          currentPath === 'ques' &&
                          'bg-white dark:bg-gray-800 border-indigo-500'
                        }  text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-t-2 border-transparent px-3 py-2.5 text-sm font-medium`}
                      >
                        <i className='fas fa-question mr-2 text-red-500'></i>

                        <span className='h-full'>My questions</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          {/* Edit Modal */}
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
                fullname: user?.fullname,
                username: user?.username,
                bio: user?.bio,
                location: user?.location,
                website: user?.website,
                social: user?.social,
                education: user?.education,
                experience: user?.experience,
                github: user?.github,
                topSkills: user?.topSkills,
                otherSkills: user?.otherSkills,
              }}
              validationSchema={fieldValidationSchema}
              onSubmit={async (data, { setSubmitting }) => {
                await dispatch(editProfile(dp, cover, data));
                setSubmitting(false);
              }}
            >
              {({ values, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <MyTextField
                    id='fnamee'
                    type='text'
                    name='fullname'
                    label='Full name'
                    placeholder='Your full name'
                    flex_content
                  />
                  <MyTextField
                    id='usernamee'
                    type='text'
                    name='username'
                    label='Username'
                    placeholder='Username'
                    flex_content
                  />
                  <MyTextField
                    id='bioo'
                    type='text'
                    name='bio'
                    label='Bio'
                    placeholder='Write a short bio'
                    flex_content
                  />
                  <MyTextField
                    id='locationn'
                    type='text'
                    name='location'
                    label='Location'
                    placeholder='Your location'
                    flex_content
                  />
                  <MyTextField
                    id='websitee'
                    type='text'
                    name='website'
                    label='Website Link'
                    placeholder='Enter a Link'
                    flex_content
                  />
                  <MyTextField
                    id='githubb'
                    type='text'
                    name='github'
                    label='Github '
                    placeholder='Your github username'
                    flex_content
                  />
                  <FieldArray
                    name='topSkills'
                    render={(arrayHelpers) => (
                      <div className='flex items-center mt-2'>
                        <div className='w-2/5'>
                          <label className='block dark:text-gray-300 mt-2 text-xs font-semibold text-gray-600 uppercase'>
                            Top Skills
                          </label>
                        </div>
                        <div className='w-3/5 border border-blue-300 p-2 rounded'>
                          {values.topSkills?.length > 0 ? (
                            values.topSkills?.map((data, idx) => (
                              <div
                                key={idx}
                                className='float-left mr-2 flex items-center'
                              >
                                <Field
                                  type='text'
                                  name={`topSkills.${idx}`}
                                  value={data}
                                  className='border dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 focus:border-indigo-300 rounded focus:outline-none text-sm px-1'
                                />
                                <div className='ml-2 flex text-gray-400 items-center space-x-2 justify-center'>
                                  <button
                                    type='button'
                                    onClick={() => arrayHelpers.remove(idx)}
                                  >
                                    <i className='far fa-trash-alt'></i>
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => arrayHelpers.insert(idx, '')}
                                  >
                                    <i className='fas fa-plus'></i>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <button
                              className='focus:outline-none dark:text-gray-300 text-indigo-800 text-sm p-1 px-4 rounded border-dotted border-4 border-light-blue-500'
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add Skills
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <FieldArray
                    name='otherSkills'
                    render={(arrayHelpers) => (
                      <div className='flex items-center mt-2'>
                        <div className='w-2/5'>
                          <label className='dark:text-gray-300 block mt-2 text-xs font-semibold text-gray-600 uppercase'>
                            Other Skills
                          </label>
                        </div>
                        <div className='w-3/5 items-center border border-yellow-300 p-2 rounded'>
                          {values.otherSkills?.length > 0 ? (
                            values.otherSkills?.map((data, idx) => (
                              <div
                                key={idx}
                                className='float-left mr-2 flex items-center'
                              >
                                <Field
                                  type='text'
                                  name={`otherSkills.${idx}`}
                                  value={data}
                                  className='border dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 focus:border-indigo-300 rounded focus:outline-none text-sm px-1'
                                />
                                <div className='ml-2 flex text-gray-400 items-center space-x-2 justify-center'>
                                  <button
                                    type='button'
                                    onClick={() => arrayHelpers.remove(idx)}
                                  >
                                    <i className='far fa-trash-alt'></i>
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => arrayHelpers.insert(idx, '')}
                                  >
                                    <i className='fas fa-plus'></i>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <button
                              className='focus:outline-none dark:text-gray-300 text-indigo-800 text-sm p-1 px-4 rounded border-dotted border-4 border-light-blue-500'
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add Skills
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <FieldArray
                    name='education'
                    render={(arrayHelpers) => (
                      <div className='flex items-center mt-2'>
                        <div className='w-2/5'>
                          <label className='dark:text-gray-300 block mt-2 text-xs font-semibold text-gray-600 uppercase'>
                            Education
                          </label>
                        </div>
                        <div className='w-3/5 border border-green-400 p-2 rounded space-y-2'>
                          {values.education?.length > 0 ? (
                            values.education?.map((data, idx) => (
                              <div key={idx}>
                                <MyTextField
                                  type='text'
                                  id='ins'
                                  label='Institute'
                                  placeholder='Institute Name'
                                  name={`education.${idx}.institute`}
                                />
                                <div className='flex space-x-4 items-center mb-1'>
                                  <MyTextField
                                    type='number'
                                    placeholder='Year'
                                    id='from'
                                    label='From'
                                    name={`education.${idx}.from`}
                                  />
                                  <MyTextField
                                    id='to'
                                    label='To'
                                    type='number'
                                    placeholder='Year'
                                    name={`education.${idx}.to`}
                                  />
                                  <MyTextField
                                    id='present'
                                    label='Present'
                                    type='checkbox'
                                    className='border dark:border-gray-600 rounded dark:bg-gray-800 py-2 px-3 mr-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm'
                                    name={`education.${idx}.present`}
                                  />
                                  <MyTextField
                                    id='type'
                                    label='Level'
                                    type='text'
                                    placeholder='JSC / SSC / HSC / Bachelor / Masters'
                                    name={`education.${idx}.type`}
                                  />
                                </div>

                                <MyTextField
                                  id='desc'
                                  type='text'
                                  label='Description'
                                  name={`education.${idx}.desc`}
                                />
                                <div className='flex mt-2 items-center space-x-2 justify-center'>
                                  <button
                                    className='py-1.5 rounded-full text-gray-400 focus:outline-none px-3 border border-gray-300'
                                    type='button'
                                    onClick={() => arrayHelpers.remove(idx)}
                                  >
                                    <i className='far fa-trash-alt'></i>
                                  </button>
                                  <button
                                    className='py-1.5 rounded-full text-gray-400 focus:outline-none px-3 border border-gray-300'
                                    type='button'
                                    onClick={() => arrayHelpers.insert(idx, '')}
                                  >
                                    <i className='fas fa-plus'></i>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <button
                              className='dark:text-gray-300 focus:outline-none  text-indigo-800 text-sm p-1 px-4 rounded border-dotted border-4 border-light-blue-500'
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add Education
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <FieldArray
                    name='experience'
                    render={(arrayHelpers) => (
                      <div className='flex items-center mt-2'>
                        <div className='w-2/5'>
                          <label className='dark:text-gray-300 block mt-2 text-xs font-semibold text-gray-600 uppercase'>
                            Experience
                          </label>
                        </div>
                        <div className='w-3/5  border border-indigo-400 p-2 rounded space-y-2'>
                          {values.experience?.length > 0 ? (
                            values.experience?.map((data, idx) => (
                              <div key={idx} className='mb-2'>
                                <MyTextField
                                  type='text'
                                  id='company'
                                  placeholder='Company Name'
                                  label='Company'
                                  name={`experience.${idx}.company`}
                                />
                                <MyTextField
                                  type='text'
                                  id='role'
                                  placeholder='Your role'
                                  label='Role / Position'
                                  name={`experience.${idx}.role`}
                                />
                                <div className='flex items-center space-x-4 mb-1'>
                                  <MyTextField
                                    placeholder='Year'
                                    id='from'
                                    type='number'
                                    label='From'
                                    name={`experience.${idx}.from`}
                                  />
                                  <MyTextField
                                    id='to'
                                    type='number'
                                    label='To'
                                    placeholder='Year'
                                    name={`experience.${idx}.to`}
                                  />
                                  <MyTextField
                                    id='present'
                                    type='checkbox'
                                    label='Present'
                                    className='border dark:bg-gray-800 dark:border-gray-600 rounded py-2 px-3 mr-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:z-10 sm:text-sm'
                                    name={`experience.${idx}.present`}
                                  />
                                </div>
                                <div className='w-full mb-1'>
                                  <MyTextField
                                    id='desc'
                                    type='text'
                                    label='Description'
                                    name={`experience.${idx}.desc`}
                                  />
                                </div>
                                <div className='flex mt-2 items-center space-x-2 justify-center'>
                                  <button
                                    className='py-1.5 rounded-full text-gray-400 focus:outline-none px-3 border border-gray-300'
                                    type='button'
                                    onClick={() => arrayHelpers.remove(idx)}
                                  >
                                    <i className='far fa-trash-alt'></i>
                                  </button>
                                  <button
                                    className='py-1.5 rounded-full text-gray-400 focus:outline-none px-3 border border-gray-300'
                                    type='button'
                                    onClick={() => arrayHelpers.insert(idx, '')}
                                  >
                                    <i className='fas fa-plus'></i>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <button
                              className='dark:text-gray-300 focus:outline-none text-indigo-800 text-sm p-1 px-4 rounded border-dotted border-4 border-light-blue-500'
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add Experience
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <FieldArray
                    name='social'
                    render={(arrayHelpers) => (
                      <div className='flex items-center mt-2'>
                        <div className='w-2/5'>
                          <label className='dark:text-gray-300 block mt-2 text-xs font-semibold text-gray-600 uppercase'>
                            Social links
                          </label>
                        </div>
                        <div className='w-3/5  border border-yellow-400 p-2 rounded space-y-2'>
                          {values.social?.length > 0 ? (
                            values.social?.map((data, idx) => (
                              <div key={idx} className='mb-2  '>
                                <div className='flex items-center space-x-4 '>
                                  <div>
                                    <label
                                      className='dark:text-gray-300 block mt-2 mb-2 text-xs font-semibold text-gray-600 uppercase'
                                      htmlFor='platform'
                                    >
                                      Select platform
                                    </label>
                                    <Field
                                      id='platform'
                                      as='select'
                                      label='Platform'
                                      name={`social.${idx}.platform`}
                                      className='border dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 text-sm rounded py-1.5 px-2 block focus:outline-none focus:border-indigo-600'
                                    >
                                      <option value='facebook'>Facebook</option>
                                      <option value='instagram'>
                                        Instagram
                                      </option>
                                      <option value='twitter'>Twitter</option>
                                      <option value='linkedin'>LinkedIn</option>
                                      <option value='github'>GitHub</option>
                                      <option value='dribble'>Dribble</option>
                                      <option value='behance'>Behance</option>
                                      <option value='portfolio'>
                                        Portfolio
                                      </option>
                                      <option value='stackoverflow'>
                                        Stack Overflow
                                      </option>
                                      <option value='medium'>Medium</option>
                                    </Field>
                                  </div>

                                  <MyTextField
                                    id='link'
                                    type='text'
                                    label='Link'
                                    placeholder='Website URL'
                                    name={`social.${idx}.link`}
                                  />
                                </div>
                                <div className='flex mt-2 items-center space-x-2 justify-center'>
                                  <button
                                    className='py-1.5 rounded-full text-gray-400 focus:outline-none px-3 border border-gray-300'
                                    type='button'
                                    onClick={() => arrayHelpers.remove(idx)}
                                  >
                                    <i className='far fa-trash-alt'></i>
                                  </button>
                                  <button
                                    className='py-1.5 rounded-full text-gray-400 focus:outline-none px-3 border border-gray-300'
                                    type='button'
                                    onClick={() => arrayHelpers.insert(idx, '')}
                                  >
                                    <i className='fas fa-plus'></i>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <button
                              className='dark:text-gray-300 focus:outline-none text-indigo-800 text-sm p-1 px-4 rounded border-dotted border-4 border-light-blue-500'
                              type='button'
                              onClick={() => arrayHelpers.push('')}
                            >
                              Add Social Link
                            </button>
                          )}
                        </div>
                      </div>
                    )}
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
            modalOpen={followerModal}
            setModalOpen={setFollowerModal}
            title={`Followers (${
              user?.followers ? user?.followers?.length : '0'
            })`}
            titleIcon='fas fa-users'
          ></Modal>
          <Modal
            modalOpen={followingModal}
            setModalOpen={setFollowingModal}
            title={`Following (${
              user?.following ? user?.following?.length : '0'
            })`}
            titleIcon='fas fa-users'
          ></Modal>
          <div className='question_article_feed p-2 bg-white dark:bg-gray-800 w-full'>
            <Routes>
              {/* <Route
              exact
              path={path}
              component={() => <DevAboutScreen profile={user && user} />}
            /> */}
              <Route
                path={`about`}
                element={<DevAboutScreen profile={user} loading={loading} />}
              />
              <Route
                path={`gh-profile`}
                element={<GithubScreen username={user?.github} />}
              />
              <Route path={`timeline`} element={<></>} />
              <Route path={`ques`} element={<></>} />
              <Route
                path='*'
                element={<Navigate to={'/h/profile/about'} replace />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
