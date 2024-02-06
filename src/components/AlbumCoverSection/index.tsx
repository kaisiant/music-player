import { LoopIcon } from "assets/icons";
import AlbumPlaceholder from "assets/images/album-placeholder.jpg";
import IconButton from "components/common/IconButton";
import { Track } from "features/playerSlice";
import { cn } from "utils";

type AlbumCoverSectionProps = {
  trackIndex: number;
  track: Track;
  isPlaying: boolean;
  isLoop: boolean;
  handleLoop: () => void;
};

const AlbumCoverSection = ({
  trackIndex,
  track,
  isPlaying,
  isLoop,
  handleLoop,
}: AlbumCoverSectionProps) => {
  return (
    <div className="relative mx-auto inline-block max-h-[250px] max-w-[250px]">
      <img
        key={`${trackIndex},${trackIndex}`}
        className={cn(
          "spin-animation absolute left-0 right-0 mx-auto h-full max-h-[220px] w-full max-w-[220px] rounded-full object-cover blur",
          isPlaying ? "" : "paused",
        )}
        src={track?.metadata?.albumCover || AlbumPlaceholder}
      />
      <img
        key={trackIndex}
        className={cn(
          "spin-animation mx-auto aspect-square h-full max-h-[200px] w-full max-w-[200px] rounded-full object-cover lg:max-h-[250px] lg:max-w-[250px]",
          isPlaying ? "" : "paused",
        )}
        src={track?.metadata?.albumCover || AlbumPlaceholder}
      />
      <IconButton
        className="absolute -left-5 top-1/2 -translate-y-1/2"
        label={isLoop ? "Disable Loop" : "Enable Loop"}
        size="sm"
        icon={
          <LoopIcon
            className={isLoop ? "fill-primary dark:fill-primary" : ""}
          />
        }
        onClick={handleLoop}
      />
    </div>
  );
};

export default AlbumCoverSection;
