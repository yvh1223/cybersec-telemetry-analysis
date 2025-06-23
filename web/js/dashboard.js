/**
 * McAfee Cybersecurity Dashboard JavaScript
 * Author: Yallappa Huchchannavar
 * LinkedIn: https://www.linkedin.com/in/yallappa/
 */

class CybersecurityDashboard {
    constructor() {
        this.charts = {};
        this.data = this.generateMockData();
        this.telemetryGrid = new TelemetryGridManager();
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.populateMetrics();
        this.createCharts();
        this.animateCounters();
    }

    generateMockData() {
        return {
            summary: {
                totalDevices: 100000,
                totalScans: 520000,
                totalThreats: 15980,
                avgScanDuration: 8.4,
                threatDetectionRate: 3.1
            },
            threats: {
                byType: {
                    'Malware': 6290,
                    'PUP': 5030,
                    'Trojan': 2695,
                    'Ransomware': 1795,
                    'Spyware': 1440,
                    'Adware': 720
                },
                byRegion: {
                    'North America': 8085,
                    'Europe': 5390,
                    'Asia Pacific': 3595,
                    'Latin America': 900
                },
                timeline: this.generateTimelineData()
            },
            performance: {
                hourlyScans: this.generateHourlyData(),
                devicePerformance: {
                    mobile: 6.2,
                    desktop: 10.8
                },
                resourceUsage: {
                    cpu: [45, 32, 67, 23, 89, 56, 34],
                    memory: [234, 187, 345, 156, 289, 267, 198],
                    battery: [12, 8, 15, 6, 18, 11, 9]
                }
            }
        };
    }

