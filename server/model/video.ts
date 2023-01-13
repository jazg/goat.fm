import mongoose from "mongoose";
const { Schema, model } = mongoose;

const videoSchema = new Schema({
  artist: String,
  title: String,
  id: String,
  timestamp: Number,
});

const Video = model("Video", videoSchema);
export default Video;
