import React, { useEffect, useState,useRef } from 'react';
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../actions/question';
import Comment from '../Components/Comment';

const AnswerCommentsContainer = ({ ans }) => {
  const dispatch = useDispatch();
  const [emojiOn, setEmoji] = useState(false);
  const [comment, setComment] = useState('');

  const keyHandler = (event) => {
    if (event.key === 'Enter' && comment !== '') {
      commentHandler();
    }
  };

  const commentHandler = () => {
    const newComment = {
      text: comment,
    };
    dispatch(addComment(ans?._id, newComment));
    setComment('');
  };

  function EmojiPicker(props) {
    const ref = useRef()
  
    useEffect(() => {
      new Picker({ ...props, data, ref })
    }, [])
  
    return <div ref={ref} />
  }
  return (
    <div
      className='py-2 bg-white dark:bg-gray-700 max-h-96 overflow-hidden rounded shadow'
      style={{ overflowY: 'scroll' }}
    >
      <div className='px-5 text-gray-500 dark:text-gray-300 text-sm border-b dark:border-gray-600 pb-1'>
        <span className='mr-3'>{ans?.comments?.length} Comments</span>
      </div>

      <div className='flex items-center my-2'>
        <div className='flex-grow flex items-center'>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={keyHandler}
            placeholder='Write your comment...'
            className='flex-1 dark:bg-gray-800 dark:text-gray-300 ml-3 p-1 px-6 mr-2 w-10/12 text-xs focus:outline-none border dark:border-gray-600 rounded-full'
          />
          <div>
            <span className='cursor-pointer' onClick={() => setEmoji(!emojiOn)}>
              <i className='text-gray-400 far fa-grin'></i>
            </span>
          </div>
          <div className='absolute right-0' style={{ left: '75%' }}>
            {emojiOn && (
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  setComment(comment.concat(emoji.native));
                }}
              />
            )}
          </div>
        </div>
        <button
          onClick={commentHandler}
          disabled={comment === ''}
          className={`rounded-full border dark:border-gray-600 ${
            comment !== '' && 'hover:text-white hover:bg-indigo-500'
          }
          ${comment === '' && 'opacity-30'}
          mx-2 p-1 px-3 text-xs focus:outline-none font-semibold text-indigo-500`}
        >
          Send
        </button>
      </div>

      {
        <>
          {ans?.comments.length > 0 &&
            ans?.comments?.map((comment) => (
              <Comment key={comment?._id} cmnt={comment} ans={ans} />
            ))}
        </>
      }
    </div>
  );
};

export default AnswerCommentsContainer;
