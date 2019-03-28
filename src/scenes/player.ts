import { GameScene } from "./game-scene";

// tslint:disable:typedef
/// <reference path="../phaser.d.ts" />

export class Player {

  public playerSprite: Phaser.GameObjects.Sprite;
  public speed: number;
  public lives = 3;
  public livesText: Phaser.GameObjects.Text;

  /**
   * @param  {Phaser.Scene} scene
   */
  constructor(private scene: GameScene) {

    this.livesText = this.scene.add.text(this.scene.sys.game.canvas.width - 100, 10, "Lives: " + this.lives, { font: "18px Arial", fill: "#000" });
    // lifeLostText = this.scene.add.text(this.scene.world.width * 0.5, this.scene.world.height * 0.5, "Life lost, click to continue", { font: "18px Arial", fill: "#0095DD" });
    // lifeLostText.anchor.set(0.5);
    // lifeLostText.visible = false;

    this.speed = 3;

    this.playerSprite = this.scene.physics.add.sprite(this.scene.sys.canvas.width / 2, this.scene.sys.canvas.height / 2, "player-sprite");
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
      key: "left",
      frames: this.scene.anims.generateFrameNumbers("player-sprite", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: "player-sprite", frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers("player-sprite", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
  public playerDead(p) {
    this.scene.scene.restart();

  }
  public poopCollision(): any {
    this.lives--;
    this.livesText.setText("Lives: " + this.lives);
    console.info(`lives : ${this.lives}!!`);
    if (this.lives <= 0) {
      this.playerDead(this);
    }
  }
  public move() {
    const cursors = this.scene.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.playerSprite.setVelocityX(-160);
      this.playerSprite.play("left", true);
      // this.playerSprite.x -= this.speed;
      // this.playerSprite.scaleX = -1;

    } else if (cursors.right.isDown) {
      this.playerSprite.setVelocityX(160);
      this.playerSprite.play("right", true);
      // this.playerSprite.scaleX = 1;
    } else {
      this.playerSprite.setVelocityX(0);

      this.playerSprite.anims.play("turn");
    }
    if (cursors.up.isDown && this.playerSprite.body.touching.down) {
      this.playerSprite.setVelocityY(-330);
    }
    if (cursors.down.isDown && !this.playerSprite.body.touching.down) {
      this.playerSprite.setVelocityY(400);
    }
    if (this.playerSprite.y >= (this.scene.sys.canvas.height - 30)) {
      this.playerDead(this);
    }
  }

}
