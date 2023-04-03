
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


const EntrySlice = createSlice({
  name: 'entry',
  initialState: initialState,
  reducers: {
    setStyle: (state: EntryState, action) => {
      state.style = action.payload
    },
    addCharacter: (state: EntryState, action) => {
      state.characters.push(action.payload)
    },
    editCharacter: (state: EntryState, action) => {
      const { characterIndex, characterData } = action.payload
      state.characters[characterIndex] = characterData
    },
    deleteCharacter: (state: EntryState, action) => {
      const { characterIndex } = action.payload
      state.characters.splice(characterIndex, 1)
    },
    setStoryboard: (state: EntryState, action) => {
      state.storyboard = action.payload
    }
  }
})


export const store: ToolkitStore = configureStore({
  reducer: {
    entry: EntrySlice.reducer
  }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch 
