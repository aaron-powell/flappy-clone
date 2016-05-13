var game = new Phaser.Game(550, 393, Phaser.CANVAS, 'flappy-bird', {preload: preload, create: create, update: update});


var player, pipes, bg, clickTimer, ground, ground2, tap, title, pointer;
var goingUp = true;
var flappyDead = false;
var newGame = true;
var hovers = true;
var tilt;
var pipeSpawning = false;
var score = 0;
var scoreText;
var pipeCount = 0;
var highScore = 0;
var highScoreText;
var blackScreen;
var resetButton;



function preload() {
  game.load.image('background', 'assets/background.jpg');
  game.load.spritesheet('flappy', 'assets/flappy.png', 51.666, 36);
  game.load.image('pipe-down', 'assets/pipe_down.png');
  game.load.image('pipe-up', 'assets/pipe_up.png');
  game.load.image('ground', 'assets/ground.png');
  game.load.image('tap', 'assets/tap.jpg');
  game.load.image('title', 'assets/title.jpg');
  game.load.image('black', 'assets/black_screen.gif');
  game.load.image('reset_button', 'assets/restart_button.png');
  
}



function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  bg = game.add.tileSprite(0, 0, 700, 393, 'background');
  
  
  startScreen();
  
  spawnPlayer();
  
  spawnGround();
  
  pipeGroup();
  
  game.time.events.loop(1800,spawnPipes,true);
  
  game.input.onDown.add(flap, this);
  //game.input.onDown.add(reset, this);
  game.input.onDown.add(startGame, this);
  
}


function pipeGroup() {
  pipes = game.add.group();
  pipes.enableBody = true;
  pipes.physicsBodyType = Phaser.Physics.ARCADE;
}

function spawnGround() {
  ground = game.add.sprite(0, 336, 'ground');
  game.physics.enable(ground, Phaser.Physics.ARCADE);
  ground.enableBody = true;
  ground.body.immovable = true;
  ground2 = game.add.sprite(700, 336, 'ground');
  game.physics.enable(ground2, Phaser.Physics.ARCADE);
  ground2.enableBody = true;
  ground2.body.immovable = true;
}


function spawnPipes () {
  var pipe_up, pipe_down;
  if (pipeSpawning === true) {
    setTimeout(function() {pipeCount ++;}, 300);
    if (Math.floor((Math.random()*12)+1) < 3) {
      pipe_up = pipes.create(700,250,'pipe-up');
      pipe_down = pipes.create(700,-200,'pipe-down');
      pipe_up.body.velocity.x = -120;
      pipe_down.body.velocity.x = -120;
      pipe_up.body.immovable = true;
      pipe_down.body.immovable = true;
    } else if (Math.floor((Math.random()*12)+1) < 5) {
      pipe_up = pipes.create(700,300,'pipe-up');
      pipe_down = pipes.create(700,-150,'pipe-down');
      pipe_up.body.velocity.x = -120;
      pipe_down.body.velocity.x = -120;
      pipe_up.body.immovable = true;
      pipe_down.body.immovable = true;
    } else if (Math.floor((Math.random()*12)+1) < 7) {
      pipe_up = pipes.create(700,200,'pipe-up');
      pipe_down = pipes.create(700,-250,'pipe-down');
      pipe_up.body.velocity.x = -120;
      pipe_down.body.velocity.x = -120;
      pipe_up.body.immovable = true;
      pipe_down.body.immovable = true;
   } else if (Math.floor((Math.random()*12)+1) < 9) {
      pipe_up = pipes.create(700,150,'pipe-up');
      pipe_down = pipes.create(700,-300,'pipe-down');
      pipe_up.body.velocity.x = -120;
      pipe_down.body.velocity.x = -120;
      pipe_up.body.immovable = true;
      pipe_down.body.immovable = true;
    } else if (Math.floor((Math.random()*12)+1) < 11) {
      pipe_up = pipes.create(700,100,'pipe-up');
      pipe_down = pipes.create(700,-350,'pipe-down');
      pipe_up.body.velocity.x = -120;
      pipe_down.body.velocity.x = -120;
      pipe_up.body.immovable = true;
      pipe_down.body.immovable = true;
    } else {
      pipe_up = pipes.create(700,350,'pipe-up');
      pipe_down = pipes.create(700,-100,'pipe-down');
      pipe_up.body.velocity.x = -120;
      pipe_down.body.velocity.x = -120;
      pipe_up.body.immovable = true;
      pipe_down.body.immovable = true;
    }
  }
}

