const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const background = "imgs/background.png";
const hills = "imgs/hills.png";
const playerIdleright = "imgs/idleright.png";
const playerIdleleft = "imgs/idleleft.png";
const runRight = "imgs/run-right.png";
const runLeft = "imgs/run-left.png";
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
const platformSmallTall = createImage("imgs/platformSmallTall.png");
const platformImage = createImage("imgs/platform.png");
let scrollOffset = 0;
let onGround;
console.log(platformImage);
class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.height = this.image.height;
    this.width = this.image.width;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 60;
    this.height = 160;
    this.image = createImage(playerIdleright);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(playerIdleright),
        left: createImage(playerIdleleft),
        cropWidth: 310,
        width: this.width,
      },
      run: {
        right: createImage(runRight),
        left: createImage(runLeft),
        cropWidth: 360,
        width: 70,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 300;
  }
  draw() {
    c.drawImage(
      this.currentSprite,
      614 * this.frames,
      0,
      this.currentCropWidth,
      500,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.frames++;
    if (this.frames > 15) this.frames = 0;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    console.log(this.velocity.y);
  }
}
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.height = this.image.height;
    this.width = this.image.width;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
let platforms = [
  new Platform({ x: 1900, y: 300, image: platformSmallTall }),
  new Platform({ x: -6, y: 480, image: platformImage }),
  new Platform({ x: 800, y: 480, image: platformImage }),
  new Platform({ x: 1600, y: 480, image: platformImage }),
  new Platform({ x: 2600, y: 480, image: platformImage }),
  new Platform({ x: 3300, y: 400, image: platformSmallTall }),
];
let player = new Player();
let genericObjects = [
  new GenericObject({ x: -4, y: -1, image: createImage(background) }),
  new GenericObject({ x: -1, y: -1, image: createImage(hills) }),
];
const gravity = 0.5;
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
let lastKey;

// reset game stats
function init() {
  player = new Player();
  platforms = [
    new Platform({ x: 1900, y: 300, image: platformSmallTall }),
    new Platform({ x: -6, y: 480, image: platformImage }),
    new Platform({ x: 800, y: 480, image: platformImage }),
    new Platform({ x: 1600, y: 480, image: platformImage }),
    new Platform({ x: 2600, y: 480, image: platformImage }),
    new Platform({ x: 3300, y: 400, image: platformSmallTall }),
  ];
  genericObjects = [
    new GenericObject({ x: -4, y: -1, image: createImage(background) }),
    new GenericObject({ x: -1, y: -1, image: createImage(hills) }),
  ];
  scrollOffset = 0;
}
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();
  // animation switch
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.right.pressed &&
    !keys.left.pressed &&
    lastKey === "right" &&
    player.currentSprite == player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite == player.sprites.run.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }
  // player movements and background scroll
  if (keys.right.pressed && player.position.x <= 400) {
    player.velocity.x = 5;
  } else if (
    (keys.left.pressed && player.position.x > 400) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed && scrollOffset <= 5000) {
      scrollOffset += 5;
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= 2;
      });
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= 5;
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += 2;
      });
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
    if (scrollOffset >= 3000) {
      // win condition
      console.log("you win");
    }
    // lose condition
    if (player.position.y >= canvas.height) {
      init();
    }
  }

  // platfrome collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      onGround = true;
    }
  });
}
animate();

// cheking for keyboard press
addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 87:
      platforms.forEach((platform) => {
        if (player.velocity.y == 0 && onGround) {
          player.velocity.y = -17;
          onGround = false;
          console.log("up");
        }
      });
      break;
    case 68:
      lastKey = "right";
      keys.right.pressed = true;
      break;
    case 65:
      lastKey = "left";
      keys.left.pressed = true;
      break;
  }
});
// cheking for keyboard release
addEventListener("keyup", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 87:
      break;
    case 68:
      keys.right.pressed = false;
      break;
    case 65:
      keys.left.pressed = false;
      break;
  }
});
