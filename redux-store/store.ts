import { Character } from "@/models/character";
import { Entry, Scene } from "@/models/entry";
import { User } from "@/models/user";
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import mongoose, { Types } from "mongoose";
import { ObjectId } from "mongoose";
import { ChatCompletionRequestMessage } from "openai";

const initialState: Entry = {
  _id: "",
  author: null,
  title: "",
  style_reference: null,
  content: null,
  characters: [],
  scenes: [],
  chat_messages: [],
  canvas: null,
  cover: null,
  likes: [],
  comments: [],
  is_private: false,
};

const entrySlice = createSlice({
  name: "entry",
  initialState: initialState,
  reducers: {
    setEntryId: (state: Entry, action: PayloadAction<string>) => {
      state._id = action.payload;
    },
    setEntryAuthor: (state: Entry, action: PayloadAction<User>) => {
      state.author = action.payload;
    },
    setStyle: (state: Entry, action) => {
      state.style_reference = action.payload;
    },
    addCharacter: (state: Entry, action: PayloadAction<Character>) => {
      state.characters.push(action.payload);
    },
    removeCharacter: (state: Entry, action: PayloadAction<Character>) => {
      // filter out the character with the given id
      state.characters = state.characters.filter(
        (character) => character?._id !== action.payload._id
      );
    },
    updateCharacter: (state: Entry, action) => {
      // update specific character in characters array, and set new name
      state.characters = state.characters.map((character) => {
        if (character?._id === action.payload._id) {
          character = action.payload;
        }
        return character;
      });
    },
    setContent: (state: Entry, action) => {
      state.content = action.payload;
    },
    setChatMessages: (state: Entry, action: PayloadAction<ChatCompletionRequestMessage[]>) => {
      state.chat_messages = action.payload;
    },
    addChatMessage: (state: Entry, action: PayloadAction<ChatCompletionRequestMessage>) => {
      // add chat message to storyboard
      state.chat_messages.push(action.payload);
    },
    setScenes: (state: Entry, action) => {
      state.scenes = action.payload;
    },
    addScene: (state: Entry, action: PayloadAction<Scene>) => {
      // add scene to storyboard
      state.scenes.push(action.payload);
    },
    setCanvas: (state: Entry, action) => {
      state.canvas = action.payload;
    },
    setTitle: (state: Entry, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    toggleIsPrivate: (state: Entry) => {
      state.is_private = !state.is_private;
    }
  },
});

const entryHelperSlice = createSlice({
  name: "entryHelper",
  initialState: {
    stylesScrollPosition: 0,
    showGeneratedStoryboard: false,
    isGeneratingStoryboard: false,
    showChat: false,
  },
  reducers: {
    setStylesScrollPosition: (state, action: PayloadAction<number>) => {
      state.stylesScrollPosition = action.payload;
    },
    setShowGeneratedStoryboard: (state, action: PayloadAction<boolean>) => {
      state.showGeneratedStoryboard = action.payload;
    },
    setIsGeneratingStoryboard: (state, action: PayloadAction<boolean>) => {
      state.isGeneratingStoryboard = action.payload;
    },
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload;
    },
    toggleShowChat: (state) => {
      state.showChat = !state.showChat;
    }
  },
});

const authenticationSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
  },
  reducers: {
    setCurrentUser: (state: any, action) => {
      state.currentUser = action.payload;
    },
  },
});

const landingSlice = createSlice({
  name: "landing",
  initialState: {
    scrollY: 0,
  },
  reducers: {
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload;
    },
  },
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    showNotifications: false,
    title: "",
    message: "",
  },
  reducers: {
    setShowNotifications: (state, action: PayloadAction<boolean>) => {
      state.showNotifications = action.payload;
    },
    setNotificationContent: (
      state,
      action: PayloadAction<{ title: string; message: string }>
    ) => {
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.showNotifications = true;
    },
  },
});

export const store: ToolkitStore = configureStore({
  reducer: {
    auth: authenticationSlice.reducer,
    entry: entrySlice.reducer,
    entryHelper: entryHelperSlice.reducer,
    landing: landingSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});

// actions
export const { setCurrentUser } = authenticationSlice.actions;

export const {
  setEntryId,
  setEntryAuthor,
  setStyle,
  addCharacter,
  updateCharacter,
  removeCharacter,
  setTitle,
  setContent,
  setChatMessages,
  addChatMessage,
  setScenes,
  addScene,
  setCanvas,
  toggleIsPrivate,
} = entrySlice.actions;

export const {
  setStylesScrollPosition,
  setShowGeneratedStoryboard,
  setIsGeneratingStoryboard,
  setShowChat,
  toggleShowChat
} = entryHelperSlice.actions;

export const { setScrollY } = landingSlice.actions;

export const { setShowNotifications, setNotificationContent } = notificationsSlice.actions;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
