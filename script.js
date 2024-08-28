let activePlayer = 1;
const scores = [0, 0];
const assignedBalls = [[], []];

function setActivePlayer(player) {
    activePlayer = player;
    document.querySelectorAll('.player-button').forEach((button, index) => {
        button.style.backgroundColor = (index + 1 === player) ? 'green' : 'gray';
    });
}

function updateScore(player) {
    document.getElementById(`score${player}`).innerText = scores[player - 1];
}

function updateAssignedBalls(player) {
    const container = document.getElementById(`assignedBalls${player}`);
    container.innerHTML = '';
    const balls = Array(9).fill(null);
    assignedBalls[player - 1].forEach(ball => {
        balls[ball - 1] = ball;
    });
    balls.forEach(ball => {
        const icon = document.createElement('div');
        icon.className = 'ball-icon';
        if (ball) {
            icon.style.backgroundImage = `url('images/ball${ball}.png')`;
        }
        container.appendChild(icon);
    });
}

function newGame() {
    // Show confirmation overlay
    document.getElementById('confirmationOverlay').style.display = 'flex';
    // Set action to new game
    window.confirmAction = () => {
        assignedBalls[0] = [];
        assignedBalls[1] = [];
        updateAssignedBalls(1);
        updateAssignedBalls(2);
        document.querySelectorAll('.ball-grid button').forEach(button => {
            button.dataset.state = 'unassigned';
            button.style.backgroundImage = `url('images/ball${button.dataset.ball}.png')`;
        });
        document.getElementById('confirmationOverlay').style.display = 'none';
    };
}

function resetScores() {
    // Show confirmation overlay
    document.getElementById('confirmationOverlay').style.display = 'flex';
    // Set action to reset scores
    window.confirmAction = () => {
        scores[0] = 0;
        scores[1] = 0;
        updateScore(1);
        updateScore(2);
        assignedBalls[0] = [];
        assignedBalls[1] = [];
        updateAssignedBalls(1);
        updateAssignedBalls(2);
        document.querySelectorAll('.ball-grid button').forEach(button => {
            button.dataset.state = 'unassigned';
            button.style.backgroundImage = `url('images/ball${button.dataset.ball}.png')`;
        });
        document.getElementById('confirmationOverlay').style.display = 'none';
    };
}

function cancelAction() {
    document.getElementById('confirmationOverlay').style.display = 'none';
}

function toggleBallState(button) {
    const state = button.dataset.state;
    const ball = parseInt(button.dataset.ball);
    const points = ball === 9 ? 2 : 1; // Assign 2 points for ball 9, 1 point for others
    if (state === 'unassigned') {
        button.dataset.state = 'assigned';
        button.style.backgroundImage = `url('images/ball${ball}_assigned.png')`;
        scores[activePlayer - 1] += points;
        assignedBalls[activePlayer - 1].push(ball);
    } else if (state === 'assigned') {
        button.dataset.state = 'dead';
        button.style.backgroundImage = `url('images/ball${ball}_dead.png')`;
        const playerWithBall = assignedBalls[0].includes(ball) ? 1 : 2;
        scores[playerWithBall - 1] -= points;
        assignedBalls[playerWithBall - 1] = assignedBalls[playerWithBall - 1].filter(b => b !== ball);
    } else {
        button.dataset.state = 'unassigned';
        button.style.backgroundImage = `url('images/ball${ball}.png')`;
    }
    updateScore(1);
    updateScore(2);
    updateAssignedBalls(1);
    updateAssignedBalls(2);
}

function updatePlayerName(player, name) {
    document.querySelector(`#player${player} .player-button`).innerText = name;
}

document.addEventListener('DOMContentLoaded', () => {
    const ballGrid = document.querySelector('.ball-grid');
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.dataset.state = 'unassigned';
        button.dataset.ball = i;
        button.style.backgroundImage = `url('images/ball${i}.png')`;
        button.onclick = () => toggleBallState(button);
        ballGrid.appendChild(button);
    }
    setActivePlayer(1);
});

function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial calculation
setViewportHeight();

// Recalculate on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

