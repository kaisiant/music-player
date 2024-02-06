import { CloseIcon, ListIcon, MoonIcon, SunIcon } from "assets/icons";
import IconButton from "components/common/IconButton";

type TopSectionProps = {
  showPlaylist: boolean;
  isDarkMode: boolean;
  togglePlaylist: () => void;
  toggleDarkMode: () => void;
};

const TopSection = ({
  showPlaylist,
  isDarkMode,
  togglePlaylist,
  toggleDarkMode,
}: TopSectionProps) => {
  return (
    <div className="mb-8 flex justify-end space-x-4">
      <IconButton
        label={isDarkMode ? "Enable light mode" : "Enable dark mode"}
        className="z-10"
        size="sm"
        icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
        onClick={toggleDarkMode}
      />
      <IconButton
        label={showPlaylist ? "Close playlist" : "Show playlist"}
        className="z-10"
        size="sm"
        icon={showPlaylist ? <CloseIcon /> : <ListIcon />}
        onClick={togglePlaylist}
      />
    </div>
  );
};

export default TopSection;
