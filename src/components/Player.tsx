import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { Track, VideoResponse } from "../lib/types";

interface PlayerProps {
  current: Track;
}

function Player(props: PlayerProps) {
  const [videoID, setVideoID] = useState("");

  useEffect(() => {
    fetchVideo(props.current);
  }, [props.current]);

  const fetchVideo = async (track: Track) => {
    const query = track.artists[0].name + " - " + track.name;
    // TODO: Move HTTP requests to a library.
    const videoResp = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&key=AIzaSyDfrcPA8V2cEZp7IVauGJgwSZI6k1JJvgI`
    );
    const videoData = videoResp.data as VideoResponse;
    setVideoID(videoData.items[0].id.videoId);
  };

  return (
    <>
      {videoID && (
        <ReactPlayer
          className="fixed bottom-0 right-0"
          url={`https://www.youtube.com/watch?v=${videoID}`}
          config={{
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
            },
          }}
        />
      )}
    </>
  );
}

export default Player;
