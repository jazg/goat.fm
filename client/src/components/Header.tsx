import Search from "./Search";
import { Artist } from "../lib/types";

interface HeaderProps {
  token: string;
  setArtists: (artists: Artist[]) => void;
  setSuggestions: (suggestions: Artist[]) => void;
}

function Header(props: HeaderProps) {
  return (
    <div className="flex justify-center border-b-[1px] border-black pt-3 px-8">
      <Search
        token={props.token}
        setArtists={props.setArtists}
        setSuggestions={props.setSuggestions}
      />
    </div>
  );
}

export default Header;
