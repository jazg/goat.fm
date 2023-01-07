import axios from "axios";
import { useState } from "react";
import { Artist, TopTracksResponse, Track } from "../lib/types";
import Player from "./Player";

interface ResultsProps {
  token: string;
  artists: Artist[];
}

function Results(props: ResultsProps) {
  const [selected, setSelected] = useState<Map<string, Artist>>(new Map());
  const [current, setCurrent] = useState<Track>();
  const [unplayed, setUnplayed] = useState<Track[]>([]);
  const [played, setPlayed] = useState<Track[]>([]);

  const handleArtist = async (artist: Artist) => {
    let newSelected = new Map(selected);
    if (selected.get(artist.id)) {
      // The artist has been deselected.
      newSelected.delete(artist.id);
      setSelected(newSelected);
      removeTracks(artist);
    } else {
      newSelected.set(artist.id, artist);
      setSelected(newSelected);
      addTracks(artist);
    }
  };

  const addTracks = async (artist: Artist) => {
    try {
      // Fetch the artist's top tracks.
      // TODO: Move HTTP requests to a library.
      const topTracksResp = await axios.get(
        `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      const tracksData = topTracksResp.data as TopTracksResponse;
      let newUnplayed = unplayed.concat(tracksData.tracks);
      newUnplayed = shuffleTracks(newUnplayed);

      // Set the current track if there are no songs playing.
      if (!current) {
        setCurrent(newUnplayed[0]);
        newUnplayed.shift();
      }

      setUnplayed(newUnplayed);
    } catch (error) {
      console.error(error);
    }
  };

  const removeTracks = async (artist: Artist) => {
    // Remove artist from the queue of unplayed tracks.
    let newUnplayed = unplayed.slice();
    for (let i = unplayed.length - 1; i >= 0; i--) {
      for (const a of unplayed[i].artists) {
        if (a.id === artist.id) newUnplayed.splice(i, 1);
      }
    }
    setUnplayed(newUnplayed);

    // Update current track if it is the artist being removed.
    if (current) {
      for (const a of current.artists) {
        if (a.id === artist.id) {
          setCurrent(newUnplayed[0]);
        }
      }
    }
  };

  const shuffleTracks = (tracks: Track[]): Track[] => {
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = tracks[i];
      tracks[i] = tracks[j];
      tracks[j] = temp;
    }
    return tracks;
  };

  return (
    <>
      <div className="flex flex-wrap">
        {props.artists.map((artist, i) => {
          const active = selected.get(artist.id);
          return (
            <div
              key={i}
              className={`
            relative w-1/2 md:w-1/4 2xl:w-1/5
            bg-cover bg-center cursor-pointer
            before:block before:pt-[100%] left
            hover:[&>div]:opacity-90
            ${active && `[&>div]:opacity-90`}
            `}
              style={
                artist.images && {
                  backgroundImage: `url('${artist.images[0].url}')`,
                }
              }
            >
              <div
                className="absolute top-0 bg-white opacity-0 text-center vertical-middle w-full h-full ease-in-out duration-150"
                onClick={() => handleArtist(artist)}
              >
                <span className="flex h-full justify-center items-center text-sm">
                  {artist.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {current && <Player current={current} />}
    </>
  );
}

export default Results;
