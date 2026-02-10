let rageValue = (Math.random() * 100).toFixed(2);
let currentDisplayValue = 0.00;
let alarmCount = 0;
const totalAlarmsNeeded = 10;
let timerInterval;

// 1. Start Sequence
function startLandingSequence() {
    const planet = document.querySelector('.planet');
    const hud = document.querySelector('.hud-layer');
    const introCard = document.getElementById('intro-card');
    
    // Zoom planet
    planet.classList.add('planet-zoom');
    
    // Fade out UI
    introCard.style.opacity = '0';
    hud.style.opacity = '0';
    
    // Wait for zoom, then switch to Loading
    setTimeout(() => {
        // Hide Intro Wrapper
        document.querySelector('.center-content').style.display = 'none';
        
        // Show Loading (Using Flex for centering)
        const loadingContainer = document.getElementById('loading-container');
        loadingContainer.style.display = 'flex';
        
        startLoading();
    }, 2500);
}

// 2. The Trap (Loading)
function startLoading() {
    const loadingText = document.getElementById('loading-text');
    
    let loadInterval = setInterval(() => {
        let increment = Math.random() * 2.5; 
        currentDisplayValue += increment;
        
        if (currentDisplayValue >= parseFloat(rageValue)) {
            // STOP at the Trap Value
            loadingText.innerText = `${rageValue}%`;
            clearInterval(loadInterval);
            
            // Wait 3s so they see the number, then trigger Emergency
            setTimeout(() => {
                triggerEmergency();
            }, 3000);
        } else {
            loadingText.innerText = `${currentDisplayValue.toFixed(2)}%`;
        }
    }, 50);
}

// 3. The Emergency
function triggerEmergency() {
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('alarm-overlay').style.display = 'block';
    
    // Activate Red Beam
    document.body.classList.add('alarm-state');
    
    // Logic: Harder timer if loading was "short" (The Troll)
    let calcValue = parseFloat(rageValue) / 10;
    let timeLimit = (calcValue >= 0 && calcValue <= 5) ? 6 : 9;
    
    startTimer(timeLimit);
    if (navigator.vibrate) navigator.vibrate([500, 200, 500]); // SOS vibration
    spawnAlarmNode();
}

function startTimer(seconds) {
    const display = document.getElementById('countdown-display');
    let remainingTime = seconds;
    display.innerText = remainingTime.toFixed(1);

    timerInterval = setInterval(() => {
        remainingTime -= 0.1;
        display.innerText = remainingTime.toFixed(1);
        
        // Game Over
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            display.innerText = "0.0";
            alert("HULL BREACH DETECTED. MISSION FAILED.");
            location.reload(); 
        }
    }, 100);
}

function spawnAlarmNode() {
    if (alarmCount >= totalAlarmsNeeded) {
        stabilizeShip();
        return;
    }

    const node = document.createElement('div');
    node.className = 'alarm-node';
    node.innerText = "TAP!";
    
    // Mobile Safe Bounds (padding)
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;
    
    const randomX = Math.max(20, Math.floor(Math.random() * maxX));
    const randomY = Math.max(20, Math.floor(Math.random() * maxY));

    node.style.left = `${randomX}px`;
    node.style.top = `${randomY}px`;

    // Pointer event for fast tapping
    node.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        node.remove();
        alarmCount++;
        if (navigator.vibrate) navigator.vibrate(50);
        spawnAlarmNode();
    });

    document.body.appendChild(node);
}

// 4. Verification
function stabilizeShip() {
    clearInterval(timerInterval);
    document.getElementById('countdown-display').style.display = 'none';
    
    // Stop Red Beam
    document.body.classList.remove('alarm-state');
    document.getElementById('alarm-overlay').style.display = 'none';
    
    // Show Verify Screen
    const centerContent = document.querySelector('.center-content');
    centerContent.style.display = 'flex'; // Bring back container
    
    // Hide Intro card just in case, show verify card
    document.getElementById('intro-card').style.display = 'none';
    document.getElementById('verify-screen').style.display = 'block';
}

function checkRageValue() {
    const userInput = document.getElementById('user-input').value;
    
    if (parseFloat(userInput).toFixed(2) === rageValue) {
        alert("ACCESS GRANTED. LEVEL 2 INITIATED.");
        window.location.href = "level2.html"; 
    } else {
        alert(`ACCESS DENIED.\nRequired: ${rageValue}%`);
        location.reload(); 
    }
}