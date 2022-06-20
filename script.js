const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.5;
const platform = "imgs/platform.png";
const background = "imgs/background.png";
const hills = "imgs/hills.png";
const playerIdle = "imgs/spr_m_traveler_idle_anim.gif";
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
console.log(createImage(playerIdle));
const platformImage = createImage(platform);
let scrollOffset = 0;
console.log(platformImage);
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
    this.height = 60;
    this.image = createImage(playerIdle);
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}
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
const player = new Player();
const platforms = [
  new Platform({ x: -6, y: 480, image: platformImage }),
  new Platform({ x: 800, y: 480, image: platformImage }),
  new Platform({ x: 1600, y: 480, image: platformImage }),
];
const genericObjects = [
  new GenericObject({ x: -4, y: -1, image: createImage(background) }),
  new GenericObject({ x: -1, y: -1, image: createImage(hills) }),
];
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
player.draw();

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

  // player movements and background scroll
  if (keys.right.pressed && player.position.x <= 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x >= 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed && scrollOffset <= 2500) {
      scrollOffset += 5;
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= 2;
      });
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed && scrollOffset >= 0) {
      scrollOffset -= 5;
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += 2;
      });
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
    // win condition
    if (scrollOffset >= 2500) {
      console.log("you win");
    }
    // lose condition
    if (player.position.y > canvas.height) {
      location.reload();
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
        if (player.velocity.y == 0) {
          player.velocity.y = -20;
          console.log("up");
        }
      });
      break;
    case 68:
      keys.right.pressed = true;
      console.log("right");
      break;
    case 65:
      keys.left.pressed = true;
      console.log("left");
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
      console.log("right");
      break;
    case 65:
      keys.left.pressed = false;
      console.log("left");
      break;
  }
});
