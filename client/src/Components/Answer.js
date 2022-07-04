import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DownvoteIcon from './DownvoteIcon';
import UpvoteIcon from './UpvoteIcon';
import _ from 'lodash';
import {
  upvoteAnswer,
  downvoteAnswer,
  deleteAnswer,
  editAnswer,
  markAsSolved
} from '../actions/question';
import { useDispatch, useSelector } from 'react-redux';
import Prism from 'prismjs';
import '../prism.css';
import 'prismjs/themes/prism-night-owl.css';
import 'prismjs/components/prism-java.min';
import 'prismjs/plugins/toolbar/prism-toolbar.min';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min';
import 'prismjs/plugins/show-language/prism-show-language.min';
import ReactHtmlParser from 'html-react-parser';
import moment from 'moment';
import { Field, FieldArray, Formik } from 'formik';
import { Editor } from '@tinymce/tinymce-react';
import * as yup from 'yup';
import Modal from '../Components/Modal';
import Spinner from '../Components/Spinner';
import Loader from '../Components/Loader';
import AnswerCommentsContainer from '../Container/AnswerCommentsContainer';

const Answer = ({ ans,question }) => {
  const dispatch = useDispatch();
  const [CommentsOpen, setCommentsOpen] = useState(false);
  const [showComment, setshowComment] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const signIn = useSelector((state) => state.auth);
  const { userInfo } = signIn;
  const answersQuestion = useSelector((state) => state.question);
  const { loading, answers, error } = answersQuestion;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const deleteHandler = () => {
    dispatch(deleteAnswer(ans?._id));
  };
  const fieldValidationSchema = yup.object().shape({
    ansDesc: yup.string().min(10, 'At least 10 charecter!'),
  });
  return (
    <>
      <div className='w-full bg-white dark:bg-gray-800 rounded shadow my-2 px-5 py-2 '>
        <div className='flex h-full items-center  my-1.5 '>
          <div className='mr-3 w-6 h-full'>
            {ans?.upvotes?.filter(
              (o) => o.user.toString() == userInfo?.user?._id?.toString()
            ).length > 0 ? (
              <button
                className='w-full outline-none focus:outline-none'
                onClick={() => {
                  dispatch(upvoteAnswer(ans?._id));
                }}
              >
                <UpvoteIcon color={true} />
              </button>
            ) : (
              <button
                className='w-full outline-none focus:outline-none'
                onClick={() => {
                  dispatch(upvoteAnswer(ans?._id));
                }}
              >
                <UpvoteIcon />
              </button>
            )}
            {ans?.downvotes?.filter(
              (o) => o.user.toString() == userInfo?.user?._id?.toString()
            ).length > 0 ? (
              <button
                className='w-full outline-none focus:outline-none'
                onClick={() => {
                  dispatch(downvoteAnswer(ans?._id));
                }}
              >
                <DownvoteIcon color={true} />
              </button>
            ) : (
              <button
                className='w-full outline-none focus:outline-none'
                onClick={() => {
                  dispatch(downvoteAnswer(ans?._id));
                }}
              >
                <DownvoteIcon />
              </button>
            )}
          </div>
          <div className='h-full w-full'>
            <div className=' w-auto overflow-hidden '>
              <div className='text-gray-500 dark:text-gray-300 text-xs sm:text-sm h-auto w-full text-justify'>
                {ReactHtmlParser(ans.ansDesc)}
              </div>
            </div>
            <div className='text-gray-400 text-xs mt-3'>
              <span className='mr-3'>
                <i className='fas fa-arrow-up mr-1'></i>
                {ans?.upvotes?.length} upvotes
              </span>
              <span className='mr-5'>
                <i className='fas fa-arrow-down mr-1'></i>
                {ans?.downvotes?.length} downvotes
              </span>
              <i className='fas fa-marker mr-1'></i>written by- @
              <Link  to={
                    userInfo?.user?._id.toString() ===
                    question?.user?._id.toString()
                      ? `/h/profile/about`
                      : `/h/user/${ans?.user?._id}`
                  }>
                <span className='cursor-pointer hover:text-indigo-600 '>
                  {ans?.user?.fullname}
                </span>
              </Link>
              <span className='ml-4'>
                <i className='far fa-clock mr-1'></i>
                {moment(ans?.createdAt).fromNow()}
              </span>
             {ans?.solution &&
             (<span className='ml-4 text-green-600 '>
             <i className='fas fa-check-circle mr-1 '></i>
             Best answer
           </span>)} 
              
            </div>
          </div>
        </div>

       
          <div
            onClick={() => setshowComment(!showComment)}
            className='flex items-center justify-center mt-1 sm:mt-3 border-t dark:border-gray-600 cursor-pointer pt-1 text-center text-sm mr-2 text-gray-500'
          >
          <div className={`flex hover:text-indigo-600  ${showComment && 'text-indigo-600 dark:text-gray-300'} items-center justify-center w-1/2`}>
            <span className='w-4 mr-2'>
              <svg
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
            <span className='text-xs sm:text-sm'>Comments</span>
          </div>

          {userInfo?.user?._id.toString() === ans?.user?._id.toString() && (
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
          {!ans?.solution &&
              userInfo?.user?._id.toString() ===
              question?.user?._id.toString() && !question?.solved && (
              <div
                onClick={() => dispatch(markAsSolved(ans?._id))}
                className='w-1/2  hover:text-indigo-600'
              >
                <span className='text-xs sm:text-sm'>
                  <i className='mr-1 fas fa-check'></i> Mark as solution
                </span>
              </div>
              
            )}
          {userInfo?.user?._id.toString() === ans?.user?._id.toString() && (
            <div
              onClick={() => deleteHandler(ans?._id)}
              className='w-1/2  hover:text-indigo-600'
            >
              <span className='text-xs sm:text-sm'>
                <i className='mr-1 far fa-trash-alt'></i> Delete
              </span>
            </div>
          )}
        </div>
      </div>
      <Modal
        modalOpen={editModal}
        setModalOpen={setEditModal}
        title='Edit Answer'
        titleIcon='fas fa-question'
      >
        {/* form submission */}
        <Formik
          initialValues={{
            questionId: ans?.question._id,
            ansDesc: ans?.ansDesc,
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data, { setSubmitting }) => {
            dispatch(editAnswer(ans._id, data));
            console.log(data);
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name='ansDesc'>
                {({ field, meta }) => (
                  <div>
                    <Editor
                      style={{ backgroundColor: 'transparent' }}
                      id='article_body'
                      apiKey={
                        'uo6i9dlzabg2amjtpmqupqdo751g154lvb9w1mes12x3jrlm'
                      }
                      initialValue={ans.ansDesc}
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
                        values.ansDesc = content;
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

      {showComment && <AnswerCommentsContainer ans={ans} />}
    </>
  );
};

export default Answer;
