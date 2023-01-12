import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Suggestions from "./components/Suggestions";
import Results from "./components/Results";
import { Artist } from "./lib/types";
import spotify from "./assets/spotify.svg";

function App() {
  const [token, setToken] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);
  const [suggestions, setSuggestions] = useState([] as Artist[]);

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
  });

  useEffect(() => {
    // Periodically check the token has not expired.
    setInterval(() => {
      console.log("checking");
      if (localStorage.getItem("accessToken")) {
        const expiresIn = localStorage.getItem("expiresIn");
        if (Date.now() >= Number(expiresIn)) {
          console.log("refreshing", Date.now(), expiresIn);
          // Refresh the access token.
          refreshToken();
        }
        return;
      }
    }, 60 * 1000);
  }, []);

  const storeToken = (
    accessToken: string,
    expiresIn: number,
    refreshToken: string | undefined
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("expiresIn", String(Date.now() + expiresIn));
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    setToken(accessToken);
  };

  const refreshToken = async () => {
    const resp = await axios.get(
      `/refresh_token?refresh_token=${localStorage.getItem("refreshToken")}`
    );
    // TODO: If this returns an error (i.e. the refresh token has expired), then
    // remove the token from the state so the user can log in.
    storeToken(resp.data.access_token, resp.data.expires_in, undefined);
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
            className="flex bg-[#1db954] border-[1px] border-black text-xs text-white h-9 mt-6 px-4 items-center cursor-pointer"
            href="/login"
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
