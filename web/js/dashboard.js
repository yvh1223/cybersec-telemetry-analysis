// Dashboard Main JavaScript
class CyberSecDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.data = {};
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.showLoading();
        
        // Simulate data loading
        setTimeout(() => {
            this.hideLoading();
            this.renderDashboard();
        }, 2000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Time range selector
        const timeRange = document.getElementById('timeRange');
        if (timeRange) {
            timeRange.addEventListener('change', () => {
                this.updateCharts();
            });
        }

        // Refresh button
        window.refreshData = () => {
            this.showLoading();
            setTimeout(() => {
                this.loadData();
                this.renderDashboard();
                this.hideLoading();
            }, 1500);
        };

        // Export functionality
        window.exportData = () => {
            this.exportDashboardData();
        };
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.classList.add('fade-in');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;
        
        // Render section-specific content
        if (sectionName === 'threats') {
            this.renderThreatTable();
        }
    }

    loadData() {
        // Simulate loading data (in real implementation, this would fetch from API/files)
        this.data = {
            overview: {
                totalEvents: 347582,
                activeEndpoints: 49823,
                threatsDetected: 12458,
                criticalIssues: 23,
                falsePositiveRate: 12.5,
                scanSuccessRate: 94.2,
                avgResponseTime: 245
            },
            threats: {
                totalThreats: 12458,
                quarantined: 11847,
                falsePositives: 234,
                recentDetections: this.generateRecentThreats()
            },
            performance: {
                cpuImpact: 18.5,
                memoryUsage: 32.8,
                avgScanDuration: 45
            },
            aiInsights: {
                executiveSummary: "Cybersecurity telemetry analysis reveals critical areas requiring immediate attention. While threat detection effectiveness is high at 94.2%, elevated false positive rates (12.5%) and system performance impact during peak hours are significantly affecting user productivity and satisfaction.",
                recommendations: [
                    "Implement machine learning-based threat detection to reduce false positives by 40%",
                    "Optimize scan scheduling during off-peak hours to minimize business impact",
                    "Deploy intelligent resource throttling for real-time protection",
                    "Enhance user communication and transparency about security operations"
                ],
                painPoints: [
                    "High false positive rate causing productivity loss",
                    "System performance degradation during business hours",
                    "User complaints about scan interruptions",
                    "Delayed threat response due to alert fatigue"
                ],
                predictions: "Based on current patterns, expect 15% increase in daily events over next quarter. Machine learning integration could reduce false positives by 60% while improving detection accuracy."
            }
        };
    }

    generateRecentThreats() {
        const threatTypes = ['malware', 'virus', 'trojan', 'spyware', 'ransomware'];
        const severities = ['low', 'medium', 'high', 'critical'];
        const actions = ['quarantined', 'deleted', 'blocked', 'allowed'];
        const threats = [];

        for (let i = 0; i < 10; i++) {
            const timestamp = new Date(Date.now() - Math.random() * 86400000 * 7); // Last 7 days
            threats.push({
                timestamp: timestamp.toLocaleString(),
                threatType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
                severity: severities[Math.floor(Math.random() * severities.length)],
                endpoint: `PC-${Math.floor(Math.random() * 9999) + 1000}`,
                action: actions[Math.floor(Math.random() * actions.length)]
            });
        }

        return threats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    renderDashboard() {
        this.updateHeaderStats();
        this.updateMetricCards();
        this.updateAIInsights();
        this.initializeCharts();
    }

    updateHeaderStats() {
        const totalEvents = document.getElementById('totalEvents');
        const activeEndpoints = document.getElementById('activeEndpoints');
        const threatsDetected = document.getElementById('threatsDetected');

        if (totalEvents) totalEvents.textContent = this.formatNumber(this.data.overview.totalEvents);
        if (activeEndpoints) activeEndpoints.textContent = this.formatNumber(this.data.overview.activeEndpoints);
        if (threatsDetected) threatsDetected.textContent = this.formatNumber(this.data.overview.threatsDetected);
    }

    updateMetricCards() {
        const criticalIssues = document.getElementById('criticalIssues');
        const falsePositives = document.getElementById('falsePositives');
        const scanSuccess = document.getElementById('scanSuccess');
        const responseTime = document.getElementById('responseTime');

        if (criticalIssues) criticalIssues.textContent = this.data.overview.criticalIssues;
        if (falsePositives) falsePositives.textContent = this.data.overview.falsePositiveRate + '%';
        if (scanSuccess) scanSuccess.textContent = this.data.overview.scanSuccessRate + '%';
        if (responseTime) responseTime.textContent = this.data.overview.avgResponseTime + 'ms';
    }

    updateAIInsights() {
        const executiveSummary = document.getElementById('executiveSummary');
        const recommendationsList = document.getElementById('recommendationsList');
        const painPointsList = document.getElementById('painPointsList');
        const predictiveInsights = document.getElementById('predictiveInsights');

        if (executiveSummary) {
            executiveSummary.textContent = this.data.aiInsights.executiveSummary;
        }

        if (recommendationsList) {
            recommendationsList.innerHTML = this.data.aiInsights.recommendations
                .map(rec => `<li>${rec}</li>`)
                .join('');
        }

        if (painPointsList) {
            painPointsList.innerHTML = this.data.aiInsights.painPoints
                .map(point => `<div class="pain-point-item">⚠️ ${point}</div>`)
                .join('');
        }

        if (predictiveInsights) {
            predictiveInsights.textContent = this.data.aiInsights.predictions;
        }
    }

    renderThreatTable() {
        const tbody = document.getElementById('threatTableBody');
        if (!tbody) return;

        const rows = this.data.threats.recentDetections.map(threat => {
            const severityClass = this.getSeverityClass(threat.severity);
            return `
                <tr>
                    <td>${threat.timestamp}</td>
                    <td>${threat.threatType}</td>
                    <td><span class="severity-badge ${severityClass}">${threat.severity}</span></td>
                    <td>${threat.endpoint}</td>
                    <td>${threat.action}</td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = rows;
    }

    getSeverityClass(severity) {
        const classes = {
            'low': 'severity-low',
            'medium': 'severity-medium',
            'high': 'severity-high',
            'critical': 'severity-critical'
        };
        return classes[severity] || 'severity-low';
    }

    initializeCharts() {
        this.createDailyEventsChart();
        this.createThreatTypesChart();
        this.createSeverityChart();
        this.createThreatTrendsChart();
        this.createHourlyPerformanceChart();
        this.createEndpointPerformanceChart();
        this.createPerformanceGauges();
    }

    createDailyEventsChart() {
        const ctx = document.getElementById('dailyEventsChart');
        if (!ctx) return;

        const data = this.generateDailyEventsData();
        
        this.charts.dailyEvents = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Events',
                    data: data.values,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    },
                    y: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    }
                }
            }
        });
    }

    createThreatTypesChart() {
        const ctx = document.getElementById('threatTypesChart');
        if (!ctx) return;

        this.charts.threatTypes = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Malware', 'Virus', 'Trojan', 'Spyware', 'Ransomware'],
                datasets: [{
                    data: [4500, 3200, 2800, 1800, 158],
                    backgroundColor: [
                        '#ff6b35',
                        '#f7931e',
                        '#ffeb3b',
                        '#4caf50',
                        '#2196f3'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    createSeverityChart() {
        const ctx = document.getElementById('severityChart');
        if (!ctx) return;

        this.charts.severity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Critical', 'High', 'Medium', 'Low'],
                datasets: [{
                    label: 'Threats',
                    data: [234, 1847, 6234, 4143],
                    backgroundColor: [
                        '#dc3545',
                        '#ff6b35',
                        '#ffc107',
                        '#28a745'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    },
                    y: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    }
                }
            }
        });
    }

    createThreatTrendsChart() {
        const ctx = document.getElementById('threatTrendsChart');
        if (!ctx) return;

        const data = this.generateThreatTrendsData();
        
        this.charts.threatTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Threats Detected',
                        data: data.threats,
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'False Positives',
                        data: data.falsePositives,
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    },
                    y: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    }
                }
            }
        });
    }

    createHourlyPerformanceChart() {
        const ctx = document.getElementById('hourlyPerformanceChart');
        if (!ctx) return;

        const data = this.generateHourlyPerformanceData();
        
        this.charts.hourlyPerformance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'CPU Usage %',
                        data: data.cpu,
                        borderColor: '#ff6b35',
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Memory Usage %',
                        data: data.memory,
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    },
                    y: {
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    }
                }
            }
        });
    }

    createEndpointPerformanceChart() {
        const ctx = document.getElementById('endpointPerformanceChart');
        if (!ctx) return;

        this.charts.endpointPerformance = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Endpoints',
                    data: this.generateEndpointPerformanceData(),
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'CPU Impact %',
                            color: '#b8b8b8'
                        },
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Memory Usage %',
                            color: '#b8b8b8'
                        },
                        ticks: { color: '#b8b8b8' },
                        grid: { color: '#444444' }
                    }
                }
            }
        });
    }

    createPerformanceGauges() {
        this.createGauge('cpuGauge', this.data.performance.cpuImpact, 'CPU Impact');
        this.createGauge('memoryGauge', this.data.performance.memoryUsage, 'Memory Usage');
        this.createGauge('scanGauge', (this.data.performance.avgScanDuration / 60), 'Scan Duration');
    }

    createGauge(canvasId, value, label) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const maxValue = canvasId === 'scanGauge' ? 2 : 100; // 2 hours for scan duration
        const percentage = (value / maxValue) * 100;
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [
                        this.getGaugeColor(percentage),
                        '#444444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }

    getGaugeColor(percentage) {
        if (percentage < 30) return '#28a745';
        if (percentage < 60) return '#ffc107';
        return '#dc3545';
    }

    generateDailyEventsData() {
        const labels = [];
        const values = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            values.push(Math.floor(Math.random() * 10000) + 40000);
        }
        
        return { labels, values };
    }

    generateThreatTrendsData() {
        const labels = [];
        const threats = [];
        const falsePositives = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            const threatCount = Math.floor(Math.random() * 2000) + 1000;
            threats.push(threatCount);
            falsePositives.push(Math.floor(threatCount * (Math.random() * 0.2 + 0.05))); // 5-25% false positives
        }
        
        return { labels, threats, falsePositives };
    }

    generateHourlyPerformanceData() {
        const labels = [];
        const cpu = [];
        const memory = [];
        
        for (let hour = 0; hour < 24; hour++) {
            labels.push(`${hour}:00`);
            
            // Simulate higher usage during business hours
            const isBusinessHour = hour >= 9 && hour <= 17;
            const baseCpu = isBusinessHour ? 35 : 15;
            const baseMemory = isBusinessHour ? 45 : 25;
            
            cpu.push(baseCpu + Math.random() * 20);
            memory.push(baseMemory + Math.random() * 15);
        }
        
        return { labels, cpu, memory };
    }

    generateEndpointPerformanceData() {
        const data = [];
        
        for (let i = 0; i < 50; i++) {
            data.push({
                x: Math.random() * 40 + 5, // CPU impact 5-45%
                y: Math.random() * 60 + 20  // Memory usage 20-80%
            });
        }
        
        return data;
    }

    updateCharts() {
        // Update charts based on time range selection
        const timeRange = document.getElementById('timeRange')?.value;
        console.log('Updating charts for time range:', timeRange);
        
        // Regenerate data for new time range
        Object.keys(this.charts).forEach(chartKey => {
            if (this.charts[chartKey]) {
                this.charts[chartKey].update();
            }
        });
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    exportDashboardData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            dashboard_data: this.data
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cybersec_dashboard_export_${new Date().getTime()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Add severity badge styles
const style = document.createElement('style');
style.textContent = `
    .severity-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .severity-critical {
        background: #dc3545;
        color: white;
    }
    
    .severity-high {
        background: #ff6b35;
        color: white;
    }
    
    .severity-medium {
        background: #ffc107;
        color: black;
    }
    
    .severity-low {
        background: #28a745;
        color: white;
    }
    
    .pain-point-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
    }

    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberSecDashboard();
});