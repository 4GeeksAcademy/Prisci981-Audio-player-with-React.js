import React from "react";
import "../../styles/index.css";
import AudioPlayer from "./AudioPlayer";

const Home = () => {
  return (
    <div className="container">
	<h1 className="text-center mt-5">My Audio Player!</h1>
      <AudioPlayer audioSrc="./audio/audio.mp3" />

         </div>
  );
};

export default Home;
