import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GiSwordWound,
  GiMagicSwirl,
  GiRunningNinja,
  GiHealthPotion,
  GiHorseHead,
  GiOpenTreasureChest,
  GiHorseshoe,
  GiSkullCrossedBones,
  GiHypersonicBolt,
} from "react-icons/gi";

import { FaQuestion, FaPlus } from "react-icons/fa";

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        ref={ref}
        style={{
          width: size,
          height: size,
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-full bg-[#060606] border-yellow-800 border-2 shadow-md ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
      >
        {Children.map(children, (child) => cloneElement(child, { isHovered }))}
      </motion.div>
      <span className="text-yellow-500 text-[8px] mt-1">{label}</span>
    </div>
  );
}

function DockLabel({ children, className = "", ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-yellow-800 bg-[#060606] px-2 py-0.5 text-xs text-yellow-500`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center text-yellow-500 ${className}`}
    >
      {children}
    </div>
  );
}

export default function CombatDock({
  className = "",
  spring = { mass: 0.1, stiffness: 100, damping: 12 },
  magnification = 40,
  distance = 200,
  panelHeight = 70,
  dockHeight = 130,
  baseItemSize = 40,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  // Improved function to play sound effects
  const playSound = (soundFile, options = {}) => {
    // Stop any currently playing background music (handled in Player.jsx)
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio = null;
    }

    const { repeat = 1, volume = 0.35, delay = 0 } = options;

    // Function to play the sound once
    const playSingleSound = (index = 0) => {
      const audio = new Audio(soundFile);
      audio.volume = volume;

      // If this is not the last repeat, set up to play the next one
      if (index < repeat - 1) {
        audio.onended = () => {
          setTimeout(() => playSingleSound(index + 1), delay);
        };
      }

      audio.play();
    };

    // Start playing the sound (possibly multiple times)
    playSingleSound();
  };

  // Define combat items with their icons, labels, and sound effects
  const items = [
    {
      icon: <GiSwordWound size={24} />,
      label: "Attack",
      onClick: () => playSound("/sounds/CHMPKILL.mp3"),
      className: "hover:border-red-700 active:bg-red-900/20",
    },
    {
      icon: <GiHypersonicBolt size={24} />,
      label: "Bolt",
      onClick: () => playSound("/sounds/ZELTSHOT.mp3"),
      className: "hover:border-blue-700 active:bg-blue-900/20",
    },
    {
      icon: <GiMagicSwirl size={24} />,
      label: "Spell",
      onClick: () => playSound("/sounds/REGENER.mp3"),
      className: "hover:border-blue-700 active:bg-blue-900/20",
    },
    {
      icon: <GiHealthPotion size={24} />,
      label: "Buff",
      onClick: () => playSound("/sounds/BLOODLUS.mp3"),
      className: "hover:border-purple-700 active:bg-purple-900/20",
    },
    {
      icon: <FaQuestion size={24} />,
      label: "Quest",
      onClick: () => playSound("/sounds/CAVEHEAD.mp3"),
      className: "hover:border-yellow-700 active:bg-yellow-900/20",
    },
    {
      icon: <GiHorseHead size={24} />,
      label: "Horse",
      onClick: () => playSound("/sounds/HORSE05.mp3", { repeat: 3 }),
      className: "hover:border-brown-700 active:bg-orange-900/20",
    },
    {
      icon: <GiSkullCrossedBones size={24} />,
      label: "Death",
      onClick: () => playSound("/sounds/KILLFADE.mp3"),
      className: "hover:border-gray-700 active:bg-gray-900/20",
    },
    {
      icon: <FaPlus size={24} />,
      label: "Build",
      onClick: () => playSound("/sounds/BUILDTWN.mp3"),
      className: "hover:border-green-700 active:bg-green-900/20",
    },
    {
      icon: <GiOpenTreasureChest size={24} />,
      label: "Chest",
      onClick: () => playSound("/sounds/CHEST.mp3"),
      className: "hover:border-amber-700 active:bg-amber-900/20",
    },
    {
      icon: <GiHorseshoe size={24} />,
      label: "Level",
      onClick: () => playSound("/sounds/TREASURE.mp3"),
      className: "hover:border-yellow-400 active:bg-yellow-900/20",
    },
  ];

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} flex items-end w-fit gap-4 rounded-b-2xl border-yellow-800 border-2 border-t-0 pb-2 px-4 bg-gray-900/90 backdrop-blur-sm`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Combat sound effects"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
