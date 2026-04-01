// PIN8 DEMO SYSTEM - WITH DEFENSIVE WALLS
// Access Code (Base64 Obfuscated): TAMBAY369
const ACCESS_CODE = atob("VEFNQkFZMzY5");

const SESSION_DURATION = 72 * 60 * 60 * 1000; // 72 hours
const MIN_TIME_BEFORE_SUBMIT = 60000; // 60 seconds minimum
const RATE_LIMIT_HOURS = 24;

let currentUser = "";
let userType = "";
let interactionStartTime = null;
let pageStartTime = Date.now();
let captchaAnswer = 0;
let suspiciousActivity = false;
let mouseMovements = 0;
let lastActivity = Date.now();

// TRACK MOUSE MOVEMENTS (Behavioral Analysis)
document.addEventListener('mousemove', () => {
    mouseMovements++;
    lastActivity = Date.now();
});

document.addEventListener('click', () => {
    lastActivity = Date.now();
});

document.addEventListener('scroll', () => {
    lastActivity = Date.now();
});

// GENERATE CAPTCHA
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    
    const num1El = document.getElementById('num1');
    const num2El = document.getElementById('num2');
    
    if (num1El && num2El) {
        num1El.innerText = num1;
        num2El.innerText = num2;
    }
}

// SELECT TYPE
function selectType(type) {
    userType = type;
    const text = type === 'FUNDER' ? '💎 PIN8 FUNDER Selected' : '🏢 PIN8 CLIENT Selected';
    document.getElementById('selectedType').innerText = text;
    
    document.querySelectorAll('.option-card').forEach(card => {
        card.style.borderColor = '#D4AF37';
        card.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0) 100%)';
    });
    
    event.currentTarget.style.borderColor = '#FFD700';
    event.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(0, 0, 0, 0) 100%)';
}

// CHECK RATE LIMIT
function checkRateLimit() {
    const lastSubmission = localStorage.getItem('pin8_last_submission');
    if (lastSubmission) {
        const hoursSince = (Date.now() - parseInt(lastSubmission)) / (1000 * 60 * 60);
        if (hoursSince < RATE_LIMIT_HOURS) {
            const remaining = Math.ceil(RATE_LIMIT_HOURS - hoursSince);
            return { allowed: false, remaining: remaining };
        }
    }
    return { allowed: true };
}

// START COUNTDOWN TIMER
function startCountdown() {
    const countdown = document.getElementById('countdown');
    const timer = document.getElementById('timer');
    const enterBtn = document.getElementById('enterBtn');
    const timeWarning = document.getElementById('timeWarning');
    
    countdown.classList.remove('hidden');
    timeWarning.classList.remove('hidden');
    
    let seconds = 60;
    
    const interval = setInterval(() => {
        seconds--;
        timer.innerText = seconds;
        
        if (seconds <= 0) {
            clearInterval(interval);
            countdown.classList.add('hidden');
            timeWarning.classList.add('hidden');
            enterBtn.disabled = false;
        }
    }, 1000);
}

// ENTER DEMO
function enterDemo() {
    const name = document.getElementById('userName').value.trim();
    const code = document.getElementById('accessCode').value.trim();
    
    // Check rate limit
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
        showError(`You've already submitted recently. Please wait ${rateCheck.remaining} hours before trying again.`);
        return;
    }
    
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
        // Log suspicious activity
        logSuspiciousActivity('invalid_access_code', { name, code });
        showError("Invalid Access Code");
        return;
    }
    
    // Check minimum time
    const timeOnPage = Date.now() - pageStartTime;
    if (timeOnPage < MIN_TIME_BEFORE_SUBMIT) {
        showError("Please take a moment to review the information before proceeding.");
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
    saveData('login', { name, userType, timestamp: new Date().toISOString(), mouseMovements });
    
    // Generate CAPTCHA for lead form
    generateCaptcha();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Clear page start time
    pageStartTime = null;
}

// TOGGLE FAQ
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isHidden = answer.classList.contains('hidden');
    
    document.querySelectorAll('.faq-answer').forEach(faq => {
        faq.classList.add('hidden');
    });
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
    });
    
    if (isHidden) {
        answer.classList.remove('hidden');
        element.classList.add('active');
    }
}

