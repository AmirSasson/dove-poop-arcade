
// tslint:disable:typedef
/// <reference path="../phaser.d.ts" />
/// <reference path="./game-scene.ts" />

export class Dove {

  public doveSprite: Phaser.GameObjects.Sprite;
  public poopReady = true;
  public lastPoopTime = new Date().getTime();
  public initialScale: number;
  public initialSize: number;

  /**
   * @param  {Phaser.Scene} scene
   * @param  {number} speed number from 1-10 1 is fastest, 10 is slowest
   * @param  {number} aggressiveLevel number from 1-10 1 is super aggresive, 10 is not aggresive at all
   */
  constructor(private scene: GameScene, private speed: number, private aggressiveLevel: number) {

    this.initialSize = Phaser.Math.RND.pick([1, 0.9, 0.7, 0.5]);

    const initialX = Phaser.Math.RND.pick([
      { x: 0, scale: 1, destination: this.scene.sys.canvas.width },
      { x: this.scene.sys.canvas.width, scale: -1, destination: 0 }]);
    this.doveSprite = scene.add.sprite(initialX.x, 100, "dove-sprite");
    this.initialScale = initialX.scale * this.initialSize;
    this.doveSprite.scaleX = this.initialScale;
    this.doveSprite.scaleY = this.initialSize;

    const frames: any = scene.anims.generateFrameNames("dove-sprite", { frames: true, start: 0, end: 5 });
    const config: Phaser.Animations.Types.Animation = {
      key: "fly",
      frames,
      defaultTextureKey: null,
      // time
      delay: 0,
      frameRate: 8,
      duration: null,
      skipMissedFrames: true,
      // repeat
      repeat: -1,              // set to (-1) to repeat forever
      repeatDelay: 0,
      yoyo: false,

      // visible
      showOnStart: false,
      hideOnComplete: false,
    };
    scene.anims.create(config);

    this.doveSprite.play("fly", true);
    const tween = this.scene.tweens.add({
      targets: this.doveSprite,
      x: initialX.destination,
      y: this.doveSprite.y,
      ease: "Linear",       // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear'
      duration: speed * 1000,
      delay: 30,
      repeat: -1,            // -1: infinity
      yoyo: true,
      onYoyoParams: [],
      flipX: true,
      onYoyo: (sp, tw, b) => {
        if (tw.x === initialX.destination) {
          tw.scaleX = this.initialScale * -1;
        }
      },
      onRepeat: (sp, tw, b) => {
        tw.scaleX = this.initialScale;
      },
    });

    this.doveSprite.play("0", true, 0);

  }

  public update() {
    const diff = new Date().getTime() - this.lastPoopTime;
    const shouldPoop = Phaser.Math.RND.between(1, 1000) > 990 && diff > (this.aggressiveLevel * 1000);
    const that = this;
    if (shouldPoop) {
      this.poopReady = false;
      this.lastPoopTime = new Date().getTime();

      const poopImage = this.scene.physics.add.image(this.doveSprite.x, this.doveSprite.y, "poop");

      const poopGroundCollider = this.scene.physics.add.collider(
        poopImage,
        this.scene.platforms,
        () => {
          setTimeout(() => {
            if (poopGroundCollider.active) { poopGroundCollider.destroy(); }
            poopImage.destroy(true);
          }, 5000);
        });

      this.scene.players.forEach((player) => {
        const playerGroundCollider = this.scene.physics.add.collider(
          poopImage,
          player.playerSprite,
          () => {
            if (playerGroundCollider.active) { playerGroundCollider.destroy(); }
            poopImage.destroy(true);
            player.poopCollision();
          });
      });

      poopImage.scaleX = 0.5 * this.initialSize;
      poopImage.scaleY = 0.5 * this.initialSize;
    }
  }

}
