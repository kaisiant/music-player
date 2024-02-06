import { Track } from "features/playerSlice";
import { formatTrackName } from "utils/player";

type TrackInfoSectionProps = {
  track: Track;
};

const TrackInfoSection = ({ track }: TrackInfoSectionProps) => {
  return (
    <div className="text-center">
      <div className="text-xl font-bold">{formatTrackName(track.metadata)}</div>
      <div className="mt-2 font-light">{track.metadata?.artist || "-"}</div>
    </div>
  );
};

export default TrackInfoSection;
