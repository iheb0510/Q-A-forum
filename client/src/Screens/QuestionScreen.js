import React, { useState, useEffect } from 'react';
import QuestionContainer from '../Container/QuestionContainer';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import SingleQuestionContainer from '../Container/SingleQuestionContainer';
import { Field, FieldArray, Formik } from 'formik';
import MyTextField from '../Components/MyTextField';
import { Editor } from '@tinymce/tinymce-react';
import * as yup from 'yup';
import { addQuestion } from '../actions/question';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../actions/profile';
import Modal from '../Components/Modal';
import Spinner from '../Components/Spinner';
import Alert from '../Components/Alert';
import QuestionByTagContainer from '../Container/QuestionByTagContainer';

const QuestionScreen = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[4];
  const dispatch = useDispatch();
  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;
  const devProfile = useSelector((state) => state.profile);
  const { user } = devProfile;

  useEffect(() => {
    dispatch(getProfile(userInfo?.user?._id));
  }, [dispatch,userInfo?.user?._id]);

  const [modalOpen, setModalOpen] = useState(false);

  const question = useSelector((state) => state.question);
  const { loading, error } = question;

  const fieldValidationSchema = yup.object().shape({
    title: yup
      .string()
      .max(100, 'Not greater than 100!')
      .min(10, 'At least 10 charecter!')
      .required('Required!'),
    description: yup
      .string()
      .min(10, 'At least 10 charecter!'),
  });

  return (
    <div>
      <div className='h-12 items-center bg-white dark:bg-gray-700 flex rounded shadow p-2 mt-2'>
        <div className='mx-auto h-full flex-shrink-0 flex items-center justify-center w-12 rounded-full bg-indigo-100 dark:bg-gray-800 text-indigo-400 sm:mx-0 sm:h-10 sm:w-10'>
          <i className='fas fa-question'></i>
        </div>
        <div
          onClick={() => setModalOpen(!modalOpen)}
          className='flex items-center text-sm text-gray-400 rounded cursor-pointer ml-2 bg-gray-100 dark:bg-gray-800 p-2 h-full w-full'
        >
          Ask a Question...
        </div>
      </div>
      {error && <Alert fail msg={error} />}
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        title='Ask Question'
        titleIcon='fas fa-question'
      >
        {/* form submission */}
        <Formik
          initialValues={{
            title: '',
            description: '',
            communityId: `${user?.communities?.length > 0 ?user?.communities[0]?._id :''}`,
            tags: [],
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data, { setSubmitting }) => {
            dispatch(addQuestion(data));
            console.log(data);
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
                      initialValue='Write...'
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          'codesample',
                          'advlist' ,'autolink', 'lists' ,'link' ,'image' ,'charmap' ,'print' ,'preview' ,'anchor',
                          'searchreplace' ,'visualblocks' ,'code' ,'fullscreen',
                          'insertdatetime',
                          ' media' ,'table', 'paste', 'code' ,'help', 'wordcount',
                        ],
                        codesample_languages: [
                          {text: 'HTML/XML', value: 'markup'},
                          {text: 'JavaScript', value: 'javascript'},
                          {text: 'CSS', value: 'css'},
                          {text: 'PHP', value: 'php'},
                          {text: 'Ruby', value: 'ruby'},
                          {text: 'Python', value: 'python'},
                          {text: 'Java', value: 'java'},
                          {text: 'C', value: 'c'},
                          {text: 'C#', value: 'csharp'},
                          {text: 'C++', value: 'cpp'}
                      ],
                        toolbar:
                          'codesample | undo redo | formatselect | bold italic backcolor |  alignleft aligncenter alignright alignjustify |  bullist numlist outdent indent | removeformat | help',
                        codesample_content_css: "http://ourcodeworld.com/material/css/prism.css",
                        codesample_dialog_height: 100,
                        codesample_dialog_width: 100
                      }}
                      onEditorChange={(content) => {
                        values.description = content;
                        console.log(content);
                      }}
                      outputFormat='html' /// will be fix later for input rich text
                    />
                    {meta.touched && meta.error ? (
                      <div className='text-red-500 text-sm'>{meta.error}</div>
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
                      <option value={community._id}>{community?.name}</option>
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
                {loading ? <Spinner /> : 'Post'}
              </button>
            </form>
          )}
        </Formik>
      </Modal>
      <Routes>
        <Route exact path={'*'} element={<QuestionContainer />} />
        <Route path={`:questionId`} element={<SingleQuestionContainer />} />
        <Route path={`/by/Tag`} element={<QuestionByTagContainer />} />
        <Route path='*' element={<Navigate to='/h/forum/question' replace />} />
      </Routes>
    </div>
  );
};

export default QuestionScreen;
