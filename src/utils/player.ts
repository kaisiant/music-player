import { Track, TrackMetadata } from "features/playerSlice";

const DEFAULT_TRACK_NAME = "Untitled song";
const DEFAULT_TRACK_ARTIST = "-";

export const shufflePlaylist = (list: Track[]) => {
  const shuffledList = [...list];
  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
  }
  return shuffledList;
};

export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${formattedSeconds}`;
};

export const formatTrackName = (metadata?: TrackMetadata) => {
  return metadata?.title || DEFAULT_TRACK_NAME;
};

export const formatTrackArtist = (metadata?: TrackMetadata) => {
  return metadata?.artist || DEFAULT_TRACK_ARTIST;
};
