

import { Action } from 'redux';
import * as actionTypes from './types';

const initialState: any = {
  character: {
    name: '',
    age: '',
    gender: '',
  },
  storyboard: '',
  cover: '',
  review: '',
};

type CreateActionTypes = {

}

export const createReducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_CHARACTER_DATA:
      return { ...state, character: };
    case actionTypes.SET_STORYBOARD_DATA:
      return { ...state, storyboard: action.payload };
    case actionTypes.SET_COVER_DATA:
      return { ...state, cover: action.payload };
    case actionTypes.SET_REVIEW_DATA:
      return { ...state, review: action.payload };
    default:
      return state;
  }
};

export default createReducer;
