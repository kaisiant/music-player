import { createSlice } from "@reduxjs/toolkit";
import { isDarkMode } from "utils";

export type TrackMetadata = {
  artist: string;
  albumCover: string;
  title: string;
};

export type Track = {
  path: string;
  metadata: TrackMetadata;
};

const initialState = {
  playlist: [] as Track[],
  currentTrackIndex: 0,
  currentTime: 0,
  isLoop: false,
  isDark: isDarkMode,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    initPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setCurrentTrackIndex: (state, action) => {
      state.currentTrackIndex = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setLoopMode: (state, action) => {
      state.isLoop = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark;
    },
  },
});

export const {
  initPlaylist,
  setCurrentTrackIndex,
  setCurrentTime,
  setLoopMode,
  toggleDarkMode,
} = playerSlice.actions;

export default playerSlice.reducer;
