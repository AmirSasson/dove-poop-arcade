import "phaser";

import { GameScene } from "./scenes/game-scene";

const config: GameConfig = {
  type: Phaser.AUTO,
  parent: "content",
  width: 1024,
  height: 768,
  resolution: 1,
  backgroundColor: "#EDEEC9",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [
    GameScene,
  ],
};

const game = new Phaser.Game(config);
