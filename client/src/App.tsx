import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Suggestions from "./components/Suggestions";
import Results from "./components/Results";
import { Artist, RelatedArtistsResponse, SearchResponse } from "./lib/types";
import { BsSpotify } from "react-icons/bs";

function App() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);
  const [suggestions, setSuggestions] = useState([] as Artist[]);

  useEffect(() => {
    // Periodically check the token has not expired.
    checkTokenExpiry();
    setInterval(() => {
      checkTokenExpiry();
    }, 60 * 1000);
  }, []);

  useEffect(() => {
    searchArtists();
  }, [query]);

  useEffect(() => {
    if (token) {
      return;
    }

    const params = getHashParams();
    if (params.get("access_token")) {
      // The token exists in the URL.
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");
      const refreshToken = params.get("refresh_token");
      storeToken(accessToken!, Number(expiresIn), refreshToken);
    } else if (localStorage.getItem("accessToken")) {
      // The token exists in local storage.
      const accessToken = localStorage.getItem("accessToken");
      setToken(accessToken!);
    }
  }, [token]);

  const storeToken = (
    accessToken: string,
    expiresIn: number, // Number of seconds till expiry.
    refreshToken: string | undefined
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("expiresIn", String(Date.now() + expiresIn * 1000));
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    setToken(accessToken);
  };

  const checkTokenExpiry = async () => {
    if (localStorage.getItem("accessToken")) {
      const expiresIn = localStorage.getItem("expiresIn");
      // If there is less than 10 minutes left, refresh the token.
      if (Date.now() + 10 * 60 * 1000 >= Number(expiresIn)) {
        // Refresh the access token.
        const resp = await axios.get(
          `/refresh_token?refresh_token=${localStorage.getItem("refreshToken")}`
        );
        storeToken(resp.data.access_token, resp.data.expires_in, undefined);
      }
    }
  };

  const getHashParams = () => {
    let hashParams = new Map<string, string>();
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams.set(e[1], decodeURIComponent(e[2]));
    }
    return hashParams;
  };

  const searchArtists = async () => {
    if (!query) {
      setArtists([]);
      setSuggestions([]);
      return;
    }

    try {
      // TODO: Move HTTP requests to a library.
      const searchResp = await axios.get(
        `https://api.spotify.com/v1/search?type=artist&q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const searchData = searchResp.data as SearchResponse;

      // Parse suggestions.
      let suggestions: Artist[] = [];
      for (let i = 1; i < searchData.artists.items.length; i++) {
        suggestions.push(searchData.artists.items[i]);
      }
      setSuggestions(suggestions);

      // Parse primary artist and fetch related artists.
      const primaryArtist = searchData.artists.items[0];
      let artists: Artist[] = [primaryArtist];
      const relatedArtistsResp = await axios.get(
        `https://api.spotify.com/v1/artists/${primaryArtist.id}/related-artists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const relatedArtistsData =
        relatedArtistsResp.data as RelatedArtistsResponse;
      for (let i = 1; i < relatedArtistsData.artists.length; i++) {
        artists.push(relatedArtistsData.artists[i]);
      }
      setArtists(artists);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-primary">
      {token ? (
        <>
          <Header query={query} setQuery={setQuery} />
          <Suggestions artists={suggestions} setQuery={setQuery} />
          <Results token={token} artists={artists} />
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <a
            className="flex justify-center bg-[#1db954] border-[1px] border-black text-md text-white w-60 h-16 mt-6 px-4 items-center cursor-pointer"
            href="/login"
          >
            <BsSpotify className="mr-2" />
            Login with Spotify
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
