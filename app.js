const PROXY_URL = "https://simple-proxy.mayor.workers.dev/?destination=";

// Theme toggle functionality
document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
});

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

// Form submission handler
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const playerId = document.getElementById('playerId').value.trim();
    const serverId = document.getElementById('serverId').value.trim();
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error');
    const playerInfoDiv = document.getElementById('playerInfo');
    
    // Hide previous results/errors
    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    
    try {
        if (!playerId) throw 'Player ID is required';
        if (!serverId) throw 'Server ID is required';
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Searching...';
        
        // Make API request with proper CORS headers
        const response = await fetch(`${PROXY_URL}https://moogold.com/wp-content/plugins/id-validation-new/id-validation-ajax.php`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Referer': 'https://moogold.com/product/mobile-legends/',
                'Origin': 'https://moogold.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                "attribute_amount": "Weekly Pass",
                "text-5f6f144f8ffee": playerId,
                "text-1601115253775": serverId,
                "quantity": 1,
                "add-to-cart": 15145,
                "product_id": 15145,
                "variation_id": 4690783
            })
        });
        
        const data = await response.json();
        
        if (!data.message) throw 'Invalid Player ID or Server ID';
        
        // Parse and display results
        const playerData = parseObject(data.message);
        displayPlayerInfo(playerData);
        
        resultsDiv.classList.remove('hidden');
    } catch (error) {
        errorDiv.querySelector('p').textContent = error;
        errorDiv.classList.remove('hidden');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Search';
    }
});

// Helper function to parse API response
function parseObject(str) {
    const lines = str.split("\n");
    const data = {};
    
    lines.forEach(line => {
        const [key, value] = line.split(":");
        if (key && value) {
            data[key.trim().toLowerCase().replace(/ /g, "-")] = value.trim();
        }
    });
    
    return data;
}

// Display player information
function displayPlayerInfo(data) {
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = '';
    
    for (const [key, value] of Object.entries(data)) {
        const formattedKey = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const infoItem = document.createElement('div');
        infoItem.innerHTML = `<span class="font-medium">${formattedKey}:</span> ${value}`;
        playerInfoDiv.appendChild(infoItem);
    }
}
