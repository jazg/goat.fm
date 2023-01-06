import { Artist } from "../lib/types";

interface TagsProps {
  suggestions: Artist[];
}

function Tags(props: TagsProps) {
  return (
    <div className="flex flex-nowrap items-center h-9 overflow-scroll">
      {props.suggestions.map((artist, i) => {
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

export default Tags;
