import {
  SET_CHARACTER_DATA,
  SET_STORYBOARD_DATA,
  SET_COVER_DATA,
  SET_REVIEW_DATA,
} from './types';

export const setCharacterData = (data: any) => ({
  type: SET_CHARACTER_DATA,
  payload: data,
});

export const setStoryboardData = (data: any) => ({
  type: SET_STORYBOARD_DATA,
  payload: data,
});

export const setCoverData = (data: any) => ({
  type: SET_COVER_DATA,
  payload: data,
});

export const setReviewData = (data: any) => ({
  type: SET_REVIEW_DATA,
  payload: data,
});
