const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Render = Matter.Render;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Composites = Matter.Composites;

var engine, world;
var scene, cutBtn, melon, melonImg, rope, ground, rabbit, connect;
var blinkAnimation, eatAnimation, sadAnimation;
var BM, RC, SS, ES;

function preload() {
  scene = loadImage("assets/background.png");
  melonImg = loadImage("assets/melon.png");

  blinkAnimation = loadAnimation("assets/blink_1.png", "assets/blink_2.png", "assets/blink_3.png");
  eatAnimation = loadAnimation("assets/eat_0.png", "assets/eat_1.png", "assets/eat_2.png", "assets/eat_3.png", "assets/eat_4.png");
  sadAnimation = loadAnimation("assets/sad_1.png", "assets/sad_2.png", "assets/sad_3.png");

  blinkAnimation.playing = true;
  eatAnimation.playing = true;
  sadAnimation.playing = true;

  eatAnimation.looping = false;
  sadAnimation.looping = false;

  BM = loadSound("assets/sound1.mp3");
  RC = loadSound("assets/rope_cut.mp3");
  SS = loadSound("assets/sad.mp3");
  ES = loadSound("assets/eating_sound.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  BM.play();
  BM.setVolume(0.2);

  ground = new Ground(width/2, height, width, 10);

  rope = new Rope(8, {
    x: width/2,
    y: 10
  });

  melon = Bodies.circle(width/2 , 10, 20);
  Composite.add(rope.body, melon);

  connect = new Link(rope, melon);

  blinkAnimation.frameDelay = 10;
  eatAnimation.frameDelay = 10;
  sadAnimation.frameDelay = 10;

  rabbit = createSprite(width /2, height - 150, 50, 50);
  rabbit.addAnimation("blink", blinkAnimation);
  rabbit.addAnimation("eat", eatAnimation);
  rabbit.addAnimation("sad", sadAnimation);
  rabbit.changeAnimation("blink");
  rabbit.scale = 0.4;

  cutBtn = createImg("assets/cut_btn.png");
  cutBtn.position(width/ 2 -100, 1);
  cutBtn.size(200, 100);
  cutBtn.mouseClicked(drop);

  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() {
  background(scene);
  Engine.update(engine);

  push();
  imageMode(CENTER);
  if (melon != null) {
    image(melonImg, melon.position.x, melon.position.y, 100,100);
  }
  pop();

  if (collide(melon, rabbit) == true) {
    rabbit.changeAnimation("eat");
    ES.play();
  }

  if (melon != null && melon.position.y >= 650) {
    rabbit.changeAnimation("sad");
    SS.play();
    melon = null;
  }

  rope.show();
  drawSprites();
}

function drop() {
  connect.cut();
  RC.play();
  rope.break();
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);

    if (d <= windowHeight - 770) {
      World.remove(world, melon);
      melon = null;
      return true
    } else {
      return false
    }
  }
}