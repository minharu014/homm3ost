import { useState } from "react";

function TrackCard({ title, tag, duration, picture, src, onSelect }) {
  // Use default image if picture is empty
  const imageSrc = picture ? `/images/${picture}` : "/images/homm3def.jpg";

  return (
    <div
      onClick={() => onSelect({ title, tag, duration, picture, src })}
      className="flex flex-col bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-colors cursor-pointer group"
    >
      <div className="relative">
        <img src={picture} alt={title} className="w-full h-24 object-cover" />
      </div>
      <div className="p-2 flex flex-col min-h-[3rem]">
        <h3 className="text-yellow-500 font-cinzel font-medium text-sm truncate">
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