function startScreen() {
  title = game.add.sprite(102, -15, 'title');
  tap = game.add.sprite (123, 150, 'tap');
}


function spawnPlayer() {
  player = game.add.sprite(250, 100, 'flappy');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.setTo(0.5,0.5);
  player.body.fixedRotation = true;
  player.animations.add('fly', [0,1,2], 13, true);
  player.frame = 1;
  player.body.collideWorldBounds = true;
  
}

function startGame() {
  if (newGame === true) {
    player.body.gravity.y = 825;
    newGame = false;
    hovers = false;
    pipeSpawning = true;
    tap.destroy();
    title.destroy();
    scoreText = game.add.text(270,10, score.toString(), {font: "48px Coda", fill: "#FFFFFF", stroke: "black", strokeThickness: 7});
    highScoreText = game.add.text(5,5, " ", {font: "24px Coda", fill: "#FFFFFF", stroke: "black", strokeThickness: 5});
  }
}

function reset() {
  if (flappyDead === true && newGame === false) {
    game.world.remove(resetButton);
    flappyDead = false;
    hovers = true;
    if (score > highScore) {
      highScore = score;
    }
    highScoreText.destroy();
    highScoreText = game.add.text(5,5, "High Score:  " + highScore.toString(), {font: "24px Coda", fill: "#FFFFFF", stroke: "black", strokeThickness: 5});
    score = 0;
    pipeCount = 0;
    scoreText.destroy();
    player.destroy();
    game.world.remove(pipes);
    pipeGroup();
    spawnPlayer();
    player.body.gravity.y = 0;
  }
}

function updateText() {
  score = pipeCount - 2;
  if (score < 0) {
    score = 0;
  }
  scoreText.destroy();
  scoreText = game.add.text(270,10, score.toString(), {font: "48px Coda", fill: "#FFFFFF", stroke: "black", strokeThickness: 7});
}


function flappyHovers() {
  if (hovers === true) {
    if (player.body.y >= 90 && goingUp === true) {
      game.physics.arcade.moveToXY(player, 250, 90, 40);
      goingUp = false;
    } else if (player.body.y <= 90) {
      game.physics.arcade.moveToXY(player, 250, 110, 40);
    }
    if (player.body.y >= 110) {
      goingUp = true;
    }
  }
}

function groundScrolling() {
  ground.body.velocity.x = -120;
  ground2.body.velocity.x = -120
  if (ground.body.x <= -700) {
    ground.body.position.x = 0;
    ground.body.velocity.x = -120;
  }
  if (ground2.body.x <= 0) {
    ground2.body.position.x = 700;
    ground2.body.velocity.x = -120;
  }
}


function flap() {
  if (flappyDead === false) {
    hovers = false;
    pipeSpawning = true;
    player.body.gravity.y = 825;
    clickTimer = game.time.now + 600;
    player.body.velocity.y = -275;
    game.add.tween(player).to({angle: -20}, 40).start();
    player.animations.play('fly');
  }
}

function flappyDies() {
  if (flappyDead === false) {
    flappyDead = true;
    pipeSpawning = false;
    //player.body.velocity.x = 0;
    pipes.setAll('body.velocity.x', 0);
    flashBlack();
    resetButton = game.add.button(185, 150, 'reset_button', reset, this);
  }
}

function flashBlack() {
  blackScreen = game.add.sprite(0,0,'black');
  setTimeout(function() {game.world.remove(blackScreen);},25);
  setTimeout(function() {blackScreen = game.add.sprite(0,0,'black');}, 50);
  setTimeout(function() {game.world.remove(blackScreen);},75);
}


function update () {
  game.physics.arcade.collide(player, ground, flappyDies, null, this);
  game.physics.arcade.collide(player, ground2, flappyDies, null, this);
  game.physics.arcade.collide(player, pipes, flappyDies, null, this);
  if (flappyDead === false) {
    groundScrolling();
  } else {
    ground.body.velocity.x = 0;
    ground2.body.velocity.x = 0;
  }
  game.world.bringToTop(ground);
  game.world.bringToTop(ground2);
  flappyHovers();
  if (player.angle < 90 && clickTimer < game.time.now && hovers === false) {
    player.angle += 4;
  }
  if (hovers === false) {
    updateText();
    game.world.bringToTop(highScoreText);
  }
}