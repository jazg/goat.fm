import { Artist } from "../lib/types";

interface SuggestionsProps {
  artists: Artist[];
}

function Suggestions(props: SuggestionsProps) {
  return (
    <div className="flex flex-nowrap items-center h-9 overflow-scroll mr-4">
      {props.artists.map((artist, i) => {
        return (
          <span
            key={i}
            className="text-xs whitespace-nowrap ml-4 cursor-pointer hover:underline"
          >
            {artist.name}
          </span>
        );
      })}
    </div>
  );
}

export default Suggestions;
