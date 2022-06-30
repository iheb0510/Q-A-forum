import React from 'react';
import { Link } from 'react-router-dom';

const TopQuestion = ({ question }) => {
  return (
    <div className='mb-2 shadow px-2 bg-white dark:bg-gray-800 p-1 rounded'>
      <p className='text-gray-500 dark:text-gray-300 h-6 dark:hover:text-indigo-600 hover:text-indigo-600 overflow-hidden truncate text-sm font-semibold italic'>
        <Link to={`/h/forum/questions/${question?._id}`}>{question?.title}</Link>
      </p>
      <div className='flex space-x-2 text-xs text-gray-400'>
        <span>{question?.upvotes?.length} upvotes</span>
        <span>{question?.downvotes?.length} downvotes</span>
      </div>
    </div>
  );
};

export default TopQuestion;
