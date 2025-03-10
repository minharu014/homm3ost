import TrackCard from "./components/TrackCard";
import Player from "./components/Player";
import "@fontsource/cinzel";
import tracksData from "./data/tracks.json";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Nav with Logo */}
      <header className="w-full py-3 px-6">
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="max-w-screen-xl mx-auto">
          {/* Grid of Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {tracksData.map((track) => (
              <TrackCard
                key={track.id}
                title={track.title}
                tag={track.tag}
                duration={track.duration}
                picture={track.picture}
              />
            ))}
          </div>
        </div>
      </main>

      <Player />
    </div>
  );
}

export default App;
