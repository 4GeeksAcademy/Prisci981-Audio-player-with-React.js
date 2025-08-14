import React, { useEffect, useState, useRef } from "react";
import "../../styles/index.css";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playList, setPlayList] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const audioRef = useRef(null);

  // Fetch playlist
  useEffect(() => {
    fetch("https://playground.4geeks.com/sound/songs")
      .then((response) => response.json())
      .then((data) => setPlayList(data.songs));
  }, []);

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    isPlaying ? handlePause() : handlePlay();
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playList.length);
    setIsPlaying(false);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playList.length) % playList.length);
    setIsPlaying(false);
  };

  function formatDuration(durationSeconds) {
    if (!durationSeconds || isNaN(durationSeconds)) return "0:00";
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.floor(durationSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
  if (!audioRef.current) return; // prevent null error

  const audio = audioRef.current;
  audio.addEventListener("timeupdate", handleTimeUpdate);

  return () => {
    audio.removeEventListener("timeupdate", handleTimeUpdate);
  };
}, [playList]); // re-run when playlist loads


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex]);

  return (
    <div className="player-container">
      <div className="player-card">
        {playList.length > 0 && (
          <>
            <h3>{playList[currentSongIndex].name}</h3>
           <audio
              ref={audioRef}
              src={`https://playground.4geeks.com${playList[currentSongIndex].url}`}
            />
          </>
        )}

        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
        />

        <div className="track-duration">
          <p>{formatDuration(currentTime)}</p>
          <p>{formatDuration(duration)}</p>
        </div>

        <div className="controls">
          <button onClick={prevSong}>Prev</button>
          <button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={nextSong}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
