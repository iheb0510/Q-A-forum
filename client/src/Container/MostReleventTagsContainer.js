import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '../Components/Alert';
import Loader from '../Components/Loader';
import { getAllQuestions, getTags } from '../actions/question';
import ReactTagInput from '@pathofdev/react-tag-input';
import TopQuestion from '../Components/TopQuestion';
import TopReleventTag from '../Components/TopReleventTag.js';

const TopQuestionContainer = () => {
  const dispatch = useDispatch();


  const fetchAllQuestions = useSelector((state) => state.question);
  const { loading, tags, error } = fetchAllQuestions;

  useEffect(() => {
    dispatch(getTags());
    return () => {};
  }, [dispatch]);



  return (
    <> 
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert fail msg={error} />
      ) : tags?.length > 0 && (
        tags
          ?.sort((a, b) => (a.count < b.count ? 1 : -1))?.slice(0,50)
          ?.map((t) => <TopReleventTag key={t._id} tag={t} />)
      ) }
    </>
  );
};

export default TopQuestionContainer;