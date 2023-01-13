import { Artist } from "../lib/types";

interface SuggestionsProps {
  artists: Artist[];
  setQuery: (query: string) => void;
}

function Suggestions(props: SuggestionsProps) {
  return (
    <>
      {props.artists.length > 0 && (
        <div className="flex flex-nowrap items-center h-9 overflow-scroll mr-4">
          {props.artists.map((artist, i) => {
            return (
              <span
                key={i}
                className="text-xs whitespace-nowrap ml-4 cursor-pointer hover:underline"
                onClick={() => props.setQuery(artist.name)}
              >
                {artist.name}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Suggestions;
