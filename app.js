const ACCESS_CODE = "TAMBAY369";
const SESSION_DURATION = 72 * 60 * 60 * 1000; // 72 hours
let currentUser = "";
let interactionStartTime = null;
let leadCaptured = false;

// LOGIN
function attemptLogin() {
    const name = document.getElementById('username').value;
    const code = document.getElementById('access-code').value;
    
    if (!name || !code) {
        showError("Please enter name and access code");
        return;
    }

    if (code === ACCESS_CODE) {
        grantAccess(name);
    } else {
        showError("Invalid Access Code");
    }
}

function grantAccess(name) {
    currentUser = name;
    interactionStartTime = Date.now();
    document.getElementById('watermark').innerText = `${name} • TEST • CONFIDENTIAL`;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Welcome, ${name}`;
    
    // Set expiry
    localStorage.setItem('pin8_demo_expiry', Date.now() + SESSION_DURATION);
    
    // Start interaction timer (show lead capture after 2 minutes)
    setTimeout(() => {
        if (!leadCaptured) {
            showLeadCapture();
        }
    }, 120000); // 2 minutes
    
    // Save session start
    saveSessionData('login', { name: name, timestamp: new Date().toISOString() });
}

// SHOW LEAD CAPTURE FORM
function showLeadCapture() {
    document.getElementById('lead-capture').classList.remove('hidden');
    document.getElementById('lead-capture').scrollIntoView({ behavior: 'smooth' });
}

function skipLeadCapture() {
    document.getElementById('lead-capture').classList.add('hidden');
    leadCaptured = true;
}

function submitLeadData() {
    const email = document.getElementById('lead-email').value;
    const phone = document.getElementById('lead-phone').value;
    const business = document.getElementById('lead-business').value;
    const painPoints = document.getElementById('lead-pain-points').value;
    const questions = document.getElementById('lead-questions').value;
    
    if (!email) {
        alert("Please enter at least your email address.");
        return;
    }
    
    const leadData = {
        name: currentUser,
        email: email,
        phone: phone,
        business: business,
        painPoints: painPoints,
        questions: questions,
        timestamp: new Date().toISOString(),
        sessionDuration: Math.floor((Date.now() - interactionStartTime) / 1000) + " seconds"
    };
    
    // Save to localStorage (you can view this)
    saveSessionData('lead_capture', leadData);
    
    // Also save to a visible "admin" view
    saveToLeadDatabase(leadData);
    
    alert("✅ Thank you! Your information has been saved. We'll reach out soon.");
    document.getElementById('lead-capture').classList.add('hidden');
    leadCaptured = true;
}

// SAVE SESSION DATA
function saveSessionData(type, data) {
    const sessions = JSON.parse(localStorage.getItem('pin8_demo_sessions') || '[]');
    sessions.push({
        type: type,
        user: currentUser,
        data: data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('pin8_demo_sessions', JSON.stringify(sessions));
}

// SAVE TO LEAD DATABASE (LocalStorage)
function saveToLeadDatabase(leadData) {
    const leads = JSON.parse(localStorage.getItem('pin8_leads') || '[]');
    leads.push(leadData);
    localStorage.setItem('pin8_leads', JSON.stringify(leads));
}

// MODULES
function loadModule(module) {
    document.getElementById('module-view').classList.remove('hidden');
    document.getElementById('module-title').innerText = `${module.toUpperCase()} MODULE`;
    
    let content = "";
    if (module === 'talk') {
        content = "<p><strong>Secure Communication Grid:</strong> Encrypted • Sovereign • Perpetual</p><p>Test: Type a message below to see how it works.</p>";
    } else if (module === 'manage') {
        content = "<p><strong>Task & Operations Flow:</strong> Automated • Transparent • Aligned</p><p>Test: Create a task below to experience the flow.</p>";
    } else if (module === 'track') {
        content = "<p><strong>Pulse Intelligence Dashboard:</strong> Real-time • Predictive • Sovereign</p><p>Test: Enter data below to see tracking in action.</p>";
    }
    
    document.getElementById('module-content').innerHTML = content;
    saveSessionData('module_view', { module: module });
}

function closeModule() {
    document.getElementById('module-view').classList.add('hidden');
    document.getElementById('demo-response').classList.add('hidden');
    document.getElementById('demo-input').value = "";
}

function simulateAction() {
    document.getElementById('demo-response').classList.remove('hidden');
    document.getElementById('demo-response').innerText = "✅ Action Simulated • Sovereign Infrastructure Active";
    saveSessionData('interaction', { action: 'simulate', input: document.getElementById('demo-input').value });
    setTimeout(() => { document.getElementById('demo-response').classList.add('hidden'); }, 3000);
}

function logout() {
    // Save final session summary
    saveSessionData('logout', { 
        totalDuration: Math.floor((Date.now() - interactionStartTime) / 1000) + " seconds",
        timestamp: new Date().toISOString()
    });
    
    localStorage.removeItem('pin8_demo_expiry');
    location.reload();
}

function showError(msg) {
    const err = document.getElementById('error-msg');
    err.innerText = msg;
    err.classList.remove('hidden');
}

// Disable Right Click
document.addEventListener('contextmenu', event => event.preventDefault());

// Check Expiry on Load
if (localStorage.getItem('pin8_demo_expiry')) {
    if (Date.now() > localStorage.getItem('pin8_demo_expiry')) {
        alert("Demo Access Expired. Please Request New Access.");
        localStorage.removeItem('pin8_demo_expiry');
        location.reload();
    }
}

// VIEW LEAD DATA (Console Command)
console.log("%c📊 PIN8 LEAD DATABASE", "color: #D4AF37; font-size: 20px; font-weight: bold;");
console.log("%cTo view collected leads, type: viewLeads()", "color: #888; font-size: 12px;");

function viewLeads() {
    const leads = JSON.parse(localStorage.getItem('pin8_leads') || '[]');
    console.table(leads);
    return leads;
}

function viewSessions() {
    const sessions = JSON.parse(localStorage.getItem('pin8_demo_sessions') || '[]');
    console.table(sessions);
    return sessions;
}