    generateTimelineData() {
        const data = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                threats: Math.floor(Math.random() * 50) + 80
            });
        }
        return data;
    }

    generateHourlyData() {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            let baseActivity = 100;
            if (i >= 9 && i <= 17) {
                baseActivity = 200;
            } else if (i >= 6 && i <= 9 || i >= 17 && i <= 22) {
                baseActivity = 150;
            }
            hours.push({
                hour: i,
                scans: baseActivity + Math.floor(Math.random() * 100)
            });
        }
        return hours;
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Initialize telemetry grid when tab becomes active
                if (targetTab === 'telemetry-grid') {
                    setTimeout(() => this.telemetryGrid.initializeGrid(), 100);
                } else {
                    setTimeout(() => this.refreshChartsInTab(targetTab), 100);
                }
            });
        });
    }

    populateMetrics() {
        this.animateCounter('totalDevices', this.data.summary.totalDevices);
        this.animateCounter('totalScans', this.data.summary.totalScans);
        this.animateCounter('threatsFound', this.data.summary.totalThreats);
        
        document.getElementById('detectionRate').textContent = `${this.data.summary.threatDetectionRate}%`;
        document.getElementById('avgScanTime').textContent = this.data.summary.avgScanDuration;
        document.getElementById('malwareDetected').textContent = this.data.threats.byType.Malware.toLocaleString();
        document.getElementById('pupDetected').textContent = this.data.threats.byType.PUP.toLocaleString();
        document.getElementById('trojanDetected').textContent = this.data.threats.byType.Trojan.toLocaleString();
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let current = 0;
        const increment = targetValue / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 20);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.metric-value, .stat-value');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const value = parseInt(target.textContent.replace(/,/g, ''));
                    if (value > 0) {
                        this.animateCounter(target.id || 'temp', value);
                    }
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    createCharts() {
        this.createThreatTimelineChart();
        this.createHourlyChart();
        this.createRegionalChart();
        this.createThreatTypesChart();
        this.createDetectionTrendsChart();
        this.createResourceChart();
        this.createDevicePerformanceChart();
        this.createPredictiveChart();
    }

    createThreatTimelineChart() {
        const ctx = document.getElementById('threatTimelineChart');
        if (!ctx) return;

        this.charts.threatTimeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.threats.timeline.map(d => {
                    const date = new Date(d.date);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Threats Detected',
                    data: this.data.threats.timeline.map(d => d.threats),
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
                    x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
                }
            }
        });
    }

    createHourlyChart() {
        const ctx = document.getElementById('hourlyChart');
        if (!ctx) return;

        this.charts.hourly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.performance.hourlyScans.map(d => `${d.hour}:00`),
                datasets: [{
                    label: 'Scans',
                    data: this.data.performance.hourlyScans.map(d => d.scans),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
                    x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
                }
            }
        });
    }

    createRegionalChart() {
        const ctx = document.getElementById('regionalChart');
        if (!ctx) return;

        const regions = Object.keys(this.data.threats.byRegion);
        const values = Object.values(this.data.threats.byRegion);

        this.charts.regional = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: regions,
                datasets: [{
                    data: values,
                    backgroundColor: ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'],
                    borderWidth: 2,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } }
                }
            }
        });
    }

    createThreatTypesChart() {
        const ctx = document.getElementById('threatTypesChart');
        if (!ctx) return;

        if (this.charts.threatTypes) {
            this.charts.threatTypes.destroy();
        }

        const types = Object.keys(this.data.threats.byType);
        const values = Object.values(this.data.threats.byType);

        this.charts.threatTypes = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: types,
                datasets: [{
                    data: values,
                    backgroundColor: ['#ef4444', '#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#f97316'],
                    borderWidth: 2,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'right', labels: { color: '#cbd5e1' } }
                }
            }
        });
    }

    createDetectionTrendsChart() {
        const ctx = document.getElementById('detectionTrendsChart');
        if (!ctx) return;

        if (this.charts.detectionTrends) {
            this.charts.detectionTrends.destroy();
        }

        this.charts.detectionTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Malware',
                        data: [2250, 2600, 2400, 3050],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'PUP',
                        data: [1900, 2100, 1750, 2250],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'top', labels: { color: '#cbd5e1' } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
                    x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
                }
            }
        });
    }

    createResourceChart() {
        const ctx = document.getElementById('resourceChart');
        if (!ctx) return;

        this.charts.resource = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'CPU Usage %',
                        data: this.data.performance.resourceUsage.cpu,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        pointBackgroundColor: '#ef4444'
                    },
                    {
                        label: 'Memory Usage (scaled)',
                        data: this.data.performance.resourceUsage.memory.map(v => v/4),
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.2)',
                        pointBackgroundColor: '#06b6d4'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { color: '#cbd5e1' } } },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: { color: '#334155' },
                        pointLabels: { color: '#cbd5e1' },
                        ticks: { color: '#cbd5e1' }
                    }
                }
            }
        });
    }

    createDevicePerformanceChart() {
        const ctx = document.getElementById('devicePerformanceChart');
        if (!ctx) return;

        if (this.charts.devicePerformance) {
            this.charts.devicePerformance.destroy();
        }

        this.charts.devicePerformance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mobile (60,000)', 'Desktop (40,000)'],
                datasets: [{
                    label: 'Avg Scan Duration (min)',
                    data: [
                        this.data.performance.devicePerformance.mobile,
                        this.data.performance.devicePerformance.desktop
                    ],
                    backgroundColor: ['#06b6d4', '#3b82f6'],
                    borderColor: ['#0891b2', '#2563eb'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
                    x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
                }
            }
        });
    }

    createPredictiveChart() {
        const ctx = document.getElementById('predictiveChart');
        if (!ctx) return;

        if (this.charts.predictive) {
            this.charts.predictive.destroy();
        }

        this.charts.predictive = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Current Performance',
                        data: [75000, 78000, 82000, 79000, 85000, 88000],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'AI-Enhanced Prediction',
                        data: [88000, 92000, 95000, 98000, 102000, 105000],
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'top', labels: { color: '#cbd5e1' } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
                    x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
                }
            }
        });
    }

    refreshChartsInTab(tabName) {
        // Add a delay to ensure DOM elements are visible
        setTimeout(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart && chart.canvas && chart.canvas.offsetParent !== null) {
                    try {
                        chart.resize();
                        chart.update();
                    } catch (error) {
                        console.warn('Chart resize error:', error);
                    }
                }
            });
        }, 200);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CybersecurityDashboard();
});

