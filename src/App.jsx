import { useState } from "react";
import TrackCard from "./components/TrackCard";
import Player from "./components/Player";
import "@fontsource/cinzel";
import tracksData from "./data/tracks.json";
import CombatDock from "./components/CombatDock";

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);

  const handleTrackSelect = (track) => {
    // Stop the current track if it's playing
    if (currentTrack && currentTrack.audio) {
      currentTrack.audio.pause();
    }

    // Set the new track as current
    setCurrentTrack(track);

    // Create a new Audio object for the selected track
    const newAudio = new Audio(track.src);
    newAudio.play();

    // Update the current track with the new Audio object
    setCurrentTrack({ ...track, audio: newAudio });
  };

  // Function to sort and group tracks by tag
  const sortAndGroupTracks = (tracks) => {
    const townTracks = tracks.filter(
      (track) => track.tag.toLowerCase() === "town"
    );
    const battleTracks = tracks.filter(
      (track) => track.tag.toLowerCase() === "battle"
    );
    const aiThemeTracks = tracks.filter((track) =>
      track.tag.toLowerCase().includes("theme")
    );
    const otherTracks = tracks.filter(
      (track) =>
        !["town", "battle"].includes(track.tag.toLowerCase()) &&
        !track.tag.toLowerCase().includes("theme")
    );

    return [
      { tag: "TOWN", tracks: townTracks },
      { tag: "BATTLE", tracks: battleTracks },
      { tag: "AI THEMES", tracks: aiThemeTracks },
      { tag: "OTHER", tracks: otherTracks },
    ];
  };

  const groupedTracks = sortAndGroupTracks(tracksData);

  return (
    <div className="min-h-screen flex flex-col">
      {/* CombatDock now at the top, above everything */}
      <CombatDock />

      {/* Header/Nav with Logo - add some top padding to account for the fixed dock */}
      <header className="w-full py-3 px-6 mt-16">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img
              src="/images/homm3-logo.svg"
              alt="Heroes of Might and Magic III"
              className="h-12 w-auto"
            />
            <h2 className="text-yellow-500 font-cinzel text-sm font-medium hover:text-yellow-400 cursor-pointer transition-colors">
              Donate
            </h2>
          </div>
        </div>
      </header>
      <hr className="border-amber-50 opacity-35 py-2"></hr>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 mb-24">
        <div className="max-w-screen-xl mx-auto">
          {/* Grid of Cards */}
          {groupedTracks.map((group, index) => (
            <div key={group.tag}>
              <h2 className="text-yellow-200 font-cinzel font-medium text-xs mb-2">
                {group.tag}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {group.tracks.map((track) => (
                  <TrackCard
                    key={track.id}
                    title={track.title}
                    tag={track.tag}
                    duration={track.duration}
                    picture={track.picture}
                    src={track.src}
                    onSelect={handleTrackSelect}
                  />
                ))}
              </div>
              {index < groupedTracks.length - 1 && (
                <hr className="my-4 border-gray-700" />
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Player remains at the bottom */}
      <Player currentTrack={currentTrack} />
    </div>
  );
}

export default App;
