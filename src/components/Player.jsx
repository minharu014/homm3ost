import { useState, useEffect } from "react";
import { BsPlayFill, BsPauseFill, BsVolumeUp } from "react-icons/bs";
import { GiCrossedSwords, GiLaurelCrown, GiTombstone } from "react-icons/gi";

function Player({ currentTrack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  // Track battle music state
  const [battleAudio, setBattleAudio] = useState(null);
  const [battleTrackInfo, setBattleTrackInfo] = useState(null);

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
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, volume]);

  // Update volume for battle audio when volume changes
  useEffect(() => {
    if (battleAudio) {
      battleAudio.volume = volume;
    }
  }, [volume, battleAudio]);

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

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
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

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-yellow-900/30 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 py-2">
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
          <div className="flex items-center space-x-4">
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
              onClick={playBattleMusic}
              className={`text-yellow-500 hover:text-yellow-400 transition-colors ${
                battleAudio ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Play Battle Music"
              disabled={!!battleAudio}
            >
              <GiCrossedSwords className="text-xl" />
            </button>
            <button
              onClick={playWinSound}
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
              title="Play Win Sound"
            >
              <GiLaurelCrown className="text-xl" />
            </button>
            <button
              onClick={playLoseSound}
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
              title="Play Lose Sound"
            >
              <GiTombstone className="text-xl" />
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
