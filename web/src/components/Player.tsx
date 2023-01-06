import { Track } from "../lib/types";

interface PlayerProps {
  tracks: Track[];
}

function Player(props: PlayerProps) {
  return (
    <div className="flex flex-wrap">
      {props.tracks.map((track, i) => {
        return <span key={i}>{track.name}</span>;
      })}
    </div>
  );
}

export default Player;
