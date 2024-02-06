import { BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from "assets/icons";
import IconButton from "components/common/IconButton";
import { cn } from "utils";

type ControlSectionProps = {
  handlePrevTrack: () => void;
  handleNextTrack: () => void;
  handlePlayPause: () => void;
  isPlaying: boolean;
};

const ControlSection = ({
  handleNextTrack,
  handlePrevTrack,
  handlePlayPause,
  isPlaying,
}: ControlSectionProps) => {
  return (
    <div className="mb-8 mt-4 flex items-center justify-center space-x-8 text-center">
      <IconButton
        label="Previous Track"
        className="h-16 w-16"
        icon={<BackwardIcon className="fill-gray-700" />}
        onClick={handlePrevTrack}
      />
      <IconButton
        label={isPlaying ? "Pause" : "Play"}
        className={cn(
          "h-20 w-20 border-2",
          isPlaying
            ? "border-primary  bg-white dark:bg-transparent"
            : "border-transparent bg-primary",
        )}
        variant="primary"
        icon={
          isPlaying ? (
            <PauseIcon
              className={cn(
                isPlaying ? "fill-primary dark:fill-primary" : "fill-white",
              )}
            />
          ) : (
            <PlayIcon className="fill-white" />
          )
        }
        onClick={handlePlayPause}
      />
      <IconButton
        label="Next Track"
        className="h-16 w-16"
        icon={<ForwardIcon className="fill-gray-700" />}
        onClick={handleNextTrack}
      />
    </div>
  );
};

export default ControlSection;
