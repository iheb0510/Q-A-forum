import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '../Components/Alert';
import Loader from '../Components/Loader';
import { getAllQuestions } from '../actions/question';
import ReactTagInput from '@pathofdev/react-tag-input';
import TopQuestion from '../Components/TopQuestion';

const TopQuestionContainer = () => {
  const dispatch = useDispatch();

  const [tags, setTags] = useState([]);

  const fetchAllQuestions = useSelector((state) => state.question);
  const { loading, questions, error } = fetchAllQuestions;

  useEffect(() => {
    dispatch(getAllQuestions());
    return () => {};
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
      <div className='rounded bg-white dark:bg-gray-700 mt-2 mb-2 p-2 shadow'>
        <span className='text-sm text-gray-500 dark:text-gray-200 font-semibold'>
          <i className='fas fa-filter mr-1'></i>
          Filter Article
        </span>
        <div>
          <ReactTagInput
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
      ) : filterQuestions?.length > 0 && (
        filterQuestions
          ?.sort((a, b) => (a.upvotes.length < b.upvotes.length ? 1 : -1))?.slice(0,5)
          ?.map((q) => <TopQuestion key={q._id} question={q} />)
      ) }
    </>
  );
};

export default TopQuestionContainer;