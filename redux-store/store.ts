
import { Entry } from '@/models/entry'
import { createSlice, configureStore } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

const initialState: Entry = {
  _id: "",
  title: "",
  style_reference: null,
  content: null,
  characters: [],
  storyboard: null,
  cover: null,
  review: null,
}


const entrySlice = createSlice({
  name: 'entry',
  initialState: initialState,
  reducers: {
    setStyle: (state: Entry, action) => {
      state.style_reference = action.payload
    },
    addCharacter: (state: Entry, action) => {
      state.characters.push(action.payload)
    },
    removeCharacter: (state: Entry, action) => {
      // filter out the character with the given id
      state.characters = state.characters.filter(character => character?._id !== action.payload._id)
    },
    updateCharacter: (state: Entry, action) => {
      // update specific character in characters array
      // set new name 
      state.characters = state.characters.map(character => {
        if (character?._id === action.payload._id) {
          character = action.payload
        }
        return character
      })
    },
    setStoryboard: (state: Entry, action) => {
      state.storyboard = action.payload
    },
  }
})


export const store: ToolkitStore = configureStore({
  reducer: {
    entry: entrySlice.reducer
  }
})

// actions
export const { setStyle, addCharacter, updateCharacter, removeCharacter, setStoryboard } = entrySlice.actions;


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch 
