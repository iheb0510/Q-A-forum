import { Field, FieldArray, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import baseURL from '../baseURL';
import Spinner from '../Components/Spinner';
import { Editor } from '@tinymce/tinymce-react';
import Prism from 'prismjs';
import '../prism.css';
import 'prismjs/themes/prism-night-owl.css';
import 'prismjs/components/prism-java.min';
import 'prismjs/plugins/toolbar/prism-toolbar.min';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min';
import 'prismjs/plugins/show-language/prism-show-language.min';
import ReactHtmlParser from 'html-react-parser';

import {
  deleteQuestion,
  downvoteQuestion,
  editQuestion,
  upvoteQuestion,
  viewQuestion,
} from '../actions/question';
import Alert from './Alert';
import Loader from './Loader';
import MyTextField from './MyTextField';
import UpvoteIcon from './UpvoteIcon';
import DownvoteIcon from './DownvoteIcon';
import * as yup from 'yup';
//import QuestionAnswersContainer from '../Container/QuestionAnswersContainer';
import Modal from './Modal';
import QuestionAnswersContainer from '../Container/QuestionAnswersContainer';

const Question = ({ question, details }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ansOpen, setAnsOpen] = useState(details ? true : false);
  const [editModal, setEditModal] = useState(false);

  //const history = useHistory();

  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;

  const quest = useSelector((state) => state.question);
  const { loading, success, error } = quest;

  const devProfile = useSelector((state) => state.profile);
  const { user } = devProfile;

  useEffect(() => {
    Prism.highlightAll();
  }, [question]);

  const deleteHandler = (id) => {
    dispatch(deleteQuestion(id));
    navigate(`/h/forum/questions`);
  };

  const fieldValidationSchema = yup.object().shape({
    title: yup
      .string()
      .max(100, 'Not greater than 100!')
      .min(10, 'At least 10 charecter!')
      .required('Required!'),
    description: yup
      .string()
      .max(1000, 'Must be 500 charecter or less!')
      .min(10, 'At least 10 charecter!'),
  });

  return (
    <>
      <div className='w-full bg-white dark:bg-gray-800 shadow rounded-md my-2 px-5 py-2 '>
        <div className='flex h-auto items-center justify-between  pb-2 my-1.5 border-b dark:border-gray-600 '>
          <div className='mr-3  flex-none w-8 h-8 sm:w-8 sm:h-8'>
            <Link to={`${`/h/community/${question?.community?._id}`}`}>
              <img
                className='border w-full h-full rounded-full'
                src={
                  question?.user?.dp
                    ? baseURL + '/' + question?.community?.dp
                    : 'https://picsum.photos/200'
                }
                alt={question?.user?.username}
              />
            </Link>
          </div>

          <div className=' flex-auto h-full w-auto'>
            <div className=' overflow-hidden '>
              <Link
                to={`/h/forum/questions/${
                  question && question?._id.toString()
                }`}
              >
                <div
                  className='text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-600  cursor-pointer text-xl font-semibold'
                  onClick={() => {
                    dispatch(viewQuestion(question?._id));
                  }}
                >
                  {question?.title}
                </div>
              </Link>
            </div>
            <div className='text-gray-400 text-xs mt-1'>
              <span className='mr-3'>
                <i className='fas fa-marker mr-1'></i>written by- @
                <Link
                  to={
                    userInfo?.user?._id.toString() ===
                    question?.user?._id.toString()
                      ? `/h/profile/about`
                      : `/h/user/${question?.user?._id}`
                  }
                >
                  <span className='cursor-pointer hover:text-indigo-600 '>
                    {question?.user?.fullname}
                  </span>
                </Link>
              </span>

              <span className='mr-3'>
                <i className='fas fa-arrow-up mr-1'></i>
                {question?.upvotes?.length} upvotes
              </span>
              <span className='mr-3'>
                <i className='fas fa-arrow-down mr-1'></i>
                {question?.downvotes?.length} downvotes
              </span>
              <span className='mr-3'>
                <i className='fas fa-eye mr-1'></i>
                {question?.views?.length} views
              </span>
              <span className='mr-3'>
                <i className='far fa-clock mr-1'></i>
                {moment(question?.createdAt).fromNow()}
              </span>
              {question?.solved === true && (
                <span className='mr-4 text-green-600 '>
                  <i className='fas fa-check-circle mr-1 '></i>
                  Solved
                </span>
              )}
            </div>
          </div>
          {details ? (
            <div className='flex-none w-6 h-full'>
              <div className='mr-0'>
                {question?.upvotes?.filter(
                  (o) => o.user.toString() == userInfo?.user?._id?.toString()
                ).length > 0 ? (
                  <button
                    className='w-full outline-none focus:outline-none'
                    onClick={() => {
                      dispatch(upvoteQuestion(question?._id));
                    }}
                  >
                    <UpvoteIcon color={true} />
                  </button>
                ) : (
                  <button
                    className='w-full outline-none focus:outline-none'
                    onClick={() => {
                      dispatch(upvoteQuestion(question?._id));
                    }}
                  >
                    <UpvoteIcon />
                  </button>
                )}
                {question?.downvotes.filter(
                  (o) => o.user.toString() == userInfo?.user?._id?.toString()
                ).length > 0 ? (
                  <button
                    className='w-full outline-none focus:outline-none'
                    onClick={() => {
                      dispatch(downvoteQuestion(question?._id));
                    }}
                  >
                    <DownvoteIcon color={true} />
                  </button>
                ) : (
                  <button
                    className='w-full outline-none focus:outline-none'
                    onClick={() => {
                      dispatch(downvoteQuestion(question?._id));
                    }}
                  >
                    <DownvoteIcon />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className=' flex-none w-6 h-full'></div>
          )}
        </div>

        {details && (
          <div className='text-gray-500 dark:text-gray-300 text-xs sm:text-sm h-auto w-full text-justify overflow-hidden '>
            {ReactHtmlParser(question?.description)}
          </div>
        )}
        <div className={`flex mt-1 sm:mt-2 items-center text-xs`}>
          {question?.tags?.map((tag, idx) => (
            <span
              key={idx}
              className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600 mr-2'
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div
          onClick={() => setAnsOpen(!ansOpen)}
          className='flex items-center justify-center mt-1 sm:mt-3 border-t dark:border-gray-600 cursor-pointer pt-1 text-center text-sm mr-2 text-gray-500'
        >
          {details && (
            <div
              className={`flex hover:text-indigo-600  ${
                ansOpen && 'text-indigo-600 dark:text-gray-300'
              } items-center justify-center w-1/2`}
            >
              <span className='mr-1'>
                <svg
                  style={{ width: '15px' }}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
                  />
                </svg>
              </span>
              <span className='text-xs sm:text-sm'>Answers</span>
            </div>
          )}
          {details &&
            userInfo?.user?._id.toString() ===
              question?.user?._id.toString() && (
              <div
                onClick={() => {
                  setEditModal(true);
                }}
                className='w-1/2  hover:text-indigo-600'
              >
                <span className='text-xs sm:text-sm'>
                  <i className='mr-1 far fa-edit'></i>Edit
                </span>
              </div>
            )}
          {details &&
            userInfo?.user?._id.toString() ===
              question?.user?._id.toString() && (
              <div
                onClick={() => deleteHandler(question?._id)}
                className='w-1/2  hover:text-indigo-600'
              >
                <span className='text-xs sm:text-sm'>
                  <i className='mr-1 far fa-trash-alt'></i> Delete
                </span>
              </div>
            )}
          <Modal
            modalOpen={editModal}
            setModalOpen={setEditModal}
            title='Edit Question'
            titleIcon='fas fa-edit'
          >
            {/* form submission */}
            <Formik
              initialValues={{
                title: question?.title,
                description: question?.description,
                tags: question?.tags?.map((tag) => {
                  return tag?.name;
                }),
                communityId: question?.community?._id,
              }}
              validationSchema={fieldValidationSchema}
              onSubmit={(data, { setSubmitting }) => {
                dispatch(editQuestion(question?._id, data));
                setSubmitting(false);
              }}
            >
              {({ values, isSubmitting, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <MyTextField
                    id='title'
                    type='text'
                    name='title'
                    label='Title'
                    placeholder='Question title'
                  />
                  <label
                    htmlFor='article_body'
                    className='block mt-2 mb-1 font-semibold text-xs dark:text-gray-300 text-gray-600 uppercase'
                  >
                    Description
                  </label>
                  <Field name='description'>
                    {({ field, meta }) => (
                      <div>
                        <Editor
                          style={{ backgroundColor: 'transparent' }}
                          id='article_body'
                          apiKey={
                            'uo6i9dlzabg2amjtpmqupqdo751g154lvb9w1mes12x3jrlm'
                          }
                          initialValue={question?.description}
                          init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                              'codesample',
                              'advlist',
                              'autolink',
                              'lists',
                              'link',
                              'image',
                              'charmap',
                              'print',
                              'preview',
                              'anchor',
                              'searchreplace',
                              'visualblocks',
                              'code',
                              'fullscreen',
                              'insertdatetime',
                              ' media',
                              'table',
                              'paste',
                              'code',
                              'help',
                              'wordcount',
                            ],
                            codesample_languages: [
                              { text: 'HTML/XML', value: 'markup' },
                              { text: 'JavaScript', value: 'javascript' },
                              { text: 'CSS', value: 'css' },
                              { text: 'PHP', value: 'php' },
                              { text: 'Ruby', value: 'ruby' },
                              { text: 'Python', value: 'python' },
                              { text: 'Java', value: 'java' },
                              { text: 'C', value: 'c' },
                              { text: 'C#', value: 'csharp' },
                              { text: 'C++', value: 'cpp' },
                            ],
                            toolbar:
                              'codesample | undo redo | formatselect | bold italic backcolor |  alignleft aligncenter alignright alignjustify |  bullist numlist outdent indent | removeformat | help',
                            codesample_content_css:
                              'http://ourcodeworld.com/material/css/prism.css',
                            codesample_dialog_height: 100,
                            codesample_dialog_width: 100,
                          }}
                          onEditorChange={(content) => {
                            values.description = content;
                            console.log(content);
                          }}
                          outputFormat='html' /// will be fix later for input rich text
                        />
                        {meta.touched && meta.error ? (
                          <div className='text-red-500 text-sm'>
                            {meta.error}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </Field>
                  <div>
                    <label
                      className='dark:text-gray-300 block mt-2 mb-2 text-xs font-semibold text-gray-600 uppercase'
                      htmlFor='platform'
                    >
                      Select community
                    </label>
                    <Field
                      id='communityId'
                      as='select'
                      label='Community'
                      name='communityId'
                      className='border dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 text-sm rounded py-1.5 px-2 block focus:outline-none focus:border-indigo-600 w-full'
                    >
                      {user?.communities?.length > 0 &&
                        user?.communities.map((community) => (
                          <option value={community._id}>
                            {community?.name}
                          </option>
                        ))}
                    </Field>
                  </div>
                  <FieldArray
                    name='tags'
                    render={(arrayHelpers) => (
                      <div className='flex items-center mt-2'>
                        <div className='w-2/5'>
                          <label className='block dark:text-gray-300 mt-2 text-xs font-semibold text-gray-600 uppercase'>
                            Tags
                          </label>
                        </div>
                        <div className='w-3/5 border border-blue-300 p-2 rounded'>
                          {values.tags?.length > 0 ? (
                            values.tags?.map((data, idx) => (
                              <div
                                key={idx}
                                className='float-left mr-2 flex items-center'
                              >
                                <Field
                                  type='text'
                                  name={`tags.${idx}`}
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
                              Add Tag
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full rounded py-2 mt-6 font-medium tracking-widest text-white text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none'
                  >
                    {loading ? <Spinner /> : 'Edit'}
                  </button>
                </form>
              )}
            </Formik>
          </Modal>
        </div>
        <div className=''>
          {loading ? <Loader /> : error && <Alert fail msg={error} />}
        </div>
      </div>
      <div>
        {ansOpen && <QuestionAnswersContainer question={question} details />}
      </div>
    </>
  );
};

export default Question;
