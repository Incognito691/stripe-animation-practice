const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Image for the character
const man = new Image();
man.src = "spriteAthlete.png";

// Define columns and rows for sprite sheet
const animationCoord = {
    jump: [
        [43, 112, 18, 40], [72, 110, 24, 41], [104, 108, 26, 36], [138, 107, 26, 29],
        [172, 105, 24, 30], [208, 106, 17, 26], [239, 106, 15, 29], [267, 106, 18, 32],
        [296, 104, 20, 36], [325, 110, 20, 38], [353, 113, 23, 37]
    ],
    walk: [
        [31, 31, 17, 37], [57, 31, 21, 37], [87, 31, 19, 37], [119, 31, 11, 38],
        [149, 31, 10, 37], [175, 31, 17, 37], [201, 31, 21, 38], [231, 31, 19, 37],
        [263, 31, 11, 38], [293, 31, 10, 37], [319, 31, 17, 37], [345, 31, 21, 37],
        [369, 31, 19, 37]
    ],
    run: [
        [52, 181, 29, 34], [90, 182, 26, 37], [125, 183, 24, 39], [159, 184, 17, 38],
        [190, 184, 17, 38], [218, 183, 21, 39], [248, 183, 27, 35], [282, 182, 31, 36],
        [317, 183, 25, 39], [350, 183, 16, 39]
    ],
    idle: [
        [31, 31, 17, 37], [31, 31, 17, 37]
    ]
};

let currentState = "idle";
let currentFrame = 0;
let lastFrameTime = 0;
const fps = 10;
const frameInterval = 1000 / fps;

let dx = 0; // Character's horizontal position
let dy = canvas.height - 100; // Character's vertical position
let velocityY = 0; // Vertical velocity
const gravity = 0.5; // Gravity effect
const jumpForce = -12; // Jump force
let isJumping = false; // Jump state
let facingRight = true; // Character facing direction
let speed = 2; // Movement speed

const keys = { right: false, left: false, shift: false, space: false };

// Key event listeners
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "Shift") keys.shift = true;
    if (e.key === " ") {
        keys.space = true;
        if (!isJumping) {
            isJumping = true;
            velocityY = jumpForce;
            currentState = "jump";
            currentFrame = 0;
        }
    }

});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "Shift") keys.shift = false;
    if (e.key === " ") keys.space = false;
    currentState='idle'
    currentFrame=0
    lastFrameTime=0
});

// Main animation loop
function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (time - lastFrameTime > frameInterval) {
        lastFrameTime = time;
        const maxFrames = animationCoord[currentState]?.length 
        currentFrame = (currentFrame + 1) % maxFrames;
    }

    if (!isJumping) {
        if (keys.right || keys.left) {
            currentState = keys.shift ? "run" : "walk";
            speed = keys.shift ? 2 : 1;
        } else {
            currentState = "idle";
        }
    }

    // Update character position based on key presses
    if (keys.right) {
        dx += speed;
        facingRight = true;
    } 
    if (keys.left) {
        dx -= speed;
        facingRight = false;
    }

    // Jumping mechanics
    if (isJumping) {
        dy += velocityY;
        velocityY += gravity;

        if (dy >= canvas.height - 100) {
            dy = canvas.height - 100;
            isJumping = false;
            velocityY = 0;
            currentState = keys.right || keys.left ? (keys.shift ? "run" : "walk") : "idle";
        }
    }

    // Ensure the character doesn't fall below the canvas
    if (dy > canvas.height - 100) {
        dy = canvas.height - 100;
        isJumping = false;
        velocityY = 0;
    }

    // Scroll the canvas based on character's position
    const scrollSpeed = 5; // Speed of the scrolling background
    if (dx > canvas.width / 2) {
        dx -= scrollSpeed; // Move the character left to create a scrolling effect
    }

    const [sx, sy, sWidth, sHeight] = animationCoord[currentState][currentFrame];
    const scaleFactor = 1.5;


    ctx.save();
    if (!facingRight) {
        ctx.scale(-1, 1);
        ctx.drawImage(man, sx, sy, sWidth, sHeight, -dx - sWidth * scaleFactor, dy, sWidth * scaleFactor, sHeight * scaleFactor);
    } else {
        ctx.drawImage(man, sx, sy, sWidth, sHeight, dx, dy, sWidth * scaleFactor, sHeight * scaleFactor);
    }
    ctx.restore();

    requestAnimationFrame(animate);
}

man.onload = () => {
    ctx.imageSmoothingEnabled = false;

    animate();
};