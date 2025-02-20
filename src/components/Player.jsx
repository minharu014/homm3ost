import {
  BsPlayFill,
  BsPauseFill,
  BsSkipBackwardFill,
  BsSkipForwardFill,
  BsVolumeUp,
} from "react-icons/bs";

function Player() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-yellow-900/30 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800/50 rounded"></div>
            <div>
              <h4 className="text-yellow-500 font-cinzel font-medium text-xs">
                Now Playing
              </h4>
              <p className="text-gray-400 text-xs">Track Artist</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-4">
            <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
              <BsSkipBackwardFill className="text-sm" />
            </button>
            <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
              <BsPlayFill className="text-xl" />
            </button>
            <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
              <BsSkipForwardFill className="text-sm" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 w-24">
            <BsVolumeUp className="text-yellow-500 text-xs" />
            <div className="flex-1 h-0.5 bg-gray-700/50 rounded-full">
              <div className="h-full w-1/2 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Player;
