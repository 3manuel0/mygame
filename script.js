const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.5;
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
    this.width = 40;
    this.height = 40;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    else this.velocity.y = 0;
  }
}
class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.height = 20;
    this.width = 200;
  }
  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
const player = new Player();
const platforms = [
  new Platform({ x: 200, y: 100 }),
  new Platform({ x: 300, y: 400 }),
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
  c.clearRect(0, 0, canvas.width, canvas.height);
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();
  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else if (keys.left.pressed) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      console.log(platform.position.x + platform.width);
      console.log(player.position.x);
      player.velocity.y = 0;
    }
  });
}
animate();

addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 87:
      platforms.forEach((platform) => {
        if (
          player.position.y + player.height + player.velocity.y >=
            canvas.height ||
          player.position.y + player.height + player.velocity.y >=
            platform.position.y + platform.height
        ) {
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
      console.log("right");
      break;
  }
});
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
      console.log("right");
      break;
  }
});
