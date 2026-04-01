const FUNDER_CODE = "PIN8-FUNDER";
const CLIENT_CODE = "PIN8-CLIENT";
const SESSION_DURATION = 72 * 60 * 60 * 1000;
let currentUser = "";
let userType = "";

function attemptLogin() {
    const name = document.getElementById('username').value;
    const code = document.getElementById('access-code').value;
    if (!name || !code) { showError("Name and Code required"); return; }
    if (code === FUNDER_CODE) { userType = "FUNDER"; grantAccess(name); }
    else if (code === CLIENT_CODE) { userType = "CLIENT"; grantAccess(name); }
    else { showError("Invalid Access Code"); }
}

function grantAccess(name) {
    currentUser = name;
    document.getElementById('watermark').innerText = `${name} • ${userType} • CONFIDENTIAL`;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Welcome, ${name} (${userType})`;
    localStorage.setItem('pin8_demo_expiry', Date.now() + SESSION_DURATION);
}

function loadModule(module) {
    document.getElementById('module-view').classList.remove('hidden');
    document.getElementById('module-title').innerText = `${module.toUpperCase()} MODULE`;
    let content = userType === "FUNDER" ? "<p><strong>Funder View:</strong> System Stability • ROI • Guards</p>" : "<p><strong>Client View:</strong> Tasks • Comms • Privacy</p>";
    document.getElementById('module-content').innerHTML = content;
}

function closeModule() {
    document.getElementById('module-view').classList.add('hidden');
    document.getElementById('demo-response').classList.add('hidden');
    document.getElementById('demo-input').value = "";
}

function simulateAction() {
    document.getElementById('demo-response').classList.remove('hidden');
    setTimeout(() => { document.getElementById('demo-response').classList.add('hidden'); }, 3000);
}

function logout() { localStorage.removeItem('pin8_demo_expiry'); location.reload(); }
function showError(msg) { const err = document.getElementById('error-msg'); err.innerText = msg; err.classList.remove('hidden'); }
document.addEventListener('contextmenu', event => event.preventDefault());
if (localStorage.getItem('pin8_demo_expiry') && Date.now() > localStorage.getItem('pin8_demo_expiry')) { alert("Demo Expired"); localStorage.removeItem('pin8_demo_expiry'); location.reload(); }
