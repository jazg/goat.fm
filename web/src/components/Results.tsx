import axios from "axios";
import { useState } from "react";
import { Artist, TopTracksResponse, Track } from "../lib/types";
import Player from "./Player";

interface ResultsProps {
  token: string;
  artists: Artist[];
}

function Results(props: ResultsProps) {
  const [tracks, setTracks] = useState([] as Track[]);

  const searchTracks = async (id: string) => {
    console.log(id, props.token);
    try {
      const topTracksResp = await axios.get(
        `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      const tracksData = topTracksResp.data as TopTracksResponse;
      console.log(tracksData);
      setTracks(tracksData.tracks);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap">
        {props.artists.map((artist, i) => {
          return (
            <div
              key={i}
              className={`
            relative w-1/2 md:w-1/4 2xl:w-1/5
            bg-cover bg-center
            before:block before:pt-[100%] left
            hover:[&>div]:opacity-90
            `}
              style={{ backgroundImage: `url('${artist.images[0].url}')` }}
            >
              <div
                className="absolute top-0 bg-white opacity-0 text-center vertical-middle w-full h-full ease-in-out duration-150"
                onClick={() => searchTracks(artist.id)}
              >
                <span className="flex h-full justify-center items-center text-sm">
                  {artist.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <Player tracks={tracks} />
    </>
  );
}

export default Results;
