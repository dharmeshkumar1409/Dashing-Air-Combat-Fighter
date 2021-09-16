var spaceShip, spaceShipImg;
var enemy1, enemy2, enemy3, enemy4;
var enemy1Img, enemy2Img, enemy3Img, enemy4Img;
var life, life2, life3;
var lifeImg, lostLifeImg, fire, fireImg;
var bgImg;
var fire, fireImg;
var lifes, lLifes;
var lifeScore;
INTRO = 0;
PLAY = 1;
END = 2;
var gameState = INTRO;
var start, startImg;
var restart, go, restartImg, goImg;
var score = 0;
var devel, develImg;
var bgSound;


// Function Preload


function preload() {
    spaceShipImg = loadImage( "player1.png" );

    enemy1Img = loadImage( "enemy1.png" );
    enemy2Img = loadImage( "enemy2.png" );
    enemy3Img = loadImage( "enemy3.png" );
    enemy4Img = loadImage( "enemy4.png" );

    lifeImg = loadAnimation( "life1.png" );
    lostLifeImg = loadAnimation( "life4.png" );

    bgImg = loadImage( "background.jpg" );

    fireImg = loadImage( "fire.png" );
    startImg = loadImage( "start.png" );

    goImg = loadImage( "gameOver.png" );
    restartImg = loadImage( "restart.png" );

    develImg = loadImage( "devel.png" );

}


// Function Setup


function setup() {
    createCanvas( 700, 500 );

    // Createing Spaceships

    spaceShip = createSprite( 300, 420, 50, 50 );
    spaceShip.addImage( spaceShipImg );
    spaceShip.scale = 2;

    // Creatings groups

    enemies = new Group();
    fires = new Group();
    blasts = new Group();

    // Creating edge sprites

    edges = createEdgeSprites( 0, 1 );

    // Creating start button

    start = createSprite( 350, 410, 30, 30 );
    start.addImage( startImg );

    // Creating lifes
    // Life 1

    lifeScore = 3;
    life = createSprite( 560, 20, 50, 50 );
    life.addAnimation( "rlife", lifeImg );
    life.addAnimation( "lLife", lostLifeImg );
    life.scale = 0.1;

    life2 = createSprite( 610, 20, 50, 50 );
    life2.addAnimation( "rlife", lifeImg );
    life2.addAnimation( "lLife", lostLifeImg );
    life2.scale = 0.1;

    life3 = createSprite( 660, 20, 50, 50 );
    life3.addAnimation( "rlife", lifeImg );
    life3.addAnimation( "lLife", lostLifeImg );
    life3.scale = 0.1;

    go = createSprite( 350, 150 );
    go.addImage( goImg );
    go.scale = 2;

    restart = createSprite( 350, 420 );
    restart.addImage( restartImg );
    restart.scale = 0.5;

    go.visible = false;
    restart.visible = false;

    devel = createSprite( 350, 480 );
    devel.addImage( develImg );
    devel.scale = 0.25;
    devel.visible = false;
}


// Function Draw


