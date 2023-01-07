import { useEffect, useState } from "react";
import axios from "axios";
import { Artist, RelatedArtistsResponse, SearchResponse } from "../lib/types";
import spotify from "../assets/spotify.svg";

interface SearchProps {
  token: string;
  setArtists: (artists: Artist[]) => void;
  setSuggestions: (suggestions: Artist[]) => void;
}

function Search(props: SearchProps) {
  const [query, setQuery] = useState("");

  const searchArtists = async () => {
    try {
      // TODO: Move HTTP requests to a library.
      const searchResp = await axios.get(
        `https://api.spotify.com/v1/search?type=artist&q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      const searchData = searchResp.data as SearchResponse;

      // Parse suggestions.
      let suggestions: Artist[] = [];
      for (let i = 1; i < searchData.artists.items.length; i++) {
        suggestions.push(searchData.artists.items[i]);
      }
      props.setSuggestions(suggestions);

      // Parse primary artist and fetch related artists.
      const primaryArtist = searchData.artists.items[0];
      let artists: Artist[] = [primaryArtist];
      const relatedArtistsResp = await axios.get(
        `https://api.spotify.com/v1/artists/${primaryArtist.id}/related-artists`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      const relatedArtistsData =
        relatedArtistsResp.data as RelatedArtistsResponse;
      for (let i = 1; i < relatedArtistsData.artists.length; i++) {
        artists.push(relatedArtistsData.artists[i]);
      }
      props.setArtists(artists);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchArtists();
    }
  };

  return (
    <input
      type="text"
      className="h-9 border-[1px] border-b-0 border-black outline-none w-80 text-xs px-4"
      value={query}
      placeholder="Search for an artist..."
      onChange={handleQuery}
      onKeyDown={handleKeyDown}
    />
  );
}

export default Search;
