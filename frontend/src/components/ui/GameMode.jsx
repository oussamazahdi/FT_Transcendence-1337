const GAME_WIDTH = 1024;
const GAME_HEIGHT = 700;

const GAME_MODE = {
  desert: {
    label: "DESERT",
    image: "/GameMaps/desert.png",
    ball: "#F5E6C8",
    paddle: "#D4A373",
  },

  hell: {
    label: "HELL",
    image: "/maps/hell.png",
    ball: "#FFD6D6",
    paddle: "#8B0000",
  },

  ocean: {
    label: "OCÉAN",
    image: "/maps/water.png",
    ball: "#E0F7FF",
    paddle: "#0077B6",
  },

  forest: {
    label: "FOREST",
    image: "/GameMaps/forest.png",
    ball: "#E9F5DB",
    paddle: "#2D6A4F",
  },

  snow: {
    label: "SNOW",
    image: "/GameMaps/snow.png",
    ball: "#FFFFFF",
    paddle: "#CAF0F8",
  },

  space: {
    label: "SPACE",
    image: "/GameMaps/space.png",
    ball: "#F8F9FA",
    paddle: "#5A189A",
  },
};

const MAPS = [
  { id: "desert", label: "DESERT", image: "/GameMaps/desert.png" },
  { id: "hell", label: "HELL", image: "/GameMaps/hell.png" },
  { id: "ocean", label: "OCÉAN", image: "/GameMaps/water.png" },
  { id: "forest", label: "FOREST", image: "/GameMaps/forest.jpeg" },
  { id: "snow", label: "SNOW", image: "/GameMaps/snow.jpeg" },
  { id: "space", label: "SPACE", image: "/GameMaps/space.png" },
];

export {GAME_MODE, MAPS, GAME_WIDTH, GAME_HEIGHT}