import { BsPlayFill } from "react-icons/bs";

function TrackCard({ title, tag, duration, picture }) {
  // Use default image if picture is empty
  const imageSrc = picture ? `/images/${picture}` : "/images/homm3.jpg";

  return (
    <div className="flex flex-col bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-colors cursor-pointer group">
      <div className="aspect-square bg-gray-900/50 relative">
        {/* Album art */}
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-8 h-8 rounded-full bg-yellow-500/80 flex items-center justify-center">
            <BsPlayFill className="text-gray-900 text-xl ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-2 flex flex-col min-h-[3rem]">
        <h3 className="text-yellow-500 font-cinzel font-medium text-xs truncate">
          {title}
        </h3>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-gray-400 text-xs uppercase bg-gray-700/50 px-1.5 py-0.5 rounded-sm">
            {tag}
          </span>
          <span className="text-gray-400 text-xs">{duration}</span>
        </div>
      </div>
    </div>
  );
}

export default TrackCard;
