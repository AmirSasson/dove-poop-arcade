import { Dove } from "./dove";
import { Player } from "./player";

export class GameScene extends Phaser.Scene {
  public player: Player;
  public cursors: any;
  public platforms: Phaser.Physics.Arcade.StaticGroup;

  public doves: Dove[];

  constructor() {
    super({
      key: "TestScene",
    });
  }

  public preload(): void {
    this.load.image("sky", "/assets/images/sky.png");
    // this.load.tilemapTiledJSON("map", "/assets/tilemaps/desert.json");
    // this.load.image("Desert", "/assets/tilemaps/tmw_desert_spacing.png");
    // this.load.image("player", "/assets/sprites/mushroom.png");
    this.load.image("poop", "/assets/images/small-poop.png");
    this.load.spritesheet("dove-sprite", "/assets/sprites/dove.png", { frameHeight: 288, frameWidth: 314 });
    this.load.image("ground", "/assets/images/platform.png");
    this.load.spritesheet("player-sprite", "/assets/sprites/player.png", { frameWidth: 32, frameHeight: 48 });

  }

  public create(): void {
    // const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: "map" });
    // const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage("Desert");
    // const layer: Phaser.Tilemaps.StaticTilemapLayer = map.createStaticLayer(0, tileset, 0, 0);
    this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "sky").setScale(1.5, 1.5);
    // this.player = this.add.sprite(100, 100, "player");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(0, this.sys.canvas.height, "ground").setScale(2).refreshBody();
    this.platforms.create(550, this.sys.canvas.height, "ground").setScale(2).refreshBody();
    this.platforms.create(1100, this.sys.canvas.height, "ground").setScale(2).refreshBody();
    // this.platforms.create(600, 400, "ground");
    // this.platforms.create(50, 250, "ground");

    this.doves = [];
    this.player = new Player(this);
    this.doves.push(new Dove(this, 4, 5));
    this.doves.push(new Dove(this, 3, 1));
    this.doves.push(new Dove(this, 5, 2));

    this.cameras.main.setBounds(0, 0, 400, this.sys.canvas.height);
    this.cameras.main.startFollow(this.player.playerSprite, false);
  }

  public update(time: number, delta: number): void {
    // this.player.angle += 1;
    // if (this.cursors.left.isDown) {
    // 	this.player.x -= 5;
    // }
    // if (this.cursors.right.isDown) {
    // 	this.player.x += 5;
    // }
    // if (this.cursors.down.isDown) {
    // 	this.player.y += 5;
    // }
    // if (this.cursors.up.isDown) {
    // 	this.player.y -= 5;
    // }
    this.player.move();
    this.doves.forEach((dove) => {
      dove.update();

    });
  }
}
