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
  GiDeathSkull,
} from "react-icons/gi";
import combatSounds from "../data/combatSounds.json";

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
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
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 50,
  distance = 200,
  panelHeight = 60,
  dockHeight = 120,
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

  // Function to play sound effects
  const playSound = (soundId) => {
    const sound = combatSounds.find((s) => s.id === soundId);
    if (sound) {
      const audio = new Audio(sound.src);
      audio.volume = 0.7; // Set default volume
      audio.play();
    }
  };

  // Define combat items with their icons, labels, and sound effects
  const items = [
    {
      icon: <GiSwordWound size={24} />,
      label: "Attack",
      onClick: () => playSound("attack"),
      className: "hover:border-red-700 active:bg-red-900/20",
    },
    {
      icon: <GiMagicSwirl size={24} />,
      label: "Spell",
      onClick: () => playSound("spell"),
      className: "hover:border-blue-700 active:bg-blue-900/20",
    },
    {
      icon: <GiRunningNinja size={24} />,
      label: "Flee",
      onClick: () => playSound("flee"),
      className: "hover:border-green-700 active:bg-green-900/20",
    },
    {
      icon: <GiDeathSkull size={24} />,
      label: "Die",
      onClick: () => playSound("die"),
      className: "hover:border-purple-700 active:bg-purple-900/20",
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
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
