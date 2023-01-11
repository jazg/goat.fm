import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Suggestions from "./components/Suggestions";
import Results from "./components/Results";
import { Artist } from "./lib/types";
import spotify from "./assets/spotify.svg";

function App() {
  const clientID = "876c87b4c82f4872aa0a4cfc3bca89e8";
  const redirectURI = "http://localhost:5173";

  const [token, setToken] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);
  const [suggestions, setSuggestions] = useState([] as Artist[]);

  useEffect(() => {
    if (!token) {
      const accessToken = window.location.hash.substring(
        window.location.hash.indexOf("=") + 1,
        window.location.hash.indexOf("&")
      );
      setToken(accessToken);
    }
  });

  return (
    <>
      {token ? (
        <>
          <Header
            token={token}
            setArtists={setArtists}
            setSuggestions={setSuggestions}
          />
          <Suggestions artists={suggestions} />
          <Results token={token} artists={artists} />
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <a
            className="flex bg-[#1db954] border-[1px] border-black text-xs text-white h-9 mt-6 px-4 items-center"
            href={
              `https://accounts.spotify.com/authorize` +
              `?response_type=token` +
              `&client_id=${encodeURIComponent(clientID)}` +
              `&redirect_uri=${encodeURIComponent(redirectURI)}`
            }
          >
            <img className="w-4 mr-2" src={spotify} />
            Login with Spotify
          </a>
        </div>
      )}
    </>
  );
}

export default App;
