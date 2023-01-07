import { useEffect, useState } from "react";
import axios from "axios";
import Search from "./Search";
import { Artist } from "../lib/types";
import spotify from "../assets/spotify.svg";

interface HeaderProps {
  token: string;
  setToken: (token: string) => void;
  setArtists: (artists: Artist[]) => void;
  setSuggestions: (suggestions: Artist[]) => void;
}

function Header(props: HeaderProps) {
  const clientID = "876c87b4c82f4872aa0a4cfc3bca89e8";
  const redirectURI = "http://localhost:5173";

  useEffect(() => {
    if (!props.token) {
      const accessToken = window.location.hash.substring(
        window.location.hash.indexOf("=") + 1,
        window.location.hash.indexOf("&")
      );
      props.setToken(accessToken);
    }
  });

  return (
    <div className="flex justify-center border-b-[1px] border-black pt-3 px-8">
      {props.token ? (
        <Search
          token={props.token}
          setArtists={props.setArtists}
          setSuggestions={props.setSuggestions}
        />
      ) : (
        <a
          className="flex bg-[#1db954] border-[1px] border-b-0 border-black text-xs text-white h-9 px-4 items-center"
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
      )}
    </div>
  );
}

export default Header;
