import AlbumCoverSection from "components/AlbumCoverSection";
import ControlSection from "components/ControlSection";
import Playlist from "components/Playlist";
import SeekBar from "components/SeekBar";
import TopSection from "components/TopSection";
import TrackInfoSection from "components/TrackInfoSection";
import {
  initPlaylist,
  setCurrentTime,
  setCurrentTrackIndex,
  setLoopMode,
  toggleDarkMode as toggleDarkModeAction,
} from "features/playerSlice";
import { useTypedDispatch, useTypedSelector } from "hooks";
import MP3Tag from "mp3tag.js";
import { MP3TagAPICFrame } from "mp3tag.js/types/id3v2/frames";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import {
  cn,
  convertFilePathToFileObject,
  convertImageArrayToDataURI,
} from "utils";
import { formatTrackName, shufflePlaylist } from "utils/player";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const { playlist, currentTime, currentTrackIndex, isLoop, isDark } =
    useTypedSelector((state) => state.player);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    // if found persisted playlist, return
    if (playlist?.length) {
      return;
    }

    const toastId = toast.loading("Loading tracks");
    setShowOverlay(true);

    const getAudioPaths = async () => {
      // const modules = await Promise.all([
      //   import(`/assets/tracks/1.mp3`),
      //   import(`/assets/tracks/2.mp3`),
      //   import(`/assets/tracks/3.mp3`),
      //   import(`/assets/tracks/4.mp3`),
      //   import(`/assets/tracks/5.mp3`),
      //   import(`/assets/tracks/6.mp3`),
      // ]);
      // return modules.map((module) => module.default);
      return [
        `/assets/tracks/1.mp3`,
        `/assets/tracks/2.mp3`,
        `/assets/tracks/3.mp3`,
        `/assets/tracks/4.mp3`,
        `/assets/tracks/5.mp3`,
        `/assets/tracks/6.mp3`,
      ];
    };

    const importAudioFiles = async () => {
      try {
        // Dynamically import all files in the 'tracks' folder
        // const context =
        //   process.env.NODE_ENV === "production"
        //     ? import.meta.glob("./assets/*.mp3")
        //     : import.meta.glob("./assets/tracks/*.mp3");
        // const audioFiles = (await Promise.all(
        //   Object.keys(context).map(async (key) => {
        //     const module = await import(`./${key.substring(2)}`);
        //     return module.default;
        //   }),
        // )) as string[];

        const audioFiles = await getAudioPaths();

        const audioFilesWithMetadata = await Promise.all(
          audioFiles.map(async (filePath) => ({
            path: filePath,
            metadata: await extractMetadata(filePath),
          })),
        );

        toast.success("Tracks loaded successfully", {
          id: toastId,
        });

        const audioFilesWithFormattedMetadata = audioFilesWithMetadata.map(
          (audio) => {
            const { artist = "", title = "", v2 } = audio.metadata || {};
            const { data, format } =
              (v2?.APIC as unknown as MP3TagAPICFrame[])?.[0] || {};

            return {
              ...audio,
              metadata: {
                artist,
                albumCover: data
                  ? convertImageArrayToDataURI(data, format) ?? ""
                  : "",
                title,
              },
            };
          },
        );
        dispatch(
          initPlaylist(shufflePlaylist(audioFilesWithFormattedMetadata)),
        );
      } catch (error) {
        console.error("Error importing audio files:", error);
        toast.error("Failed to load tracks", {
          id: toastId,
        });
      } finally {
        setShowOverlay(false);
      }
    };

    importAudioFiles();
  }, []);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    const currentSeekBarRef = seekBarRef.current;

    if (currentAudioRef) {
      currentAudioRef?.addEventListener("timeupdate", handleTimeUpdate);
      currentAudioRef?.addEventListener("loadedmetadata", handleLoadedMetadata);
      currentAudioRef?.addEventListener("play", setTrackToPlay);
      currentAudioRef?.addEventListener("pause", setTrackToPause);

      return () => {
        currentAudioRef?.removeEventListener("timeupdate", handleTimeUpdate);
        currentAudioRef?.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        );
        currentAudioRef?.removeEventListener("play", setTrackToPlay);
        currentAudioRef?.removeEventListener("pause", setTrackToPause);

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        currentSeekBarRef?.removeEventListener("touchmove", handleTouchMove);
        currentSeekBarRef?.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, []);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
  }, [currentTrackIndex, audioRef, isPlaying]);

  const setTrackToPlay = () => setIsPlaying(true);
  const setTrackToPause = () => setIsPlaying(false);

  const updateAudioCurrentTime = (_currentTime: number = currentTime) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = _currentTime;
  };

  const extractMetadata = async (audioFile: string) => {
    try {
      const file = await convertFilePathToFileObject(audioFile, "audioFile");
      if (!file) throw new Error("Error file object");
      const buffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
          resolve(this.result);
        };

        reader.onerror = function (error) {
          reject(error);
        };

        reader.readAsArrayBuffer(file);
      });

      const mp3tag = new MP3Tag(buffer);
      mp3tag.read();

      if (mp3tag.error !== "") throw new Error(mp3tag.error);
      return mp3tag.tags;
    } catch (error) {
      console.error("Error extracting metadata:", error);
    }
  };

  const handleTimeUpdate = () => {
    dispatch(setCurrentTime(audioRef.current?.currentTime));
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (currentTime > 0) audioRef.current.currentTime = currentTime;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = (ignoreLoop: boolean = true) => {
    if (isLoop && audioRef.current && !ignoreLoop) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    if (currentTrackIndex === playlist.length - 1) {
      dispatch(initPlaylist(shufflePlaylist(playlist)));
      dispatch(setCurrentTrackIndex(0));
    } else {
      dispatch(setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length));
    }
    updateAudioCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    dispatch(
      setCurrentTrackIndex(
        (currentTrackIndex - 1 + playlist.length) % playlist.length,
      ),
    );
    setIsPlaying(true);
  };

  useHotkeys(" ", handlePlayPause);
  useHotkeys("ArrowLeft", handlePrevTrack);
  useHotkeys("ArrowRight", () => handleNextTrack());

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
    updateAudioCurrentTime(seekTime);
    setIsPlaying(true);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = seekBarRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.pageX - rect.left;
      let seekTime = (offsetX / rect.width) * duration;
      if (seekTime < 0) seekTime = 0;
      else if (seekTime > duration) seekTime = duration;

      updateAudioCurrentTime(seekTime);
      dispatch(setCurrentTime(seekTime));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    seekBarRef.current?.addEventListener("touchmove", handleTouchMove);
    seekBarRef.current?.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    // prevent scrolling
    e.preventDefault();

    const rect = seekBarRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.touches[0].pageX - rect.left;
      const seekTime = (offsetX / rect.width) * duration;

      updateAudioCurrentTime(seekTime);
      dispatch(setCurrentTime(seekTime));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    seekBarRef.current?.removeEventListener("touchmove", handleTouchMove);
    seekBarRef.current?.removeEventListener("touchend", handleTouchEnd);
  };

  const handleLoop = () => {
    const newIsLoopState = !isLoop;
    dispatch(setLoopMode(newIsLoopState));

    if (newIsLoopState) {
      toast(
        <div>
          <span>Looping </span>
          <span className="italic">
            {formatTrackName(playlist[currentTrackIndex].metadata)}
          </span>
        </div>,
      );
    } else {
      toast(
        <div>
          <span>OFF loop</span>
        </div>,
      );
    }
  };

  const togglePlaylistMenu = () => setShowPlaylist((prev) => !prev);
  const toggleDarkMode = () => dispatch(toggleDarkModeAction());

  const currentTrack = playlist[currentTrackIndex] || {};

  return (
    <div className="container mx-auto flex h-full flex-col px-4 py-4 lg:py-12">
      <TopSection
        showPlaylist={showPlaylist}
        isDarkMode={isDark}
        togglePlaylist={togglePlaylistMenu}
        toggleDarkMode={toggleDarkMode}
      />
      <audio
        ref={audioRef}
        src={currentTrack.path}
        onEnded={() => handleNextTrack(false)}
        aria-label="Audio Player"
        role="region"
      />
      <div className="flex flex-1 flex-col">
        <AlbumCoverSection
          trackIndex={currentTrackIndex}
          track={currentTrack}
          isLoop={isLoop}
          isPlaying={isPlaying}
          handleLoop={handleLoop}
        />
      </div>
      <div className="mb-12 mt-6">
        <TrackInfoSection track={currentTrack} />
      </div>
      <div>
        <SeekBar
          ref={seekBarRef}
          onClick={handleSeek}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          isDragging={isDragging}
          duration={duration}
          currentTime={currentTime}
        />
        <ControlSection
          handleNextTrack={() => handleNextTrack()}
          handlePrevTrack={handlePrevTrack}
          handlePlayPause={handlePlayPause}
          isPlaying={isPlaying}
        />
      </div>
      <section
        className={cn(
          "absolute left-0 right-0 top-0 flex h-full flex-col rounded border bg-white dark:bg-gray-950 dark:border-gray-950 p-4 pt-20 transition-all",
          showPlaylist ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Playlist isPlaying={isPlaying} />
      </section>
      {showOverlay && <div className="overlay" />}
    </div>
  );
}

export default App;
