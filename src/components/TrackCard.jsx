import { BsPlayFill } from "react-icons/bs";

function TrackCard({ title, artist }) {
  return (
    <div className="flex flex-col bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-colors cursor-pointer group">
      <div className="aspect-square bg-gray-900/50 relative">
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-yellow-500/80 flex items-center justify-center">
            <BsPlayFill className="text-gray-900 text-xl ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-2 flex flex-col min-h-[3rem]">
        <h3 className="text-yellow-500 font-cinzel font-medium text-xs truncate">
          {title}
        </h3>
        <p className="text-gray-400 text-xs mt-0.5 truncate">{artist}</p>
      </div>
    </div>
  );
}

export default TrackCard;
