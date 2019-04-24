import { GameScene } from "./game-scene";

// tslint:disable:typedef
/// <reference path="../phaser.d.ts" />

export class Player {

  public playerSprite: Phaser.GameObjects.Sprite;
  public speed: number;
  public lives = 3;
  public livesText: Phaser.GameObjects.Text;
  public inputs: Phaser.Input.Keyboard.CursorKeys;

  /**
   * @param  {Phaser.Scene} scene
   */
  constructor(private scene: GameScene, private playerNum: number) {

    this.livesText = this.scene.add.text(this.scene.sys.game.canvas.width - 100, playerNum * 20, `[${playerNum}] Lives: ${this.lives}`, { font: "18px Arial", fill: "#000" });
    // lifeLostText = this.scene.add.text(this.scene.world.width * 0.5, this.scene.world.height * 0.5, "Life lost, click to continue", { font: "18px Arial", fill: "#0095DD" });
    // lifeLostText.anchor.set(0.5);
    // lifeLostText.visible = false;

    this.speed = 3;
    if (playerNum === 1) {

      this.inputs = this.scene.input.keyboard.createCursorKeys();
    } else {
      this.inputs = this.scene.input.keyboard.addKeys(
        {
          up: Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        },
      );
    }
    const spriteName = `player-sprite-${playerNum}`;
    this.playerSprite = this.scene.physics.add.sprite(this.scene.sys.canvas.width / 2 + (25 * playerNum), this.scene.sys.canvas.height / 2, spriteName);
    this.playerSprite.setBounce(0.2);
    // this.playerSprite.checkWorldBounds = true;
    // this.playerSprite.events.onOutOfBounds.add(this.playerOut, this);
    // this.scene.physics.world.bounds.setTo(0, 700, 1024, 68);
    this.playerSprite.setCollideWorldBounds(true);
    const callback = (body, blockedUp, blockedDown, blockedLeft, blockedRight) => {

      console.info(body, blockedUp, blockedDown, blockedLeft, blockedRight);

    };
    this.scene.physics.world.on("worldbounds", callback);
    this.scene.physics.add.collider(this.playerSprite, this.scene.platforms);

    this.scene.anims.create({
      key: `left-${playerNum}`,
      frames: this.scene.anims.generateFrameNumbers(spriteName, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `turn-${playerNum}`,
      frames: [{ key: spriteName, frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: `right-${playerNum}`,
      frames: this.scene.anims.generateFrameNumbers(spriteName, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
  public init() {
    this.scene.players.forEach((player) => {
      if (player.playerNum !== this.playerNum) {
        this.scene.physics.add.collider(this.playerSprite, player.playerSprite);
      }
    });
  }

  public playerDead(p) {
    this.scene.playerDead(this);
    this.playerSprite.destroy(true);

  }
  public poopCollision(): any {
    this.lives--;
    this.livesText.setText(`[${this.playerNum}] Lives: ${this.lives}`);
    console.info(`lives : ${this.lives}!!`);
    if (this.lives <= 0) {
      this.playerDead(this);
    }
  }
  public move() {

    if (this.inputs.left.isDown) {
      this.playerSprite.setVelocityX(-160);
      this.playerSprite.play(`left-${this.playerNum}`, true);
      // this.playerSprite.x -= this.speed;
      // this.playerSprite.scaleX = -1;

    } else if (this.inputs.right.isDown) {
      this.playerSprite.setVelocityX(160);
      this.playerSprite.play(`right-${this.playerNum}`, true);
      // this.playerSprite.scaleX = 1;
    } else {
      this.playerSprite.setVelocityX(0);

      this.playerSprite.anims.play(`turn-${this.playerNum}`);
    }
    if (this.inputs.up.isDown && this.playerSprite.body.touching.down) {
      this.playerSprite.setVelocityY(-330);
    }
    if (this.inputs.down.isDown && !this.playerSprite.body.touching.down) {
      this.playerSprite.setVelocityY(400);
    }
    if (this.playerSprite.y >= (this.scene.sys.canvas.height - 30)) {
      this.lives = 0;
      this.livesText.setText(`[${this.playerNum}] Lives: ${this.lives}`);
      this.playerDead(this);
    }
  }

}
