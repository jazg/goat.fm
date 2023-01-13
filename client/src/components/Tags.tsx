import { Artist } from "../lib/types";
import { BiX } from "react-icons/bi";

interface TagsProps {
  artists: Map<string, Artist>;
  removeArtist: (id: string) => void;
}

function Tags(props: TagsProps) {
  return (
    <>
      {props.artists.size > 0 && (
        <div className="flex flex-nowrap items-center overflow-scroll mt-2 mb-4 mr-4">
          {[...props.artists.values()].map((artist, i) => {
            return (
              <span
                key={i}
                className="flex items-center border-[1px] border-black text-sm whitespace-nowrap h-12 ml-4 px-4 cursor-pointer"
                onClick={() => props.removeArtist(artist.id)}
              >
                {artist.name} <BiX className="ml-2" />
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Tags;
