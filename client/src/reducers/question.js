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
  DELETE_ANSWER,
  MARK_AS_SOLVED,
  UPVOTE_ANSWER,
  DOWNVOTE_ANSWER,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  GET_ALL_ANSWERS,
  GET_TAGS,
  GET_QUESTIONS_BY_TAG,
} from '../actions/types';

const initialState = {
  questions: [],
  answers: [],
  tags: [],
  question: {},
  loading: false,
  error: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        loading: false,
      };
      case GET_QUESTIONS_BY_TAG:
        return {
          ...state,
          questions: action.payload,
          loading: false,
        };  
    case GET_ALL_ANSWERS:
      return {
        ...state,
        answers: action.payload,
        loading: false,
      };
    case GET_ALL_MY_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        loading: false,
      };
    case GET_TAGS:
      return {
        ...state,
        tags: action.payload,
        loading: false,
      };
    case GET_QUESTION:
      return {
        ...state,
        question: action.payload,
        loading: false,
      };
    case VIEW_QUESTION:
      return {
        ...state,
        questions: state.questions.map((question) =>
          question._id === action.payload.id
            ? { ...question, views: action.payload.views }
            : question
        ),
        loading: false,
      };
    case UPVOTE_QUESTION:
      return {
        ...state,
        questions: state.questions.map((question) =>
          question._id === action.payload.id
            ? {
                ...question,
                upvotes: action.payload.upvotes,
                downvotes: action.payload.downvotes,
              }
            : question
        ),
        loading: false,
      };
    case UPVOTE_ANSWER:
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer._id === action.payload.id
            ? {
                ...answer,
                upvotes: action.payload.upvotes,
                downvotes: action.payload.downvotes,
              }
            : answer
        ),
        loading: false,
      };
    case DOWNVOTE_QUESTION:
      return {
        ...state,
        questions: state.questions.map((question) =>
          question._id === action.payload.id
            ? {
                ...question,
                upvotes: action.payload.upvotes,
                downvotes: action.payload.downvotes,
              }
            : question
        ),
        loading: false,
      };
    case DOWNVOTE_ANSWER:
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer._id === action.payload.id
            ? {
                ...answer,
                upvotes: action.payload.upvotes,
                downvotes: action.payload.downvotes,
              }
            : answer
        ),
        loading: false,
      };
    case ADD_QUESTION:
      return {
        ...state,
        questions: [...state.questions, action.payload],
        loading: false,
      };
    case ADD_ANSWER:
      return {
        ...state,
        answers: [...state.answers, action.payload],
        loading: false,
      };
    case DELETE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter(
          (question) => question._id !== action.payload
        ),
        loading: false,
      };
    case DELETE_ANSWER:
      return {
        ...state,
        answers: state.answers.filter(
          (answer) => answer._id !== action.payload
        ),
        loading: false,
      };
    case EDIT_QUESTION:
      return {
        ...state,
        questions: state.questions.map((question) =>
          question._id === action.payload._id ? action.payload : question
        ),

        question: action.payload,
        loading: false,
      };
    case EDIT_ANSWER:
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer._id === action.payload._id ? action.payload : answer
        ),
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer._id === action.payload.id
            ? {
                ...answer,
                comments: action.payload.comments,
              }
            : answer
        ),
        loading: false,
      };
    case EDIT_COMMENT:
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer._id === action.payload.id
            ? {
                ...answer,
                comments: action.payload.comments,
              }
            : answer
        ),
        loading: false,
      };
    case DELETE_COMMENT:
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer._id === action.payload.id
            ? {
                ...answer,
                comments: action.payload.comments,
              }
            : answer
        ),
        loading: false,
      };
    case MARK_AS_SOLVED:
      return {
        ...state,
        answers: state.answers.map((answer) =>
          answer._id === action.payload.id
            ? {
                ...answer,
                solution: action.payload.solution,
              }
            : answer
        ),
        questions: state.questions.map((question) =>
          question._id === action.payload.question._id
            ? action.payload.question
            : question
        ),
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_ERROR:
      console.error(action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false,
        sucess: false,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
