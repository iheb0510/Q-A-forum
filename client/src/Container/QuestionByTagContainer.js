import React, { useEffect, useState } from 'react';
import Alert from '../Components/Alert';
import Loader from '../Components/Loader';
import {
  getAllAnswers,
  getAllMyQuestions,
  getAllQuestions,
} from '../actions/question';
import { useDispatch, useSelector } from 'react-redux';
import Question from '../Components/Question';
import ReactTagInput from '@pathofdev/react-tag-input';

const QuestionByTagContainer = () => {
  const dispatch = useDispatch();
  const [tags, setTags] = useState([]);

  const questionsGet = useSelector((state) => state.question);
  const { loading, questions, error } = questionsGet;

  useEffect(() => {
    dispatch(getAllAnswers());
  }, [dispatch]);

  const filterQuestions = questions?.filter((question) => {
    if (tags?.length < 1) {
      return questions;
    } else {
      const contain = question?.tags?.map((tag) => {
        const queryTag = tags.map((t) =>
          t.toLowerCase() === tag.name.toLowerCase() ? true : false
        );
        if (queryTag.includes(true)) {
          return true;
        } else {
          return false;
        }
      });
      if (contain.includes(true)) {
        return question;
      } else {
        return null;
      }
    }
  });

  return (
    <>
      <div className='rounded bg-white dark:bg-gray-700 mt-2 p-2 shadow'>
        <span className='text-sm text-gray-500 dark:text-gray-200 font-semibold'>
          <i className='fas fa-filter mr-1'></i>Filter Question
        </span>
        <div className='dark:text-gray-300'>
          <ReactTagInput
            style={{ dark: 'bg-gray-800' }}
            placeholder='Add a Tag'
            maxTags='10'
            editable='true'
            tags={tags}
            removeOnBackspace={true}
            onChange={(newTag) => setTags(newTag)}
          />
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert fail msg={error} />
      ) : filterQuestions && filterQuestions?.length > 0 ? (
        filterQuestions?.map((qu) => <Question key={qu?._id} question={qu} />)
      ) : (
        <Alert warning msg='No questions available!' />
      )}
    </>
  );
};

export default QuestionByTagContainer;
