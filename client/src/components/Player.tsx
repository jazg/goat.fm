import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { Track, VideoResponse } from "../lib/types";

interface PlayerProps {
  current: Track;
  handlePrev: () => void;
  handleNext: () => void;
}

function Player(props: PlayerProps) {
  const [playing, setPlaying] = useState(true);
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
      )}&type=video&key=AIzaSyBcNRYIrTQSl4CevgDjWjjyQp-SfvzJU10`
    );
    const videoData = videoResp.data as VideoResponse;
    setVideoID(videoData.items[0].id.videoId);
    setPlaying(true);
  };

  return (
    <>
      {videoID && (
        <div className="fixed bottom-0 right-0">
          <div className="flex justify-between items-center absolute bottom-0 bg-white border-t-[1px] border-black w-full h-9">
            <span
              className="ml-4 cursor-pointer hover:underline"
              onClick={() => setPlaying(!playing)}
            >
              {playing ? "Pause" : "Play"}
            </span>
            <div>
              <span
                className="mr-4 cursor-pointer hover:underline"
                onClick={props.handlePrev}
              >
                Prev
              </span>
              <span
                className="mr-4 cursor-pointer hover:underline"
                onClick={props.handleNext}
              >
                Next
              </span>
            </div>
          </div>
          <ReactPlayer
            className="relative bottom-9"
            url={`https://www.youtube.com/watch?v=${videoID}`}
            playing={playing}
            config={{
              playerVars: {
                loop: 1,
              },
            }}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            onEnded={props.handleNext}
            handl
          />
        </div>
      )}
    </>
  );
}

export default Player;
