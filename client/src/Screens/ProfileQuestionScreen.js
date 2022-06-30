import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../Components/Alert';
import Question from '../Components/Question';
import Loader from '../Components/Loader';
import { getAllMyQuestions } from '../actions/question';

const ProfileQuestionScreen = ({id}) => {
  const dispatch = useDispatch();
  const userQuestions = useSelector((state) => state.question);
  const { loading, error, questions } = userQuestions;
  useEffect(() => {
    dispatch(getAllMyQuestions(id));
    return () => {};
  }, [dispatch,id]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert fail msg={error} />
      ) : questions?.length > 0 ? (
        questions.map((qu) => (
          <Question question={qu} key={qu?._id} />
        ))
      ) : (
        'No Questions posted yet!'
      )}
    </div>
  );
};

export default ProfileQuestionScreen;