// SUBMIT LEAD WITH PROTECTIONS
function submitLead() {
    // Check honeypot (bots fill this)
    const honeypot = document.getElementById('honeypot').value;
    if (honeypot) {
        logSuspiciousActivity('honeypot_triggered', { honeypot });
        // Silently fail - don't alert the bot
        return;
    }
    
    // Check CAPTCHA
    const userAnswer = parseInt(document.getElementById('captchaAnswer').value);
    if (userAnswer !== captchaAnswer) {
        showError("Security check failed. Please answer the math question correctly.");
        generateCaptcha();
        document.getElementById('captchaAnswer').value = '';
        return;
    }
    
    // Get form data
    const email = document.getElementById('leadEmail').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const business = document.getElementById('leadBusiness').value.trim();
    const painPoints = document.getElementById('leadPainPoints').value.trim();
    const questions = document.getElementById('leadQuestions').value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError("Please enter a valid email address.");
        return;
    }
    
    // Check for disposable email domains
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    const emailDomain = email.split('@')[1].toLowerCase();
    if (disposableDomains.some(domain => emailDomain.includes(domain))) {
        showError("Please use a permanent email address.");
        logSuspiciousActivity('disposable_email', { email });
        return;
    }
    
    // Check session duration
    const sessionDuration = interactionStartTime ? Math.floor((Date.now() - interactionStartTime) / 1000) : 0;
    if (sessionDuration < 120) { // Minimum 2 minutes
        showError("Please spend more time exploring the demo before submitting.");
        return;
    }
    
    // Check for suspicious activity
    if (suspiciousActivity || mouseMovements < 10) {
        logSuspiciousActivity('low_interaction', { mouseMovements, sessionDuration });
        showError("Submission failed. Please try again or contact us directly.");
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
        sessionDuration: sessionDuration + " seconds",
        mouseMovements: mouseMovements,
        userAgent: navigator.userAgent
    };
    
    saveData('lead', leadData);
    saveToDatabase(leadData);
    
    // Set rate limit
    localStorage.setItem('pin8_last_submission', Date.now().toString());
    
    alert(`✅ Thank you ${name}!\n\nYour ${userType} qualification has been received.\n\nWe'll reach out within 48 hours to schedule your exclusive alignment call.`);
    
    // Clear form
    document.getElementById('leadEmail').value = '';
    document.getElementById('leadPhone').value = '';
    document.getElementById('leadBusiness').value = '';
    document.getElementById('leadPainPoints').value = '';
    document.getElementById('leadQuestions').value = '';
    document.getElementById('captchaAnswer').value = '';
    
    generateCaptcha();
}

// REPORT ABUSE
function reportAbuse() {
    const reason = prompt("Please describe the suspicious activity or abuse:\n\nExamples:\n- Spam submissions\n- Fake leads\n- Technical issues\n- Other concerns");
    
    if (reason) {
        const abuseReport = {
            reportedBy: currentUser || 'Anonymous',
            reason: reason,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        const reports = JSON.parse(localStorage.getItem('pin8_abuse_reports') || '[]');
        reports.push(abuseReport);
        localStorage.setItem('pin8_abuse_reports', JSON.stringify(reports));
        
        alert("✅ Thank you for reporting. This has been logged for review.");
        console.log("Abuse Report:", abuseReport);
    }
}

// LOG SUSPICIOUS ACTIVITY
function logSuspiciousActivity(type, data) {
    suspiciousActivity = true;
    
    const logs = JSON.parse(localStorage.getItem('pin8_suspicious_logs') || '[]');
    logs.push({
        type: type,
         data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: 'Not available (client-side only)'
    });
    localStorage.setItem('pin8_suspicious_logs', JSON.stringify(logs));
    
    console.warn("🚨 Suspicious Activity Logged:", type, data);
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
        totalDuration: interactionStartTime ? Math.floor((Date.now() - interactionStartTime) / 1000) + " seconds" : "N/A",
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
    err.classList.add('error-shake');
    
    setTimeout(() => {
        err.classList.remove('error-shake');
    }, 500);
    
    setTimeout(() => {
        err.classList.add('hidden');
    }, 8000);
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
console.log("%c🛡️ Protected by PIN8 Sovereignty Guards", "color: #D4AF37;");

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

function viewSuspiciousLogs() {
    const logs = JSON.parse(localStorage.getItem('pin8_suspicious_logs') || '[]');
    console.table(logs);
    return logs;
}

function viewAbuseReports() {
    const reports = JSON.parse(localStorage.getItem('pin8_abuse_reports') || '[]');
    console.table(reports);
    return reports;
}

// INITIALIZE - Start countdown when page loads
window.addEventListener('load', () => {
    startCountdown();
});
