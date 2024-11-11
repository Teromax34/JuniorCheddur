const funkyStationUrl = "https://status.funkystation.org/lrp/status";

let startDate; // Declare startDate in the outer scope
let inputTime = '0:00:00'; // Initialize inputTime
let timerVisible = false; // Flag to track timer visibility
let intervalId; // Store the interval ID for later use

async function getData() {
    try {
        const response = await fetch(funkyStationUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
        return null; // Return null in case of error
    }
}

async function init() {
    await checkForRoundStartTime(); // Initial check
}

async function checkForRoundStartTime() {
    const res = await getData();
    if (res) {
        const serverTime = res.round_start_time;
        const serverName = res.name;
        const serverPlayerCap = res.soft_max_players;
        const serverPlayers = res.players;
        const serverMap = res.map;
        const serverGamemode = res.preset;
        const serverRound = res.round_id;
        if (serverTime) {
            startDate = new Date(serverTime); 
            timerVisible = true;
            document.getElementById('timerDisplay').style.display = 'block'; 

            document.getElementById('nameDisplay').textContent = serverName;

            document.getElementById('playerDisplay').textContent = `Players: ${String(serverPlayers)}/${String(serverPlayerCap)}`;

            document.getElementById('mapDisplay').textContent = `Map: ${(serverMap)}`;

            document.getElementById('gamemodeDisplay').textContent = `Gamemode: ${(serverGamemode)}`;

            document.getElementById('roundDisplay').textContent = `Round ID: #${(serverRound)}`;

            setInterval(updateTimer, 1000);
            updateTimer(); 
            updateTimerDigits(); 
            
            
            clearInterval(intervalId);
        } else if (!timerVisible) {
            
            document.getElementById('timerDisplay').style.display = 'none';
            
            intervalId = setInterval(checkForRoundStartTime, 30000);
        }
    }
}

function updateTimerDigits() {
    document.getElementById('timerDisplay').textContent = inputTime;
}

function updateTimer() {
    const now = new Date();
    const elapsed = now - startDate;

    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor((elapsed / (1000 * 60 * 60)));
    inputTime = `Round Time: ${String(hours).padStart(1, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    updateTimerDigits(); 
}

init();