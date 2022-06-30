import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Question from '../Components/Question';
import { getAllQuestions } from '../actions/question';

const SingleQuestionContainer = () => {
  const dispatch = useDispatch();
  const { questionId } = useParams();

  const questionsGet = useSelector((state) => state.question);
  const { questions } = questionsGet;

  useEffect(() => {
    dispatch(getAllQuestions());
  }, [dispatch]);

  const qu = questions?.find(
    (data) => data?._id.toString() === questionId.toString()
  );

  return (
    <div>
      <Question key={qu?._id} details question={qu} />
    </div>
  );
};

export default SingleQuestionContainer;
