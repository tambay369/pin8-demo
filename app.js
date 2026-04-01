// PIN8 DEMO SYSTEM
let selectedIndustry = '';
let businessLogo = '';
let nickname = '';
let businessName = '';

// Module Data
let foundationData = [];
let growthData = [];
let sustainabilityData = [];

// Logo Preview
function previewLogo() {
    const file = document.getElementById('businessLogo').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            businessLogo = e.target.result;
            const preview = document.getElementById('logoPreview');
            preview.src = businessLogo;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// Select Industry
function selectIndustry(industry) {
    selectedIndustry = industry;
    const industryNames = {
        'retail': 'RETAIL',
        'restaurant': 'RESTAURANT',
        'refreshments': 'REFRESHMENTS',
        'manufacturing': 'MANUFACTURING',
        'services': 'SERVICES',
        'production': 'PRODUCTION',
        'logistics': 'DELIVERY LOGISTICS',
        'other': 'OTHER'
    };
    document.getElementById('selectedIndustry').innerText = `✅ ${industryNames[industry]} Selected`;
}

// Enter Demo
function enterDemo() {
    nickname = document.getElementById('nickname').value.trim();
    businessName = document.getElementById('businessName').value.trim();
    const permission = document.getElementById('permissionCheck').checked;
    const code = document.getElementById('accessCode').value.trim();

    if (!nickname) { showError('Please enter a nickname'); return; }
    if (!businessName) { showError('Please enter your business name'); return; }
    if (!selectedIndustry) { showError('Please select your industry'); return; }
    if (!permission) { showError('Please confirm your interest for PIN8 DEMO'); return; }
    if (code !== 'TAMBAY369') { showError('Invalid Access Code'); return; }

    // Apply Branding
    document.getElementById('brandedBusinessName').innerText = businessName.toUpperCase();
    document.getElementById('brandedIndustry').innerText = selectedIndustry.toUpperCase();
    document.getElementById('watermark').innerText = `${nickname} • ${businessName} • CONFIDENTIAL`;

    if (businessLogo) {
        const headerLogo = document.getElementById('headerLogo');
        headerLogo.src = businessLogo;
        headerLogo.classList.remove('hidden');
    }

    document.getElementById('page-1').classList.add('hidden');
    document.getElementById('page-2').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Open Module
function openModule(module) {
    const content = document.getElementById('module-content');
    content.classList.remove('hidden');

    if (module === 'foundation') {
        content.innerHTML = `
            <h3>💬 FOUNDATION: CORE SYSTEMS</h3>
            <p style="color:#888; margin-bottom:20px;">Internal Operations • Team Communication</p>
            <input type="text" id="foundationInput" placeholder="Team message or task..." />
            <select id="foundationType">
                <option value="message">Team Message</option>
                <option value="task">Task Assignment</option>
            </select>
            <button onclick="addFoundation()">Add to Core Systems</button>
            <div id="foundationList" class="item-list"></div>
        `;
        renderFoundation();
        document.getElementById('status-foundation').innerText = '✓ In Progress';
        document.getElementById('status-foundation').style.color = '#D4AF37';
    } else if (module === 'growth') {
        content.innerHTML = `
            <h3>📦 GROWTH: SUPPLY CHAIN MANAGEMENT</h3>
            <p style="color:#888; margin-bottom:20px;">Inventory • POS • Vendor Management</p>
            <input type="text" id="growthItem" placeholder="Item/Product Name" />
            <input type="number" id="growthQty" placeholder="Quantity" />
            <input type="number" id="growthPrice" placeholder="Price (₱)" />
            <button onclick="addGrowth()">Add to Supply Chain</button>
            <div id="growthList" class="item-list"></div>
        `;
        renderGrowth();
        document.getElementById('status-growth').innerText = '✓ In Progress';
        document.getElementById('status-growth').style.color = '#D4AF37';
    } else if (module === 'sustainability') {
        content.innerHTML = `
            <h3>📊 SUSTAINABILITY: CUSTOMER RELATIONSHIP</h3>
            <p style="color:#888; margin-bottom:20px;">Customer Data • Sales Analytics</p>
            <input type="text" id="sustainCustomer" placeholder="Customer Name" />
            <input type="text" id="sustainPurchase" placeholder="Purchase Item" />
            <input type="number" id="sustainAmount" placeholder="Amount (₱)" />
            <button onclick="addSustainability()">Record Customer Interaction</button>
            <div id="sustainList" class="item-list"></div>
        `;
        renderSustainability();
        document.getElementById('status-sustainability').innerText = '✓ In Progress';
        document.getElementById('status-sustainability').style.color = '#D4AF37';
    }
    window.scrollTo(0, 600);
}

// Foundation Module
function addFoundation() {
    const input = document.getElementById('foundationInput').value;
    const type = document.getElementById('foundationType').value;
    if (!input) return;
    foundationData.push({ input, type, timestamp: new Date().toLocaleTimeString() });
    document.getElementById('foundationInput').value = '';
    renderFoundation();
    updateDashboard();
}

function renderFoundation() {
    const container = document.getElementById('foundationList');
    if (!container) return;
    container.innerHTML = foundationData.map(d => `
        <div class="item-card">
            <h5>${d.type === 'message' ? '💬' : '📋'} ${d.input}</h5>
            <p>🕐 ${d.timestamp}</p>
        </div>
    `).join('');
}

// Growth Module
function addGrowth() {
    const item = document.getElementById('growthItem').value;
    const qty = document.getElementById('growthQty').value;
    const price = document.getElementById('growthPrice').value;
    if (!item || !qty || !price) return;
    growthData.push({ item, qty, price, timestamp: new Date().toLocaleDateString() });
    document.getElementById('growthItem').value = '';
    document.getElementById('growthQty').value = '';
    document.getElementById('growthPrice').value = '';
    renderGrowth();
    updateDashboard();
}

function renderGrowth() {
    const container = document.getElementById('growthList');
    if (!container) return;
    container.innerHTML = growthData.map(d => `
        <div class="item-card">
            <h5>📦 ${d.item}</h5>
            <p>📊 ${d.qty} units • ₱${d.price}</p>
            <p style="color:#666;">📅 ${d.timestamp}</p>
        </div>
    `).join('');
}

// Sustainability Module
function addSustainability() {
    const customer = document.getElementById('sustainCustomer').value;
    const purchase = document.getElementById('sustainPurchase').value;
    const amount = document.getElementById('sustainAmount').value;
    if (!customer || !purchase || !amount) return;
    sustainabilityData.push({ customer, purchase, amount, timestamp: new Date().toLocaleDateString() });
    document.getElementById('sustainCustomer').value = '';
    document.getElementById('sustainPurchase').value = '';
    document.getElementById('sustainAmount').value = '';
    renderSustainability();
    updateDashboard();
}

function renderSustainability() {
    const container = document.getElementById('sustainList');
    if (!container) return;
    container.innerHTML = sustainabilityData.map(d => `
        <div class="item-card">
            <h5>👤 ${d.customer}</h5>
            <p>🛒 ${d.purchase} • ₱${d.amount}</p>
            <p style="color:#666;">📅 ${d.timestamp}</p>
        </div>
    `).join('');
}

// Update Dashboard
function updateDashboard() {
    document.getElementById('dashboard-report').classList.remove('hidden');
    document.getElementById('report-talk').innerText = foundationData.length;
    document.getElementById('report-manage').innerText = growthData.length;
    document.getElementById('report-track').innerText = sustainabilityData.length;
    
    const revenue = sustainabilityData.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    document.getElementById('report-revenue').innerText = '₱' + revenue.toLocaleString();
}

// Submit Lead
function submitLead() {
    const name = document.getElementById('leadName').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const business = document.getElementById('leadBusiness').value.trim();
    const painPoints = document.getElementById('leadPainPoints').value.trim();
    const questions = document.getElementById('leadQuestions').value.trim();

    if (!name || !email) { alert('Name and Email required'); return; }

    const leadData = {
        nickname, businessName, selectedIndustry,
        name, email, phone, business, painPoints, questions,
        sessionData: {
            foundation: foundationData.length,
            growth: growthData.length,
            sustainability: sustainabilityData.length
        },
        timestamp: new Date().toISOString()
    };

    const leads = JSON.parse(localStorage.getItem('pin8_demo_leads') || '[]');
    leads.push(leadData);
    localStorage.setItem('pin8_demo_leads', JSON.stringify(leads));

    alert(`✅ Thank you ${name}!\n\nYour information has been received.\n\nWe'll reach out within 48 hours to guide you to the next step.`);

    document.getElementById('leadName').value = '';
    document.getElementById('leadEmail').value = '';
    document.getElementById('leadPhone').value = '';
    document.getElementById('leadBusiness').value = '';
    document.getElementById('leadPainPoints').value = '';
    document.getElementById('leadQuestions').value = '';
}

function logout() {
    location.reload();
}

function showError(msg) {
    const err = document.getElementById('errorMsg');
    err.innerText = msg;
    err.classList.remove('hidden');
    setTimeout(() => err.classList.add('hidden'), 8000);
}

// Console Command
console.log("%c📊 PIN8 DEMO LEADS", "color: #D4AF37; font-size: 20px; font-weight: bold;");
console.log("%cType viewLeads() to see collected data", "color: #888;");

function viewLeads() {
    const leads = JSON.parse(localStorage.getItem('pin8_demo_leads') || '[]');
    console.table(leads);
    return leads;
}