function draw() {

    // Creating gameState INTRO(The page in which stories are written)

    if ( gameState == INTRO ) {

        background( "blue" );

        // Adding Story to page

        fill( "black" );
        textSize( 30 );
        text( 'From the galaxy Tofu, some aliens are trying to \n        invade the Earth using spaceships.\nDynamite is assigned to save the planet and\n         it will be getting 3 chances to do it.\n\n\n          Press start button to start the game', 30, 100 );

        // Removing the unwanted Sprites from INTRO gameState

        life.visible = false;
        life2.visible = false;
        life3.visible = false;
        start.visible = true;
        spaceShip.visible = false;
        devel.visible = true;
    }

    // To start the game when start button is pressed

    if ( mousePressedOver( start ) && gameState == INTRO ) {
        start.destroy();
        gameState = PLAY;
    }

    // Creating gameState PLAY(The page in which the user will be playing the game)

    if ( gameState == PLAY ) {
        background( bgImg );

        if ( score % 50 == 0 ) {
            fires.scale = 0.3;
        } else {
            fires.scale = 0.2;
        }

        // to make sprites visible or make them not visible on the screen
        life.visible = true;
        life2.visible = true;
        life3.visible = true;
        go.visible = false;
        restart.visible = false;
        spaceShip.visible = true;

        {
            fill( "white" );
            textSize( 30 );
            text( "Score: " + score, 380, 30 );
        }

        spaceShip.bounceOff( edges );


        if ( keyWentDown( 32 ) || keyWentDown( 32 ) && keyWentDown( LEFT_ARROW ) || keyWentDown( 32 ) && keyWentDown( RIGHT_ARROW ) ) {
            spawnFire();
        }

        if ( keyDown( LEFT_ARROW ) ) {
            spaceShip.x -= 5;
        }

        if ( keyDown( RIGHT_ARROW ) ) {
            spaceShip.x += 5;
        }

        // console.log(lifeScore);


        if ( enemies.isTouching( fires ) ) {
            enemies[ 0 ].destroy();
            fires.destroyEach();
            score += 10;
        }

        if ( enemies.isTouching( spaceShip ) ) {
            enemies[ 0 ].destroy();
            lifeScore -= 1;

            if ( lifeScore == 2 ) {
                life.changeAnimation( "lLife" );
            }
            if ( lifeScore == 1 ) {
                life2.changeAnimation( "lLife" );
            }
            if ( lifeScore == 0 ) {
                life3.changeAnimation( "lLife" );
                gameState = END;
            }
        }

        if ( lifeScore === 0 ) {
            gameState = END;
        }

        // drawSprites();
        spawnEnemies();
    }

    if ( gameState === END ) {
        background( "black" );

        spaceShip.visible = false;
        enemies.destroyEach();
        fires.destroyEach();
        life.visible = false;
        life2.visible = false;
        life3.visible = false;
        start.visible = false;
        go.visible = true;
        restart.visible = true;

        life.changeAnimation( "rlife" );
        life2.changeAnimation( "rlife" );
        life3.changeAnimation( "rlife" );

    }

    if ( mousePressedOver( restart ) && gameState === END ) {
        lifeScore = 3;
        score = 0;
        gameState = PLAY;

    }

    drawSprites();

    if ( gameState === END ) {
        fill( "white" );
        textSize( 40 );
        text( "Your Score : " + score, 220, 350 );
    }

}

// Enemies

function enemies1() {
    if ( frameCount % 90 === 0 && gameState == PLAY ) {
        enemy1 = createSprite( Math.round( random( 10, 590 ) ), 0, 50, 50 );
        enemy1.addImage( enemy1Img );
        enemy1.velocityY = 3.5;
        enemy1.scale = 1.8;
        enemy1.lifetime = 130;
        enemies.add( enemy1 );
        // enemies.setLifeTimeEach = 10;
    }
}

function enemies2() {
    if ( frameCount % 90 === 0 && gameState == PLAY ) {
        enemy2 = createSprite( Math.round( random( 10, 590 ) ), 0 /*Math.round(random(0, 100))*/ , 50, 50 );
        enemy2.addImage( enemy2Img );
        if ( enemy2.x <= 400 ) {
            enemy2.velocityX = 2;
            enemy2.velocityY = 3;
        } else {
            enemy2.velocityX = -2;
            enemy2.velocityY = 3;
        }
        enemy2.scale = 1.8;
        enemy2.lifetime = 140;
        enemies.add( enemy2 );
    }
}

function enemies3() {
    if ( frameCount % 90 === 0 && gameState == PLAY ) {
        enemy3 = createSprite( Math.round( random( 10, 590 ) ), 0, 50, 50 );
        enemy3.addImage( enemy3Img );
        enemy3.velocityY = 3;
        enemy3.scale = 1.8;
        enemy3.lifetime = 130;
        enemies.add( enemy3 );
    }
}

function enemies4() {
    if ( frameCount % 90 === 0 && gameState == PLAY ) {
        enemy4 = createSprite( Math.round( random( 10, 590 ) ), 0, 50, 50 );
        enemy4.addImage( enemy4Img );
        if ( enemy4.x <= 400 ) {
            enemy4.velocityX = 3;
            enemy4.velocityY = 3;
        } else {
            enemy4.velocityX = -3;
            enemy4.velocityY = 3;
        }
        enemy4.scale = 1.8;
        enemy4.lifetime = 140;
        enemies.add( enemy4 );
    }
}

// Spawning enemies

function spawnEnemies() {
    r = Math.round( random( 1, 4 ) );
    if ( r == 1 ) {
        enemies1();
    } else if ( r == 2 ) {
        enemies2();
    } else if ( r == 3 ) {
        enemies3();
    } else if ( r == 4 ) {
        enemies4();
    }
}


// Fires

function spawnFire() {

    fire = createSprite( spaceShip.x, spaceShip.y );
    fire.addImage( fireImg );
    fire.velocityY = -3;
    fire.scale = 0.25;
    fire.lifetime = 150;
    spaceShip.depth += fire.depth;
    fires.add( fire );

}