
import { Character } from '@/server/models/Entry'
import { createSlice, configureStore } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'


interface EntryState {
  style: string | null,
  characters: Character[],
  storyboard: any,
  cover: any,
  review: any,
}


const initialState: EntryState = {
  style: null,
  characters: [],
  storyboard: null,
  cover: null,
  review: null,
}


const entrySlice = createSlice({
  name: 'entry',
  initialState: initialState,
  reducers: {
    setStyle: (state: EntryState, action) => {
      state.style = action.payload
    },
    addCharacter: (state: EntryState, action) => {
      state.characters.push(action.payload)
    },
    removeCharacter: (state: EntryState, action) => {
      // filter out the character with the given id
      // state.characters = state.characters.filter(character => character._id !== action.payload)
      state.characters = state.characters.filter(character => character?._id !== action.payload._id)
    },
    editCharacter: (state: EntryState, action) => {
      const { characterIndex, characterData } = action.payload
      state.characters[characterIndex] = characterData
    },
    setStoryboard: (state: EntryState, action) => {
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
export const { setStyle, addCharacter, editCharacter, removeCharacter, setStoryboard } = entrySlice.actions;


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch 