// Add some utility functions for enhanced interactivity
function addTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = event.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Telemetry Grid Manager Class
 * Handles enterprise-level telemetry monitoring with 500K+ logs/day
 */
class TelemetryGridManager {
    constructor() {
        this.endpoints = [];
        this.filteredEndpoints = [];
        this.selectedEndpoint = null;
        this.activityFeed = [];
        this.isActivityPaused = false;
        this.realtimeChart = null;
        this.issueChart = null;
        this.tooltip = null;
        this.activityInterval = null;
        
        this.generateTelemetryData();
        this.setupEventListeners();
        this.startActivitySimulation();
    }

    generateTelemetryData() {
        const regions = ['north-america', 'europe', 'asia-pacific', 'latin-america'];
        const deviceTypes = ['mobile', 'desktop'];
        const statuses = ['operational', 'performance', 'errors'];
        
        // Generate 100,000 endpoints with realistic distribution
        for (let i = 1; i <= 100000; i++) {
            const region = regions[Math.floor(Math.random() * regions.length)];
            const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
            
            // Realistic status distribution: 85% operational, 12% performance, 3% errors
            let status;
            const rand = Math.random();
            if (rand < 0.85) status = 'operational';
            else if (rand < 0.97) status = 'performance';
            else status = 'errors';
            
            // Add time-based patterns (more issues during business hours)
            const currentHour = new Date().getHours();
            if (currentHour >= 9 && currentHour <= 17) {
                if (Math.random() < 0.15) {
                    status = Math.random() < 0.7 ? 'performance' : 'errors';
                }
            }

            this.endpoints.push({
                id: `EP-${String(i).padStart(6, '0')}`,
                region,
                deviceType,
                status,
                lastScan: this.generateRandomTimestamp(),
                cpuUsage: Math.floor(Math.random() * 100),
                memoryUsage: Math.floor(Math.random() * 100),
                batteryLevel: deviceType === 'mobile' ? Math.floor(Math.random() * 100) : null,
                threatsDetected: Math.floor(Math.random() * 10),
                scanDuration: Math.floor(Math.random() * 20) + 5,
                version: `McAfee-${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
                ipAddress: this.generateRandomIP(),
                location: this.generateLocation(region),
                uptime: Math.floor(Math.random() * 8760) + 1, // hours in a year
                errorCode: status === 'errors' ? this.generateErrorCode() : null,
                performanceIssue: status === 'performance' ? this.generatePerformanceIssue() : null
            });
        }
        
        this.filteredEndpoints = [...this.endpoints];
        this.updateStats();
    }

    generateRandomTimestamp() {
        const now = new Date();
        const randomMinutes = Math.floor(Math.random() * 60 * 24); // Last 24 hours
        return new Date(now.getTime() - randomMinutes * 60 * 1000);
    }

    generateRandomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    generateLocation(region) {
        const locations = {
            'north-america': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Toronto', 'Vancouver'],
            'europe': ['London', 'Paris', 'Berlin', 'Madrid', 'Rome', 'Amsterdam'],
            'asia-pacific': ['Tokyo', 'Singapore', 'Sydney', 'Seoul', 'Mumbai', 'Bangkok'],
            'latin-america': ['São Paulo', 'Mexico City', 'Buenos Aires', 'Lima', 'Santiago', 'Bogotá']
        };
        const regionLocations = locations[region] || ['Unknown'];
        return regionLocations[Math.floor(Math.random() * regionLocations.length)];
    }

    generateErrorCode() {
        const errorCodes = ['ERR_001', 'ERR_002', 'ERR_005', 'ERR_012', 'ERR_025', 'ERR_031'];
        return errorCodes[Math.floor(Math.random() * errorCodes.length)];
    }

    generatePerformanceIssue() {
        const issues = ['High CPU Usage', 'Memory Leak', 'Slow Scan Speed', 'Battery Drain', 'Network Timeout'];
        return issues[Math.floor(Math.random() * issues.length)];
    }

    setupEventListeners() {
        // Filter controls
        document.getElementById('regionFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('deviceFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter')?.addEventListener('change', () => this.applyFilters());
        
        // Control buttons
        document.getElementById('refreshGrid')?.addEventListener('click', () => this.refreshGrid());
        document.getElementById('exportData')?.addEventListener('click', () => this.exportData());
        
        // Activity controls
        document.getElementById('pauseActivity')?.addEventListener('click', () => this.toggleActivity());
        document.getElementById('clearActivity')?.addEventListener('click', () => this.clearActivity());
        
        // Detail actions
        document.getElementById('viewLogs')?.addEventListener('click', () => this.viewLogs());
        document.getElementById('runDiagnostic')?.addEventListener('click', () => this.runDiagnostic());
    }

    applyFilters() {
        const regionFilter = document.getElementById('regionFilter')?.value || 'all';
        const deviceFilter = document.getElementById('deviceFilter')?.value || 'all';
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';
        
        this.filteredEndpoints = this.endpoints.filter(endpoint => {
            return (regionFilter === 'all' || endpoint.region === regionFilter) &&
                   (deviceFilter === 'all' || endpoint.deviceType === deviceFilter) &&
                   (statusFilter === 'all' || endpoint.status === statusFilter);
        });
        
        this.updateStats();
        this.renderGrid();
    }

    updateStats() {
        const operational = this.filteredEndpoints.filter(e => e.status === 'operational').length;
        const performance = this.filteredEndpoints.filter(e => e.status === 'performance').length;
        const errors = this.filteredEndpoints.filter(e => e.status === 'errors').length;
        const total = this.filteredEndpoints.length;
        
        document.getElementById('operationalCount').textContent = operational.toLocaleString();
        document.getElementById('performanceCount').textContent = performance.toLocaleString();
        document.getElementById('errorCount').textContent = errors.toLocaleString();
        document.getElementById('totalEndpoints').textContent = total.toLocaleString();
    }

    renderGrid() {
        const container = document.getElementById('telemetryGridContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Limit display to first 2000 endpoints for performance
        const displayEndpoints = this.filteredEndpoints.slice(0, 2000);
        
        // Organize by region and device type for better visualization
        const organizedEndpoints = this.organizeEndpointsForDisplay(displayEndpoints);
        
        organizedEndpoints.forEach(endpoint => {
            const box = document.createElement('div');
            box.className = `grid-box ${endpoint.status}`;
            box.dataset.endpointId = endpoint.id;
            
            // Add hover tooltip
            box.addEventListener('mouseenter', (e) => this.showTooltip(e, endpoint));
            box.addEventListener('mouseleave', () => this.hideTooltip());
            
            // Add click handler
            box.addEventListener('click', () => this.selectEndpoint(endpoint));
            
            container.appendChild(box);
        });
    }

    organizeEndpointsForDisplay(endpoints) {
        // Sort endpoints by region and device type for better grid organization
        return endpoints.sort((a, b) => {
            // First sort by device type (desktop first, then mobile)
            if (a.deviceType !== b.deviceType) {
                return a.deviceType === 'desktop' ? -1 : 1;
            }
            // Then sort by region
            const regionOrder = ['north-america', 'europe', 'asia-pacific', 'latin-america'];
            const aRegionIndex = regionOrder.indexOf(a.region);
            const bRegionIndex = regionOrder.indexOf(b.region);
            return aRegionIndex - bRegionIndex;
        });
    }

    showTooltip(event, endpoint) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'grid-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${endpoint.id}</div>
            <div class="tooltip-content">
                <div class="tooltip-row">
                    <span class="tooltip-label">Status:</span>
                    <span class="tooltip-value">${endpoint.status}</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Device:</span>
                    <span class="tooltip-value">${endpoint.deviceType}</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Location:</span>
                    <span class="tooltip-value">${endpoint.location}</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">CPU:</span>
                    <span class="tooltip-value">${endpoint.cpuUsage}%</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
        
        this.tooltip = tooltip;
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }

    selectEndpoint(endpoint) {
        // Remove previous selection
        document.querySelectorAll('.grid-box.selected').forEach(box => {
            box.classList.remove('selected');
        });
        
        // Add selection to current box
        const box = document.querySelector(`[data-endpoint-id="${endpoint.id}"]`);
        if (box) {
            box.classList.add('selected');
        }
        
        this.selectedEndpoint = endpoint;
        this.showEndpointDetails(endpoint);
        this.updateDetailCharts(endpoint);
    }

    showEndpointDetails(endpoint) {
        const container = document.getElementById('detailsContent');
        if (!container) return;
        
        const statusClass = endpoint.status;
        const lastScanTime = endpoint.lastScan.toLocaleString();
        
        container.innerHTML = `
            <div class="endpoint-details">
                <div class="detail-row">
                    <span class="detail-label">Endpoint ID:</span>
                    <span class="detail-value">${endpoint.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge ${statusClass}">${endpoint.status}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Device Type:</span>
                    <span class="detail-value">${endpoint.deviceType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${endpoint.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">IP Address:</span>
                    <span class="detail-value">${endpoint.ipAddress}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">McAfee Version:</span>
                    <span class="detail-value">${endpoint.version}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Last Scan:</span>
                    <span class="detail-value">${lastScanTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">CPU Usage:</span>
                    <span class="detail-value">${endpoint.cpuUsage}%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Memory Usage:</span>
                    <span class="detail-value">${endpoint.memoryUsage}%</span>
                </div>
                ${endpoint.batteryLevel ? `
                <div class="detail-row">
                    <span class="detail-label">Battery Level:</span>
                    <span class="detail-value">${endpoint.batteryLevel}%</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Threats Detected:</span>
                    <span class="detail-value">${endpoint.threatsDetected}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Scan Duration:</span>
                    <span class="detail-value">${endpoint.scanDuration} min</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Uptime:</span>
                    <span class="detail-value">${endpoint.uptime} hours</span>
                </div>
                ${endpoint.errorCode ? `
                <div class="detail-row">
                    <span class="detail-label">Error Code:</span>
                    <span class="detail-value" style="color: var(--danger-color);">${endpoint.errorCode}</span>
                </div>
                ` : ''}
                ${endpoint.performanceIssue ? `
                <div class="detail-row">
                    <span class="detail-label">Performance Issue:</span>
                    <span class="detail-value" style="color: var(--warning-color);">${endpoint.performanceIssue}</span>
                </div>
                ` : ''}
            </div>
        `;
    }

    updateDetailCharts(endpoint) {
        this.createRealtimeChart(endpoint);
        this.createIssueDistributionChart();
    }

    createRealtimeChart(endpoint) {
        const ctx = document.getElementById('realtimeChart');
        if (!ctx) return;
        
        if (this.realtimeChart) {
            this.realtimeChart.destroy();
        }
        
        // Generate realistic time series data
        const timeLabels = [];
        const cpuData = [];
        const memoryData = [];
        
        for (let i = 11; i >= 0; i--) {
            const time = new Date();
            time.setMinutes(time.getMinutes() - i * 5);
            timeLabels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            
            cpuData.push(Math.max(0, Math.min(100, endpoint.cpuUsage + (Math.random() - 0.5) * 20)));
            memoryData.push(Math.max(0, Math.min(100, endpoint.memoryUsage + (Math.random() - 0.5) * 15)));
        }
        
        this.realtimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    {
                        label: 'CPU %',
                        data: cpuData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Memory %',
                        data: memoryData,
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#cbd5e1', font: { size: 10 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: '#334155' },
                        ticks: { color: '#cbd5e1', font: { size: 10 } }
                    },
                    x: {
                        grid: { color: '#334155' },
                        ticks: { color: '#cbd5e1', font: { size: 10 } }
                    }
                }
            }
        });
    }

    createIssueDistributionChart() {
        const ctx = document.getElementById('issueDistributionChart');
        if (!ctx) return;
        
        if (this.issueChart) {
            this.issueChart.destroy();
        }
        
        const operational = this.filteredEndpoints.filter(e => e.status === 'operational').length;
        const performance = this.filteredEndpoints.filter(e => e.status === 'performance').length;
        const errors = this.filteredEndpoints.filter(e => e.status === 'errors').length;
        
        this.issueChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Operational', 'Performance Issues', 'Errors'],
                datasets: [{
                    data: [operational, performance, errors],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#cbd5e1', font: { size: 10 } }
                    }
                }
            }
        });
    }

    startActivitySimulation() {
        this.activityInterval = setInterval(() => {
            if (!this.isActivityPaused) {
                this.generateActivityItem();
            }
        }, 3000); // New activity every 3 seconds
    }

    generateActivityItem() {
        const activities = [
            { type: 'scan_completed', icon: 'fas fa-check-circle', title: 'Scan Completed' },
            { type: 'threat_detected', icon: 'fas fa-exclamation-triangle', title: 'Threat Detected' },
            { type: 'update_installed', icon: 'fas fa-download', title: 'Update Installed' },
            { type: 'performance_alert', icon: 'fas fa-tachometer-alt', title: 'Performance Alert' },
            { type: 'policy_updated', icon: 'fas fa-shield-alt', title: 'Policy Updated' }
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const endpoint = this.endpoints[Math.floor(Math.random() * this.endpoints.length)];
        
        const activityItem = {
            id: Date.now(),
            ...activity,
            endpoint: endpoint.id,
            location: endpoint.location,
            status: endpoint.status,
            time: new Date(),
            description: this.generateActivityDescription(activity.type, endpoint)
        };
        
        this.activityFeed.unshift(activityItem);
        if (this.activityFeed.length > 50) {
            this.activityFeed = this.activityFeed.slice(0, 50);
        }
        
        this.renderActivityFeed();
    }

    generateActivityDescription(type, endpoint) {
        const descriptions = {
            scan_completed: `Full system scan completed on ${endpoint.deviceType} device in ${endpoint.location}`,
            threat_detected: `${endpoint.threatsDetected || Math.floor(Math.random() * 5) + 1} threats detected and quarantined`,
            update_installed: `McAfee definitions updated to latest version on ${endpoint.deviceType}`,
            performance_alert: `High ${endpoint.performanceIssue || 'CPU usage'} detected on endpoint`,
            policy_updated: `Security policy applied to ${endpoint.deviceType} device`
        };
        return descriptions[type] || 'Activity logged';
    }

    renderActivityFeed() {
        const container = document.getElementById('activityFeed');
        if (!container) return;
        
        container.innerHTML = this.activityFeed.map(item => `
            <div class="activity-item ${item.status}">
                <div class="activity-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${item.title} - ${item.endpoint}</div>
                    <div class="activity-description">${item.description}</div>
                </div>
                <div class="activity-time">
                    ${item.time.toLocaleTimeString()}
                </div>
            </div>
        `).join('');
    }

    refreshGrid() {
        // Add loading animation
        const button = document.getElementById('refreshGrid');
        const icon = button.querySelector('i');
        icon.classList.add('fa-spin');
        
        setTimeout(() => {
            this.generateTelemetryData();
            this.applyFilters();
            this.renderGrid();
            icon.classList.remove('fa-spin');
            
            // Add activity
            this.activityFeed.unshift({
                id: Date.now(),
                type: 'system',
                icon: 'fas fa-sync-alt',
                title: 'Grid Refreshed',
                endpoint: 'SYSTEM',
                location: 'All Regions',
                status: 'operational',
                time: new Date(),
                description: 'Telemetry grid data refreshed with latest endpoint status'
            });
            this.renderActivityFeed();
        }, 1000);
    }

    exportData() {
        const csvData = this.generateCSVData();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `telemetry_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Add activity
        this.activityFeed.unshift({
            id: Date.now(),
            type: 'export',
            icon: 'fas fa-download',
            title: 'Data Exported',
            endpoint: 'SYSTEM',
            location: 'Local',
            status: 'operational',
            time: new Date(),
            description: `Exported ${this.filteredEndpoints.length} endpoint records to CSV`
        });
        this.renderActivityFeed();
    }

    generateCSVData() {
        const headers = ['ID', 'Region', 'Device Type', 'Status', 'Location', 'IP Address', 'CPU Usage', 'Memory Usage', 'Threats Detected', 'Last Scan'];
        const rows = this.filteredEndpoints.map(endpoint => [
            endpoint.id,
            endpoint.region,
            endpoint.deviceType,
            endpoint.status,
            endpoint.location,
            endpoint.ipAddress,
            endpoint.cpuUsage,
            endpoint.memoryUsage,
            endpoint.threatsDetected,
            endpoint.lastScan.toISOString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    toggleActivity() {
        this.isActivityPaused = !this.isActivityPaused;
        const button = document.getElementById('pauseActivity');
        const icon = button.querySelector('i');
        
        if (this.isActivityPaused) {
            button.innerHTML = '<i class="fas fa-play"></i> Resume';
        } else {
            button.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }

    clearActivity() {
        this.activityFeed = [];
        this.renderActivityFeed();
    }

    viewLogs() {
        if (!this.selectedEndpoint) return;
        
        // Simulate opening logs view
        alert(`Opening detailed logs for ${this.selectedEndpoint.id}...\n\nThis would typically open a detailed log viewer with:\n- Real-time log streaming\n- Search and filtering capabilities\n- Historical log analysis\n- Performance metrics`);
    }

    runDiagnostic() {
        if (!this.selectedEndpoint) return;
        
        // Simulate diagnostic run
        const button = document.getElementById('runDiagnostic');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            
            alert(`Diagnostic completed for ${this.selectedEndpoint.id}:\n\n✓ System scan: Passed\n✓ Network connectivity: Good\n✓ Performance metrics: Normal\n${this.selectedEndpoint.status === 'errors' ? '⚠ Error detected: ' + this.selectedEndpoint.errorCode : ''}\n${this.selectedEndpoint.status === 'performance' ? '⚠ Performance issue: ' + this.selectedEndpoint.performanceIssue : ''}`);
        }, 2000);
    }

    // Initialize the grid when the tab becomes active
    initializeGrid() {
        this.renderGrid();
        this.createDefaultCharts();
    }

    createDefaultCharts() {
        // Create default charts when no endpoint is selected
        this.createDefaultRealtimeChart();
        this.createIssueDistributionChart();
    }

    createDefaultRealtimeChart() {
        const ctx = document.getElementById('realtimeChart');
        if (!ctx) return;
        
        if (this.realtimeChart) {
            this.realtimeChart.destroy();
        }
        
        // Generate sample data for visualization
        const timeLabels = [];
        const cpuData = [];
        const memoryData = [];
        
        for (let i = 11; i >= 0; i--) {
            const time = new Date();
            time.setMinutes(time.getMinutes() - i * 5);
            timeLabels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            
            cpuData.push(Math.floor(Math.random() * 60) + 20);
            memoryData.push(Math.floor(Math.random() * 50) + 30);
        }
        
        this.realtimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    {
                        label: 'Avg CPU %',
                        data: cpuData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Avg Memory %',
                        data: memoryData,
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#cbd5e1', font: { size: 10 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: '#334155' },
                        ticks: { color: '#cbd5e1', font: { size: 10 } }
                    },
                    x: {
                        grid: { color: '#334155' },
                        ticks: { color: '#cbd5e1', font: { size: 10 } }
                    }
                }
            }
        });
    }
}

// Export for potential use in other modules
window.CybersecurityDashboard = CybersecurityDashboard;
window.TelemetryGridManager = TelemetryGridManager;
