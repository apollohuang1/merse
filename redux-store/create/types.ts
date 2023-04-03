
// Action Types
export const SET_CHARACTER_DATA = 'SET_CHARACTER_DATA';
export const SET_STORYBOARD_DATA = 'SET_STORYBOARD_DATA';
export const SET_COVER_DATA = 'SET_COVER_DATA';
export const SET_REVIEW_DATA = 'SET_REVIEW_DATA';

export interface SetCharacterDataAction {
  type: typeof SET_CHARACTER_DATA;
  payload: any;
}

export interface SetStoryboardDataAction {
  type: typeof SET_STORYBOARD_DATA;
  payload: any;
}

export interface SetCoverDataAction {
  type: typeof SET_COVER_DATA;
  payload: any;
}

export interface SetReviewDataAction {
  type: typeof SET_REVIEW_DATA;
  payload: any;
}

export type CreateActionTypes = SetCharacterDataAction | SetStoryboardDataAction | SetCoverDataAction | SetReviewDataAction;
