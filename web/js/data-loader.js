// Data Loader for Cybersecurity Dashboard
class DataLoader {
    constructor() {
        this.baseDataPath = '../data/processed/';
        this.cachedData = {};
    }

    async loadInsightsSummary() {
        try {
            const response = await fetch(this.baseDataPath + 'insights_summary.json');
            if (!response.ok) {
                throw new Error('Failed to load insights summary');
            }
            const data = await response.json();
            this.cachedData.insights = data;
            return data;
        } catch (error) {
            console.warn('Could not load insights summary:', error);
            return this.getMockInsights();
        }
    }

    async loadAIAnalysis() {
        try {
            const response = await fetch(this.baseDataPath + 'ai_analysis.json');
            if (!response.ok) {
                throw new Error('Failed to load AI analysis');
            }
            const data = await response.json();
            this.cachedData.aiAnalysis = data;
            return data;
        } catch (error) {
            console.warn('Could not load AI analysis:', error);
            return this.getMockAIAnalysis();
        }
    }

    getMockInsights() {
        return {
            overview: {
                total_events: 347582,
                unique_endpoints: 49823,
                date_range: "2025-06-11 to 2025-06-17",
                threat_events: 12458,
                scan_events: 234567
            },
            pain_points: {
                false_positive_rate: { value: 12.5, threshold: 10, status: "critical" },
                avg_cpu_impact: { value: 18.5, threshold: 15, status: "warning" },
                scan_failure_rate: { value: 3.2, threshold: 5, status: "normal" },
                negative_feedback_rate: { value: 35.7, threshold: 30, status: "warning" }
            },
            recommendations: [
                "Implement machine learning-based threat detection to reduce false positives",
                "Optimize scan scheduling during off-peak hours",
                "Deploy intelligent resource throttling for real-time protection",
                "Enhance user communication about security operations"
            ]
        };
    }

    getMockAIAnalysis() {
        return {
            threat_analysis: {
                summary: {
                    total_threats: 12458,
                    threat_types: {
                        malware: 4500,
                        virus: 3200,
                        trojan: 2800,
                        spyware: 1800,
                        ransomware: 158
                    },
                    false_positive_rate: 12.5
                },
                ai_insights: "The threat landscape shows elevated malware activity with a concerning false positive rate of 12.5%. Immediate attention needed for signature tuning."
            },
            performance_analysis: {
                summary: {
                    avg_cpu_usage: 45.2,
                    avg_memory_usage: 32.8,
                    avg_antivirus_impact: 18.5
                },
                ai_insights: "System performance shows moderate impact from security software. CPU usage during scans peaks at unacceptable levels."
            },
            executive_summary: {
                executive_summary: "Cybersecurity telemetry analysis reveals critical areas requiring immediate attention. While threat detection effectiveness is high at 94.2%, elevated false positive rates and system performance impact are significantly affecting user productivity.",
                generated_at: new Date().toISOString()
            }
        };
    }

    // Utility method to check if running locally vs GitHub Pages
    isLocalEnvironment() {
        return window.location.protocol === 'file:' || 
               window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }

    // Update data paths for GitHub Pages deployment
    updatePathForEnvironment() {
        if (!this.isLocalEnvironment()) {
            // Running on GitHub Pages - adjust paths
            this.baseDataPath = './data/processed/';
        }
    }
}

// Global data loader instance
window.dataLoader = new DataLoader();