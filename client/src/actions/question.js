import axios from 'axios';
import baseURL from '../baseURL';
import {
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  GET_ALL_QUESTIONS,
  GET_ALL_MY_QUESTIONS,
  ADD_QUESTION,
  EDIT_QUESTION,
  GET_QUESTION,
  DELETE_QUESTION,
  VIEW_QUESTION,
  UPVOTE_QUESTION,
  DOWNVOTE_QUESTION,
  GET_ANSWERS_BY_QUESTION,
  ADD_ANSWER,
  EDIT_ANSWER,
  GET_ANSWER,
  GET_TAGS,
  DELETE_ANSWER,
  MARK_AS_SOLVED,
  UPVOTE_ANSWER,
  DOWNVOTE_ANSWER,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  GET_ALL_ANSWERS,
  GET_QUESTIONS_BY_TAG,
} from './types';

export const getAllQuestions = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/question`, config);

    dispatch({
      type: GET_ALL_QUESTIONS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const getAllMyQuestions = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseURL}/api/question/user/${id}`,
      config
    );
    dispatch({
      type: GET_ALL_MY_QUESTIONS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const getQuestionsByCommunity = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/question/${id}`, config);
    dispatch({
      type: GET_ALL_MY_QUESTIONS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const addQuestion = (body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`${baseURL}/api/question`, body, config);
    Promise.all(console.log('response', data));
    dispatch({
      type: ADD_QUESTION,
      payload: data,
    });
    dispatch(getTags());
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const editQuestion = (id, body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/question/${id}`,
      body,
      config
    );
    Promise.all(console.log('response', data));
    dispatch({
      type: EDIT_QUESTION,
      payload: data,
    });
    dispatch(getAllAnswers());
    dispatch(getTags());
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const deleteQuestion = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.delete(
      `${baseURL}/api/question/${id}`,
      config
    );
    dispatch({
      type: DELETE_QUESTION,
      payload: id,
    });
    dispatch(getTags());
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const upvoteQuestion = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/question/upvote/${id}`,
      {},
      config
    );

    dispatch({
      type: UPVOTE_QUESTION,
      payload: { id, downvotes: data.downvotes, upvotes: data.upvotes },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};
export const viewQuestion = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/question/views/${id}`,
      {},
      config
    );

    dispatch({
      type: VIEW_QUESTION,
      payload: { id, views: data },
    });
  } catch (err) {}
};
export const downvoteQuestion = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/question/downvote/${id}`,
      {},
      config
    );

    dispatch({
      type: DOWNVOTE_QUESTION,
      payload: { id, downvotes: data.downvotes, upvotes: data.upvotes },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};
export const getAllQuestionAnswers = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/answer/${id}`, config);

    dispatch({
      type: GET_ANSWERS_BY_QUESTION,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.msg,
    });
  }
};

export const getAllAnswers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/answer`, config);

    dispatch({
      type: GET_ALL_ANSWERS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const addAnswer = (body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`${baseURL}/api/answer`, body, config);
    dispatch({
      type: ADD_ANSWER,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const editAnswer = (id, body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/answer/${id}`,
      body,
      config
    );
    Promise.all(console.log('response', data));
    dispatch({
      type: EDIT_ANSWER,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const deleteAnswer = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_LOADING,
    });
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.delete(`${baseURL}/api/answer/${id}`, config);
    dispatch({
      type: DELETE_ANSWER,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const upvoteAnswer = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/answer/upvote/${id}`,
      {},
      config
    );

    dispatch({
      type: UPVOTE_ANSWER,
      payload: { id, downvotes: data.downvotes, upvotes: data.upvotes },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};
export const downvoteAnswer = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/answer/downvote/${id}`,
      {},
      config
    );

    dispatch({
      type: DOWNVOTE_ANSWER,
      payload: { id, downvotes: data.downvotes, upvotes: data.upvotes },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const markAsSolved = (id, idQuestion) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/answer/solved/${id}`,
      {},
      config
    );

    dispatch({
      type: MARK_AS_SOLVED,
      payload: { id, question: data.question, solution: data.solution },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const addComment = (id, body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/answer/comment/${id}`,
      body,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: { id, comments: data },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};
export const editComment = (id, idcom, body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/answer/comment/${id}/${idcom}`,
      body,
      config
    );

    dispatch({
      type: EDIT_COMMENT,
      payload: { id, comments: data },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};
export const deleteComment = (id, idcom) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseURL}/api/answer/comment/delete/${id}/${idcom}`,
      {},
      config
    );
    dispatch({
      type: DELETE_COMMENT,
      payload: { id, comments: data },
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const getTags = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/tag`, config);
    dispatch({
      type: GET_TAGS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const getQuestionsByTag = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLEAR_ERROR,
    });
    const {
      auth: { userInfo },
    } = getState();
    const config = {
      headers: {
        'x-auth-token': `${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`${baseURL}/api/tag/${id}`, config);
    dispatch({
      type: GET_QUESTIONS_BY_TAG,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data.message,
    });
  }
};
