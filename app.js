// PIN8 DEMO SYSTEM
let selectedIndustry = '';
let businessLogo = '';

// Module Data
window.inventoryData = [];
window.hrData = [];
window.posData = [];
window.logisticsData = [];
window.supplierData = [];
window.warehouseData = [];
window.sizzleData = [];
window.promoData = [];
window.loyaltyData = [];

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
    const names = {
        'retail': 'RETAIL', 'restaurant': 'RESTAURANT', 'refreshments': 'REFRESHMENTS',
        'manufacturing': 'MANUFACTURING', 'services': 'SERVICES', 'production': 'PRODUCTION',
        'logistics': 'DELIVERY LOGISTICS', 'other': 'OTHER'
    };
    document.getElementById('selectedIndustry').innerText = '✅ ' + names[industry] + ' Selected';
}

// Enter Demo
function enterDemo() {
    const nickname = document.getElementById('nickname').value.trim();
    const businessName = document.getElementById('businessName').value.trim();
    const permission = document.getElementById('permissionCheck').checked;
    const code = document.getElementById('accessCode').value.trim();

    if (!nickname) { showError('Please enter a nickname'); return; }
    if (!businessName) { showError('Please enter your business name'); return; }
    if (!selectedIndustry) { showError('Please select your industry'); return; }
    if (!permission) { showError('Please confirm your interest'); return; }
    if (code !== 'TAMBAY369') { showError('Invalid Access Code'); return; }

    document.getElementById('brandedBusinessName').innerText = businessName.toUpperCase();
    document.getElementById('brandedIndustry').innerText = selectedIndustry.toUpperCase();
    document.getElementById('watermark').innerText = nickname + ' • ' + businessName + ' • CONFIDENTIAL';

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
            <h3>📦 FOUNDATION: CORE SYSTEMS</h3>
            <p class="module-title">Inventory • Human Resource • Point of Sales</p>
            <div class="module-tabs">
                <button onclick="showTab('inventory')" class="tab-btn active">📦 Inventory</button>
                <button onclick="showTab('hr')" class="tab-btn">👥 HR</button>
                <button onclick="showTab('pos')" class="tab-btn">💰 POS</button>
            </div>
            <div id="tab-inventory" class="tab-content">
                <input type="text" id="invItem" placeholder="Item Name" />
                <input type="number" id="invQty" placeholder="Quantity" />
                <input type="number" id="invPrice" placeholder="Price (₱)" />
                <button onclick="addInventory()">Add</button>
                <div id="inventoryList" class="item-list"></div>
            </div>
            <div id="tab-hr" class="tab-content hidden">
                <input type="text" id="hrName" placeholder="Employee Name" />
                <input type="text" id="hrPosition" placeholder="Position" />
                <button onclick="addHR()">Add</button>
                <div id="hrList" class="item-list"></div>
            </div>
            <div id="tab-pos" class="tab-content hidden">
                <input type="text" id="posItem" placeholder="Item Sold" />
                <input type="number" id="posAmount" placeholder="Amount (₱)" />
                <button onclick="addPOS()">Record</button>
                <div id="posList" class="item-list"></div>
            </div>
        `;
        document.getElementById('status-foundation').innerText = '✓ In Progress';
        document.getElementById('status-foundation').style.color = '#D4AF37';
    } else if (module === 'growth') {
        content.innerHTML = `
            <h3>🚚 GROWTH: SUPPLY CHAIN</h3>
            <p class="module-title">Logistics • Suppliers • Warehouse</p>
            <div class="module-tabs">
                <button onclick="showTab('logistics')" class="tab-btn active">🚚 Logistics</button>
                <button onclick="showTab('suppliers')" class="tab-btn">🤝 Suppliers</button>
                <button onclick="showTab('warehouse')" class="tab-btn">🏭 Warehouse</button>
            </div>
            <div id="tab-logistics" class="tab-content">
                <input type="text" id="logDelivery" placeholder="Destination" />
                <input type="text" id="logItem" placeholder="Item" />
                <button onclick="addLogistics()">Schedule</button>
                <div id="logisticsList" class="item-list"></div>
            </div>
            <div id="tab-suppliers" class="tab-content hidden">
                <input type="text" id="supName" placeholder="Supplier Name" />
                <input type="text" id="supProduct" placeholder="Product" />
                <button onclick="addSupplier()">Add</button>
                <div id="supplierList" class="item-list"></div>
            </div>
            <div id="tab-warehouse" class="tab-content hidden">
                <input type="text" id="whItem" placeholder="Item" />
                <input type="text" id="whLocation" placeholder="Location" />
                <button onclick="addWarehouse()">Add</button>
                <div id="warehouseList" class="item-list"></div>
            </div>
        `;
        document.getElementById('status-growth').innerText = '✓ In Progress';
        document.getElementById('status-growth').style.color = '#D4AF37';
    } else if (module === 'sustainability') {
        content.innerHTML = `
            <h3>💎 SUSTAINABILITY: CUSTOMER</h3>
            <p class="module-title">Sizzle • Promotions • Loyalty</p>
            <div class="module-tabs">
                <button onclick="showTab('sizzle')" class="tab-btn active">✨ Sizzle</button>
                <button onclick="showTab('promo')" class="tab-btn">🎁 Promotions</button>
                <button onclick="showTab('loyalty')" class="tab-btn">💝 Loyalty</button>
            </div>
            <div id="tab-sizzle" class="tab-content">
                <input type="text" id="sizTitle" placeholder="Update Title" />
                <input type="text" id="sizContent" placeholder="Content" />
                <button onclick="addSizzle()">Post</button>
                <div id="sizzleList" class="item-list"></div>
            </div>
            <div id="tab-promo" class="tab-content hidden">
                <input type="text" id="proName" placeholder="Promo Name" />
                <input type="text" id="proDetails" placeholder="Details" />
                <button onclick="addPromo()">Create</button>
                <div id="promoList" class="item-list"></div>
            </div>
            <div id="tab-loyalty" class="tab-content hidden">
                <input type="text" id="loyCustomer" placeholder="Customer" />
                <input type="text" id="loyPoints" placeholder="Points" />
                <button onclick="addLoyalty()">Add</button>
                <div id="loyaltyList" class="item-list"></div>
            </div>
        `;
        document.getElementById('status-sustainability').innerText = '✓ In Progress';
        document.getElementById('status-sustainability').style.color = '#D4AF37';
    }
    window.scrollTo(0, 600);
}

// Tab Switching
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    event.target.classList.add('active');
}

// FOUNDATION Functions
function addInventory() {
    const item = document.getElementById('invItem').value;
    const qty = document.getElementById('invQty').value;
    const price = document.getElementById('invPrice').value;
    if (!item) return;
    window.inventoryData.push({ item, qty, price });
    document.getElementById('invItem').value = '';
    renderList('inventoryList', window.inventoryData, '📦');
    updateDashboard();
}

function addHR() {
    const name = document.getElementById('hrName').value;
    const pos = document.getElementById('hrPosition').value;
    if (!name) return;
    window.hrData.push({ name, pos });
    document.getElementById('hrName').value = '';
    renderList('hrList', window.hrData, '👤');
    updateDashboard();
}

function addPOS() {
    const item = document.getElementById('posItem').value;
    const amt = document.getElementById('posAmount').value;
    if (!item) return;
    window.posData.push({ item, amt });
    document.getElementById('posItem').value = '';
    renderList('posList', window.posData, '💰');
    updateDashboard();
}

// GROWTH Functions
function addLogistics() {
    const dest = document.getElementById('logDelivery').value;
    const item = document.getElementById('logItem').value;
    if (!dest) return;
    window.logisticsData.push({ dest, item });
    document.getElementById('logDelivery').value = '';
    renderList('logisticsList', window.logisticsData, '🚚');
    updateDashboard();
}

function addSupplier() {
    const name = document.getElementById('supName').value;
    const prod = document.getElementById('supProduct').value;
    if (!name) return;
    window.supplierData.push({ name, prod });
    document.getElementById('supName').value = '';
    renderList('supplierList', window.supplierData, '🤝');
    updateDashboard();
}

function addWarehouse() {
    const item = document.getElementById('whItem').value;
    const loc = document.getElementById('whLocation').value;
    if (!item) return;
    window.warehouseData.push({ item, loc });
    document.getElementById('whItem').value = '';
    renderList('warehouseList', window.warehouseData, '🏭');
    updateDashboard();
}

// SUSTAINABILITY Functions
function addSizzle() {
    const title = document.getElementById('sizTitle').value;
    const content = document.getElementById('sizContent').value;
    if (!title) return;
    window.sizzleData.push({ title, content });
    document.getElementById('sizTitle').value = '';
    renderList('sizzleList', window.sizzleData, '✨');
    updateDashboard();
}

function addPromo() {
    const name = document.getElementById('proName').value;
    const details = document.getElementById('proDetails').value;
    if (!name) return;
    window.promoData.push({ name, details });
    document.getElementById('proName').value = '';
    renderList('promoList', window.promoData, '🎁');
    updateDashboard();
}

function addLoyalty() {
    const customer = document.getElementById('loyCustomer').value;
    const points = document.getElementById('loyPoints').value;
    if (!customer) return;
    window.loyaltyData.push({ customer, points });
    document.getElementById('loyCustomer').value = '';
    renderList('loyaltyList', window.loyaltyData, '💝');
    updateDashboard();
}

// Render List Helper
function renderList(listId, data, icon) {
    const container = document.getElementById(listId);
    if (!container) return;
    container.innerHTML = data.map(d => {
        let html = '<div class="item-card"><h5>' + icon + ' ' + Object.values(d)[0] + '</h5>';
        for (let key in d) {
            if (key !== Object.keys(d)[0]) html += '<p>' + d[key] + '</p>';
        }
        html += '</div>';
        return html;
    }).join('');
}

// Update Dashboard
function updateDashboard() {
    document.getElementById('dashboard-report').classList.remove('hidden');
    const f = window.inventoryData.length + window.hrData.length + window.posData.length;
    const g = window.logisticsData.length + window.supplierData.length + window.warehouseData.length;
    const s = window.sizzleData.length + window.promoData.length + window.loyaltyData.length;
    const rev = window.posData.reduce((sum, d) => sum + (parseFloat(d.amt) || 0), 0);
    
    document.getElementById('report-foundation').innerText = f;
    document.getElementById('report-growth').innerText = g;
    document.getElementById('report-sustainability').innerText = s;
    document.getElementById('report-revenue').innerText = '₱' + rev.toLocaleString();
}

// Submit Lead
function submitLead() {
    const name = document.getElementById('leadName').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    if (!name || !email) { alert('Name and Email required'); return; }
    
    const leadData = {
        name, email,
        business: document.getElementById('leadBusiness').value,
        painPoints: document.getElementById('leadPainPoints').value,
        questions: document.getElementById('leadQuestions').value,
        timestamp: new Date().toISOString()
    };
    
    const leads = JSON.parse(localStorage.getItem('pin8_demo_leads') || '[]');
    leads.push(leadData);
    localStorage.setItem('pin8_demo_leads', JSON.stringify(leads));
    
    alert('✅ Thank you! We will reach out within 48 hours.');
    document.getElementById('leadName').value = '';
    document.getElementById('leadEmail').value = '';
}

function logout() { location.reload(); }

function showError(msg) {
    const err = document.getElementById('errorMsg');
    err.innerText = msg;
    err.classList.remove('hidden');
    setTimeout(() => err.classList.add('hidden'), 8000);
}

console.log("%c📊 PIN8 DEMO LEADS", "color: #D4AF37; font-size: 20px;");
console.log("%cType viewLeads() to see data", "color: #888;");

function viewLeads() {
    const leads = JSON.parse(localStorage.getItem('pin8_demo_leads') || '[]');
    console.table(leads);
    return leads;
}
