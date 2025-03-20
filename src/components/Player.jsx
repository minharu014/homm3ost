import { useState, useEffect, useRef } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsVolumeUp,
  BsVolumeMute,
} from "react-icons/bs";
import { GiCrossedSwords, GiLaurelCrown, GiTombstone } from "react-icons/gi";
import ElasticSlider from "./ElasticSlider";

function Player({ currentTrack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  // Track battle music state
  const [battleAudio, setBattleAudio] = useState(null);
  const [battleTrackInfo, setBattleTrackInfo] = useState(null);
  // Add track progress state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Timer reference for tracking progress
  const progressTimerRef = useRef(null);

  useEffect(() => {
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.volume = volume;
      //play the new track
      currentTrack.audio.play();
      setIsPlaying(true);

      // Stop any battle audio if playing
      if (battleAudio) {
        battleAudio.pause();
        setBattleAudio(null);
        setBattleTrackInfo(null);
      }

      // Set up time update listener for the current track
      currentTrack.audio.addEventListener("timeupdate", updateProgressCurrent);
      currentTrack.audio.addEventListener("loadedmetadata", () => {
        setDuration(currentTrack.audio.duration);
      });

      // Check if duration is already available
      if (currentTrack.audio.duration) {
        setDuration(currentTrack.audio.duration);
      }

      return () => {
        // Clean up listeners when component unmounts or track changes
        if (currentTrack && currentTrack.audio) {
          currentTrack.audio.removeEventListener(
            "timeupdate",
            updateProgressCurrent
          );
        }
      };
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentTrack]);

  // Update volume for battle audio when volume changes
  useEffect(() => {
    if (battleAudio) {
      battleAudio.volume = volume;
    }
  }, [volume, battleAudio]);

  // Add battle audio progress tracking
  useEffect(() => {
    if (battleAudio) {
      // Set up time update listener for battle audio
      battleAudio.addEventListener("timeupdate", updateProgressBattle);
      battleAudio.addEventListener("loadedmetadata", () => {
        setDuration(battleAudio.duration);
      });

      // Check if duration is already available
      if (battleAudio.duration) {
        setDuration(battleAudio.duration);
      }

      return () => {
        if (battleAudio) {
          battleAudio.removeEventListener("timeupdate", updateProgressBattle);
        }
      };
    }
  }, [battleAudio]);

  // Progress update functions
  const updateProgressCurrent = () => {
    if (currentTrack && currentTrack.audio) {
      setCurrentTime(currentTrack.audio.currentTime);
    }
  };

  const updateProgressBattle = () => {
    if (battleAudio) {
      setCurrentTime(battleAudio.currentTime);
    }
  };

  // Seeking functionality
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);

    // Determine which audio to seek (battle or track)
    if (battleAudio) {
      // Stop current battle audio
      battleAudio.pause();

      // Create a new audio instance at the seeked position
      const currentSrc = battleAudio.src;
      const newAudio = new Audio(currentSrc);
      newAudio.volume = volume;
      newAudio.currentTime = seekTime;

      // Update event listeners
      newAudio.addEventListener("timeupdate", updateProgressBattle);
      newAudio.addEventListener("loadedmetadata", () => {
        setDuration(newAudio.duration);
      });

      // Set up onended handler if it was a combat track
      if (
        battleTrackInfo &&
        battleTrackInfo.tag === "Battle" &&
        battleTrackInfo.title.includes("Combat")
      ) {
        newAudio.onended = () => {
          setBattleAudio(null);
          setBattleTrackInfo(null);
          setIsPlaying(false);
        };
      } else {
        newAudio.onended = () => {
          setBattleAudio(null);
          setBattleTrackInfo(null);
          setIsPlaying(false);
        };
      }

      // Play the new audio and update state
      newAudio.play();
      setBattleAudio(newAudio);
      setCurrentTime(seekTime);
      setIsPlaying(true);
    } else if (currentTrack && currentTrack.audio) {
      // Stop the current audio
      currentTrack.audio.pause();

      // Create a new audio instance at the seeked position
      const newAudio = new Audio(currentTrack.src);
      newAudio.volume = volume;
      newAudio.currentTime = seekTime;

      // Update event listeners
      newAudio.addEventListener("timeupdate", updateProgressCurrent);
      newAudio.addEventListener("loadedmetadata", () => {
        setDuration(newAudio.duration);
      });

      // Play the new audio and update the current track
      newAudio.play();
      currentTrack.audio = newAudio;
      setCurrentTime(seekTime);
      setIsPlaying(true);
    }
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (battleAudio) {
      if (isPlaying) {
        battleAudio.pause();
      } else {
        battleAudio.play();
      }
      setIsPlaying(!isPlaying);
    } else if (currentTrack && currentTrack.audio) {
      if (isPlaying) {
        currentTrack.audio.pause();
      } else {
        currentTrack.audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolumePercent) => {
    const newVolume = newVolumePercent / 100;
    setVolume(newVolume);
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.volume = newVolume;
    }
    if (battleAudio) {
      battleAudio.volume = newVolume;
    }
  };

  const playSound = (soundFile, title) => {
    // Stop current track and battle audio if playing
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.pause();
    }
    if (battleAudio) {
      battleAudio.pause();
      setBattleAudio(null);
    }

    const audio = new Audio(soundFile);
    audio.volume = volume;
    audio.play();

    // Update display and state
    setBattleTrackInfo({ title: title, tag: "Battle" });
    setBattleAudio(audio);
    setIsPlaying(true);

    // Clear battle state when sound ends
    audio.onended = () => {
      setBattleAudio(null);
      setBattleTrackInfo(null);
      setIsPlaying(false);
    };
  };

  const playWinSound = () => {
    playSound("/tracks/Win Battle.mp3", "Win Battle");
  };

  const playLoseSound = () => {
    playSound("/tracks/LoseCombat.mp3", "Lose Combat");
  };

  const playBattleMusic = () => {
    // Don't allow multiple clicks while battle music is playing
    if (battleAudio) return;

    // Stop current track if playing
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.pause();
    }

    // First play Win Battle sound (as the toggle)
    const winBattleAudio = new Audio("/tracks/Win Battle.mp3");
    winBattleAudio.volume = volume;
    setBattleTrackInfo({ title: "Win Battle", tag: "Battle" });
    setIsPlaying(true);
    setBattleAudio(winBattleAudio);

    winBattleAudio.play();

    // When toggle sound ends, play random combat track
    winBattleAudio.onended = () => {
      // Play random combat track
      const combatTracks = [
        { src: "/tracks/COMBAT01.MP3", title: "Combat 01", tag: "Battle" },
        { src: "/tracks/COMBAT02.MP3", title: "Combat 02", tag: "Battle" },
        { src: "/tracks/COMBAT03.MP3", title: "Combat 03", tag: "Battle" },
        { src: "/tracks/COMBAT04.MP3", title: "Combat 04", tag: "Battle" },
      ];
      const randomTrackIndex = Math.floor(Math.random() * combatTracks.length);
      const selectedTrack = combatTracks[randomTrackIndex];

      const combatAudio = new Audio(selectedTrack.src);
      combatAudio.volume = volume;

      // When combat track ends, clear battle state
      combatAudio.onended = () => {
        setBattleAudio(null);
        setBattleTrackInfo(null);
        setIsPlaying(false);
      };

      combatAudio.play();
      setBattleAudio(combatAudio);
      setBattleTrackInfo(selectedTrack);
    };
  };

  // Determine which track info to display
  const displayTrack = battleTrackInfo || currentTrack;
  const activeAudio = battleAudio || (currentTrack && currentTrack.audio);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-yellow-900/30 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 py-2">
        <div className="flex flex-col">
          {/* Progress bar */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-500 text-xs">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                  (currentTime / duration) * 100
                }%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`,
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
            <span className="text-yellow-500 text-xs">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800/50 rounded"></div>
              <div>
                <h4 className="text-yellow-500 font-cinzel font-medium text-xs">
                  {displayTrack ? displayTrack.title : "Now Playing"}
                </h4>
                <p className="text-gray-400 text-xs">
                  {displayTrack ? displayTrack.tag : "Track Artist"}
                </p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center space-x-5">
              <div className="flex flex-col items-center">
                <button
                  onClick={togglePlay}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors mb-1"
                >
                  {isPlaying ? (
                    <BsPauseFill className="text-xl" />
                  ) : (
                    <BsPlayFill className="text-xl" />
                  )}
                </button>
                <span className="text-yellow-500 text-[8px]">
                  {isPlaying ? "Pause" : "Play"}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={playBattleMusic}
                  className={`text-yellow-500 hover:text-yellow-400 transition-colors mb-1 ${
                    battleAudio ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Play Battle Music"
                  disabled={!!battleAudio}
                >
                  <GiCrossedSwords className="text-xl" />
                </button>
                <span className="text-yellow-500 text-[8px]">Battle</span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={playWinSound}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors mb-1"
                  title="Play Win Sound"
                >
                  <GiLaurelCrown className="text-xl" />
                </button>
                <span className="text-yellow-500 text-[8px]">Win</span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={playLoseSound}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors mb-1"
                  title="Play Lose Sound"
                >
                  <GiTombstone className="text-xl" />
                </button>
                <span className="text-yellow-500 text-[8px]">Lose</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="w-36">
              <ElasticSlider
                leftIcon={<BsVolumeMute className="text-yellow-500 text-xs" />}
                rightIcon={<BsVolumeUp className="text-yellow-500 text-xs" />}
                startingValue={0}
                defaultValue={volume * 100}
                maxValue={100}
                className="transform translate-y-1"
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Player;
