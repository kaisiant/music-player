import { forwardRef } from "react";
import { cn } from "utils";
import { formatTime } from "utils/player";

type SeekBarProps = {
  isDragging: boolean;
  duration: number;
  currentTime: number;
} & React.DOMAttributes<HTMLDivElement>;

const SeekBar = forwardRef<HTMLDivElement, SeekBarProps>(
  ({ isDragging, duration, currentTime, ...restProps }, ref) => {
    return (
      <div>
        <div
          ref={ref}
          className="group py-2 hover:cursor-pointer"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          {...restProps}
        >
          <div className="h-1 w-full rounded-full bg-gray-300 transition-all group-hover:h-2">
            <div
              className={cn(
                "relative h-full rounded-full bg-primary  hover:h-2",
                { "transition-all": !isDragging },
              )}
              style={{
                width: duration
                  ? `${((currentTime || 0) / duration) * 100}%`
                  : 0,
              }}
            >
              <div className="absolute -right-2 -top-1 h-4 w-4 scale-0 rounded-full bg-primary opacity-0 transition-all  group-hover:scale-100 group-hover:opacity-100" />
            </div>
          </div>
        </div>
        <div className="lg:text-md flex justify-between text-sm tabular-nums">
          <div>{formatTime(Math.floor(currentTime))}</div>
          <div>
            {duration
              ? `-${formatTime(duration - Math.floor(currentTime))}`
              : "--:--"}
          </div>
        </div>
      </div>
    );
  },
);

export default SeekBar;
