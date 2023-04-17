
import { Character } from '@/models/character'
import { Entry, Scene } from '@/models/entry'
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import mongoose from 'mongoose'

const initialState: Entry = {
  _id: "",
  user_id: "",
  title: "",
  style_reference: null,
  content: null,
  characters: [],
  scenes: [],
  cover: null
}

const entrySlice = createSlice({
  name: 'entry',
  initialState: initialState,
  reducers: {
    setUserId: (state: Entry, action: PayloadAction<string>) => {
      state.user_id = action.payload
    },
    setStyle: (state: Entry, action) => {
      state.style_reference = action.payload
    },
    addCharacter: (state: Entry, action: PayloadAction<Character>) => {
      state.characters.push(action.payload)
    },
    removeCharacter: (state: Entry, action: PayloadAction<Character>) => {
      // filter out the character with the given id
      state.characters = state.characters.filter(character => character?._id !== action.payload._id)
    },
    updateCharacter: (state: Entry, action) => {
      // update specific character in characters array, and set new name 
      state.characters = state.characters.map(character => {
        if (character?._id === action.payload._id) {
          character = action.payload
        }
        return character
      })
    },
    setContent: (state: Entry, action) => {
      state.content = action.payload
    },
    addScene: (state: Entry, action: PayloadAction<Scene>) => {
      // add scene to storyboard
      state.scenes.push(action.payload)
    },
    setTitle: (state: Entry, action: PayloadAction<string>) => {
      state.title = action.payload
    }
  }
})

const entryHelperSlice = createSlice({
  name: 'entryHelper',
  initialState: {
    stylesScrollPosition: 0,
    showGeneratedStoryboard: false,
  },
  reducers: {
    setStylesScrollPosition: (state, action) => {
      state.stylesScrollPosition = action.payload
    },
    setShowGeneratedStoryboard: (state, action) => {
      state.showGeneratedStoryboard = action.payload
    }
  }
})

const authenticationSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    }
  }
})



export const store: ToolkitStore = configureStore({
  reducer: {
    auth: authenticationSlice.reducer,
    entry: entrySlice.reducer,
    entryHelper: entryHelperSlice.reducer
  }
})

// actions
export const { setCurrentUser } = authenticationSlice.actions;
export const { setUserId, setStyle, addCharacter, updateCharacter, removeCharacter, setTitle, setContent, addScene } = entrySlice.actions;
export const { setStylesScrollPosition, setShowGeneratedStoryboard } = entryHelperSlice.actions;


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch 
