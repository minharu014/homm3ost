import { useState, useEffect } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipBackwardFill,
  BsSkipForwardFill,
  BsVolumeUp,
} from "react-icons/bs";

function Player({ currentTrack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.volume = volume;
      // Automatically play the new track
      currentTrack.audio.play();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, volume]);

  const togglePlay = () => {
    if (currentTrack && currentTrack.audio) {
      if (isPlaying) {
        currentTrack.audio.pause();
      } else {
        currentTrack.audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (direction) => {
    // Implement logic to skip to previous or next track
    console.log(`Skipping ${direction === -1 ? "backward" : "forward"}`);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.volume = newVolume;
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-yellow-900/30 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800/50 rounded"></div>
            <div>
              <h4 className="text-yellow-500 font-cinzel font-medium text-xs">
                {currentTrack ? currentTrack.title : "Now Playing"}
              </h4>
              <p className="text-gray-400 text-xs">
                {currentTrack ? currentTrack.tag : "Track Artist"}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => skipTrack(-1)}
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <BsSkipBackwardFill className="text-sm" />
            </button>
            <button
              onClick={togglePlay}
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              {isPlaying ? (
                <BsPauseFill className="text-xl" />
              ) : (
                <BsPlayFill className="text-xl" />
              )}
            </button>
            <button
              onClick={() => skipTrack(1)}
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <BsSkipForwardFill className="text-sm" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 w-24">
            <BsVolumeUp className="text-yellow-500 text-xs" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="flex-1 h-0.5 bg-gray-700/50 rounded-full appearance-none"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Player;
