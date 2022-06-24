import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../Components/Alert';
import { addAnswer } from '../actions/question';
import Answer from '../Components/Answer';
import { Field, FieldArray, Formik } from 'formik';
import { Editor } from '@tinymce/tinymce-react';
import * as yup from 'yup';
import Modal from '../Components/Modal';
import Spinner from '../Components/Spinner';
import Loader from '../Components/Loader';

const QuestionAnswersContainer = ({ question, details }) => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const answersQuestion = useSelector((state) => state.question);
  const { loading, answers, error } = answersQuestion;

  const answersList = answers.filter((answer) => {
    if (answer.question._id === question._id) {
      return answer;
    } else {
      return null;
    }
  });

  const fieldValidationSchema = yup.object().shape({
    ansDesc: yup.string().min(10, 'At least 10 charecter!'),
  });

  return (
    <div >
      <div className='h-12 items-center bg-white dark:bg-gray-700 flex rounded shadow p-2 mt-2 '>
        <div className='mx-auto h-full flex-shrink-0 flex items-center justify-center w-12 rounded-full bg-indigo-100 dark:bg-gray-800 text-indigo-400 sm:mx-0 sm:h-10 sm:w-10'>
          <i className='fas fa-question'></i>
        </div>
        <div
          onClick={() => setModalOpen(!modalOpen)}
          className='flex items-center text-sm text-gray-400 rounded cursor-pointer ml-2 bg-gray-100 dark:bg-gray-800 p-2 h-full w-full'
        >
          Add an answer...
        </div>
      </div>
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        title='Add Answer'
        titleIcon='fas fa-question'
      >
        {/* form submission */}
        <Formik
          initialValues={{
            questionId: question._id,
            ansDesc: '',
          }}
          validationSchema={fieldValidationSchema}
          onSubmit={(data, { setSubmitting }) => {
            dispatch(addAnswer(data));
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
                      initialValue='Write...'
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
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert fail msg={error} />
      ) : answersList && answersList?.length > 0 ? (
        answersList?.map((ans) =>  <Answer key={ans?._id} ans={ans} />)
      ) : (
        <Alert msg='No answers yet!' />
      )}
    </div>
  );
};

export default QuestionAnswersContainer;
