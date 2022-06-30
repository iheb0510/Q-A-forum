import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionsByTag } from '../actions/question';

const TopReleventTag = ({ tag }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const buttonHandler = (id) => {
      dispatch(getQuestionsByTag(id));
      navigate(`/h/forum/questions/by/tag`);
    };
    return (
         <button className='text-sm bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md focus:outline-none hover:bg-indigo-600 mt-1 mb-2 mr-2'
         onClick={() => buttonHandler(tag?._id)}>
     {tag?.name}<span>{'-'}</span> {tag?.count}
    </button>
       
      );
    };

export default TopReleventTag