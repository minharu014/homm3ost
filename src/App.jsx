import TrackCard from "./components/TrackCard";
import Player from "./components/Player";
import "@fontsource/cinzel";

function App() {
  const tracks = [
    { id: 1, title: "Main Theme", artist: "Paul Anthony Romero" },
    { id: 2, title: "Castle Theme", artist: "Paul Anthony Romero" },
    { id: 3, title: "Rampart Theme", artist: "Paul Anthony Romero" },
    { id: 4, title: "Tower Theme", artist: "Paul Anthony Romero" },
    { id: 5, title: "Inferno Theme", artist: "Paul Anthony Romero" },
    { id: 6, title: "Necropolis Theme", artist: "Paul Anthony Romero" },
    { id: 7, title: "Dungeon Theme", artist: "Paul Anthony Romero" },
    { id: 8, title: "Stronghold Theme", artist: "Paul Anthony Romero" },
  ];

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
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                title={track.title}
                artist={track.artist}
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
