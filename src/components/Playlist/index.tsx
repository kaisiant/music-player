import { PauseIcon, PlayIcon } from "assets/icons";
import { useTypedSelector } from "hooks";
import { cn } from "utils";
import { formatTrackArtist, formatTrackName } from "utils/player";

type PlaylistProps = {
  isPlaying: boolean;
};

const Playlist = ({ isPlaying }: PlaylistProps) => {
  const { playlist, currentTrackIndex } = useTypedSelector(
    (state) => state.player,
  );
  return (
    <div className="container mx-auto">
      <div className="lg:text-md text-xl font-bold">Playlist</div>
      <ul className="mt-2 divide-y dark:divide-gray-700">
        {playlist.map((track, i) => {
          const isCurrent = currentTrackIndex === i;
          return (
            <li key={track.path} className="flex space-x-2 py-4 text-sm">
              <span
                className={cn(
                  "w-6 h-6 border rounded-full flex-shrink-0 grid place-items-center",
                  isCurrent ? "p-1" : "border-0 pb-2",
                )}
              >
                {isCurrent ? (
                  isPlaying ? (
                    <PlayIcon />
                  ) : (
                    <PauseIcon />
                  )
                ) : (
                  `${i + 1}.`
                )}
              </span>
              <div>
                <div className="flex space-x-8 items-start">
                  {formatTrackName(track.metadata)}
                </div>
                <div className="mt-0.5 font-light">
                  {formatTrackArtist(track.metadata)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;
