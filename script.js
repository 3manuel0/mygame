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
const player = new Player();
player.draw();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
}
animate();

addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 87:
      player.velocity.y -= 20;
      console.log("up");
      break;
    case 68:
      player.velocity.x += 5;
      console.log("right");
      break;
    case 65:
      player.velocity.x -= 5;
      console.log("right");
      break;
  }
});
addEventListener("keyup", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 87:
      console.log("up");
      break;
    case 68:
      player.velocity.x = 0;
      console.log("right");
      break;
    case 65:
      player.velocity.x = 0;
      console.log("right");
      break;
  }
});
