import axios from "axios";
import { useState } from "react";
import { Album, AlbumsResponse, Artist, Track } from "../lib/types";
import Tags from "./Tags";
import Player from "./Player";

interface ResultsProps {
  token: string;
  artists: Artist[]; // All artists returned from the search query.
}

function Results(props: ResultsProps) {
  const [selected, setSelected] = useState<Map<string, Artist>>(new Map());
  const [current, setCurrent] = useState<Track>();
  const [unplayed, setUnplayed] = useState<Track[]>([]);
  const [played, setPlayed] = useState<Track[]>([]);

  const addArtist = (artist: Artist) => {
    let newSelected = new Map(selected);
    newSelected.set(artist.id, artist);
    setSelected(newSelected);
    addTracks(artist.id);
  };

  const removeArtist = (id: string) => {
    let newSelected = new Map(selected);
    newSelected.delete(id);
    setSelected(newSelected);
    removeTracks(id);
  };

  const addTracks = async (id: string) => {
    try {
      // Get 20 random tracks for the selected artist.
      // TODO: Move HTTP requests to a library.
      const n = 20;
      const albumsResp = await axios.get(
        `https://api.spotify.com/v1/artists/${id}/albums`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      const albumsData = albumsResp.data as AlbumsResponse;
      let tracks: Track[] = [];
      for (let album of albumsData.items) {
        const albumResp = await axios.get(
          `https://api.spotify.com/v1/albums/${album.id}`,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        );
        const albumData = albumResp.data as Album;
        tracks = tracks.concat(albumData.tracks!.items);
      }
      tracks = shuffleTracks(tracks).slice(0, n);

      let newUnplayed = unplayed.concat(tracks);
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

  const removeTracks = async (id: string) => {
    // Remove artist from the queue of unplayed tracks.
    let newUnplayed = unplayed.slice();
    for (let i = unplayed.length - 1; i >= 0; i--) {
      for (const a of unplayed[i].artists) {
        if (a.id === id) newUnplayed.splice(i, 1);
      }
    }
    setUnplayed(newUnplayed);

    // Update current track if it is the artist being removed.
    if (current) {
      for (const a of current.artists) {
        if (a.id === id) {
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

  const handlePrev = () => {
    if (!current) {
      return;
    }

    let newUnplayed = unplayed.slice();
    let newPlayed = played.slice();
    const newCurrent = played[played.length - 1];
    newUnplayed.unshift(current);
    newPlayed.pop();
    setCurrent(newCurrent);
    setUnplayed(newUnplayed);
    setPlayed(newPlayed);
  };

  const handleNext = () => {
    if (!current) {
      return;
    }

    let newUnplayed = unplayed.slice();
    let newPlayed = played.slice();
    const newCurrent = unplayed[0];
    newUnplayed.shift();
    newPlayed.push(current);
    setCurrent(newCurrent);
    setUnplayed(newUnplayed);
    setPlayed(newPlayed);
  };

  return (
    <>
      <Tags artists={selected} removeArtist={removeArtist} />
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
                className="absolute top-0 bg-primary opacity-0 text-center vertical-middle w-full h-full ease-in-out duration-150"
                onClick={() =>
                  selected.get(artist.id)
                    ? removeArtist(artist.id) // The artist has been deselected.
                    : addArtist(artist)
                }
              >
                <span className="flex h-full justify-center items-center text-md">
                  {artist.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {current && (
        <Player
          current={current}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      )}
    </>
  );
}

export default Results;
