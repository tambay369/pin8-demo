// PIN8 DEMO SYSTEM
const ACCESS_CODE = "TAMBAY369";
const SESSION_DURATION = 72 * 60 * 60 * 1000; // 72 hours

let currentUser = "";
let userType = ""; // FUNDER or CLIENT
let interactionStartTime = null;

// SELECT TYPE
function selectType(type) {
    userType = type;
    const text = type === 'FUNDER' ? '💎 PIN8 FUNDER Selected' : '🏢 PIN8 CLIENT Selected';
    document.getElementById('selectedType').innerText = text;
    
    // Visual feedback
    document.querySelectorAll('.option-card').forEach(card => {
        card.style.borderColor = '#D4AF37';
        card.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0) 100%)';
    });
    
    event.currentTarget.style.borderColor = '#FFD700';
    event.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(0, 0, 0, 0) 100%)';
}

// ENTER DEMO
function enterDemo() {
    const name = document.getElementById('userName').value.trim();
    const code = document.getElementById('accessCode').value.trim();
    
    if (!name) {
        showError("Please enter your name");
        return;
    }
    
    if (!code) {
        showError("Please enter the access code");
        return;
    }
    
    if (!userType) {
        showError("Please select FUNDER or CLIENT");
        return;
    }
    
    if (code !== ACCESS_CODE) {
        showError("Invalid Access Code - Use: TAMBAY369");
        return;
    }
    
    // Success
    currentUser = name;
    interactionStartTime = Date.now();
    
    document.getElementById('watermark').innerText = `${name} • ${userType} • CONFIDENTIAL`;
    document.getElementById('welcomeName').innerText = `Welcome, ${name} (${userType})`;
    
    // Show funder-specific FAQ if FUNDER
    if (userType === 'FUNDER') {
        document.getElementById('funder-faq').classList.remove('hidden');
    }
    
    // Switch pages
    document.getElementById('page-welcome').classList.add('hidden');
    document.getElementById('page-overview').classList.remove('hidden');
    
    // Set expiry
    localStorage.setItem('pin8_demo_expiry', Date.now() + SESSION_DURATION);
    
    // Save session
    saveData('login', { name, userType, timestamp: new Date().toISOString() });
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// TOGGLE FAQ
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isHidden = answer.classList.contains('hidden');
    
    // Close all FAQs
    document.querySelectorAll('.faq-answer').forEach(faq => {
        faq.classList.add('hidden');
    });
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
    });
    
    // Open clicked if was closed
    if (isHidden) {
        answer.classList.remove('hidden');
        element.classList.add('active');
    }
}

// SUBMIT LEAD
function submitLead() {
    const email = document.getElementById('leadEmail').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const business = document.getElementById('leadBusiness').value.trim();
    const painPoints = document.getElementById('leadPainPoints').value.trim();
    const questions = document.getElementById('leadQuestions').value.trim();
    
    if (!email) {
        alert("Please enter your email address.");
        return;
    }
    
    const leadData = {
        name: currentUser,
        userType: userType,
        email: email,
        phone: phone,
        business: business,
        painPoints: painPoints,
        questions: questions,
        timestamp: new Date().toISOString(),
        sessionDuration: Math.floor((Date.now() - interactionStartTime) / 1000) + " seconds"
    };
    
    saveData('lead', leadData);
    saveToDatabase(leadData);
    
    alert(`✅ Thank you ${name}!\n\nYour ${userType} qualification has been received.\n\nWe'll reach out within 48 hours to schedule your exclusive alignment call.`);
    
    // Clear form
    document.getElementById('leadEmail').value = '';
    document.getElementById('leadPhone').value = '';
    document.getElementById('leadBusiness').value = '';
    document.getElementById('leadPainPoints').value = '';
    document.getElementById('leadQuestions').value = '';
}

// SAVE DATA
function saveData(type, data) {
    const sessions = JSON.parse(localStorage.getItem('pin8_demo_sessions') || '[]');
    sessions.push({
        type: type,
        user: currentUser,
        userType: userType,
         data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('pin8_demo_sessions', JSON.stringify(sessions));
}

function saveToDatabase(leadData) {
    const leads = JSON.parse(localStorage.getItem('pin8_leads') || '[]');
    leads.push(leadData);
    localStorage.setItem('pin8_leads', JSON.stringify(leads));
}

// LOGOUT
function logout() {
    saveData('logout', { 
        totalDuration: Math.floor((Date.now() - interactionStartTime) / 1000) + " seconds",
        timestamp: new Date().toISOString()
    });
    
    localStorage.removeItem('pin8_demo_expiry');
    location.reload();
}

// ERROR
function showError(msg) {
    const err = document.getElementById('errorMsg');
    err.innerText = msg;
    err.classList.remove('hidden');
    setTimeout(() => {
        err.classList.add('hidden');
    }, 5000);
}

// DISABLE RIGHT CLICK
document.addEventListener('contextmenu', event => event.preventDefault());

// CHECK EXPIRY
if (localStorage.getItem('pin8_demo_expiry')) {
    if (Date.now() > localStorage.getItem('pin8_demo_expiry')) {
        alert("Demo Access Expired. Please Request New Access.");
        localStorage.removeItem('pin8_demo_expiry');
        location.reload();
    }
}

// CONSOLE COMMANDS
console.log("%c📊 PIN8 LEAD DATABASE", "color: #D4AF37; font-size: 20px; font-weight: bold;");
console.log("%cType viewLeads() to see collected data", "color: #888;");

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
