"""
AI-Powered Cybersecurity Telemetry Analyzer
Uses OpenAI API to generate intelligent insights and recommendations
"""

import json
import pandas as pd
import os
from typing import Dict, List
import requests
from datetime import datetime

class AITelemetryAnalyzer:
    def __init__(self, api_key: str = None, processed_data_path: str = "../data/processed"):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.processed_data_path = processed_data_path
        self.base_url = "https://api.openai.com/v1/chat/completions"
        
        if not self.api_key:
            print("Warning: OpenAI API key not found. Set OPENAI_API_KEY environment variable.")
    
    def call_openai_api(self, prompt: str, model: str = "gpt-3.5-turbo") -> str:
        """Make API call to OpenAI"""
        if not self.api_key:
            return "AI analysis unavailable - no API key configured"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a cybersecurity expert analyzing telemetry data. Provide actionable insights and recommendations."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(self.base_url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"AI analysis error: {str(e)}"
    
    def load_insights_data(self) -> Dict:
        """Load processed insights data"""
        insights_path = os.path.join(self.processed_data_path, "insights_summary.json")
        if os.path.exists(insights_path):
            with open(insights_path, 'r') as f:
                return json.load(f)
        return {}
    
    def load_processed_data(self) -> pd.DataFrame:
        """Load processed telemetry data"""
        data_path = os.path.join(self.processed_data_path, "telemetry_processed.csv")
        if os.path.exists(data_path):
            return pd.read_csv(data_path)
        return pd.DataFrame()
    
    def analyze_threat_patterns(self, df: pd.DataFrame) -> Dict:
        """AI analysis of threat patterns"""
        threat_df = df[df['event_type'] == 'threat_detection'].copy()
        
        if threat_df.empty:
            return {"analysis": "No threat data available for analysis"}
        
        # Prepare data summary for AI
        threat_summary = {
            "total_threats": len(threat_df),
            "threat_types": threat_df['threat_type'].value_counts().to_dict(),
            "severity_distribution": threat_df['severity'].value_counts().to_dict(),
            "false_positive_rate": (threat_df['false_positive'].sum() / len(threat_df)) * 100 if 'false_positive' in threat_df.columns else 0
        }
        
        prompt = f"""
        Analyze the following cybersecurity threat data and provide insights:
        
        Threat Summary:
        - Total threats detected: {threat_summary['total_threats']}
        - Threat types: {threat_summary['threat_types']}
        - Severity levels: {threat_summary['severity_distribution']}
        - False positive rate: {threat_summary['false_positive_rate']:.2f}%
        
        Please provide:
        1. Key threat trends and patterns
        2. Risk assessment
        3. Specific recommendations for threat mitigation
        4. Areas of concern that need immediate attention
        """
        
        ai_analysis = self.call_openai_api(prompt)
        
        return {
            "summary": threat_summary,
            "ai_insights": ai_analysis,
            "generated_at": datetime.now().isoformat()
        }
    
    def analyze_performance_impact(self, df: pd.DataFrame) -> Dict:
        """AI analysis of system performance impact"""
        perf_df = df[df['event_type'] == 'performance'].copy()
        
        if perf_df.empty:
            return {"analysis": "No performance data available for analysis"}
        
        # Calculate performance metrics
        perf_summary = {
            "avg_cpu_usage": perf_df['cpu_usage'].mean() if 'cpu_usage' in perf_df.columns else 0,
            "avg_memory_usage": perf_df['memory_usage'].mean() if 'memory_usage' in perf_df.columns else 0,
            "avg_antivirus_impact": perf_df['antivirus_cpu_impact'].mean() if 'antivirus_cpu_impact' in perf_df.columns else 0,
            "peak_hours": "9-17" if not perf_df.empty else "Unknown"
        }
        
        prompt = f"""
        Analyze the following system performance data related to cybersecurity software:
        
        Performance Metrics:
        - Average CPU usage: {perf_summary['avg_cpu_usage']:.2f}%
        - Average memory usage: {perf_summary['avg_memory_usage']:.2f}%
        - Average antivirus CPU impact: {perf_summary['avg_antivirus_impact']:.2f}%
        - Peak usage hours: {perf_summary['peak_hours']}
        
        Please provide:
        1. Performance impact assessment
        2. User experience implications
        3. Optimization recommendations
        4. Scheduling suggestions for scans and updates
        """
        
        ai_analysis = self.call_openai_api(prompt)
        
        return {
            "summary": perf_summary,
            "ai_insights": ai_analysis,
            "generated_at": datetime.now().isoformat()
        }
    
    def analyze_user_experience(self, df: pd.DataFrame) -> Dict:
        """AI analysis of user experience and feedback"""
        feedback_df = df[df['event_type'] == 'user_feedback'].copy()
        
        if feedback_df.empty:
            return {"analysis": "No user feedback data available for analysis"}
        
        # User experience metrics
        ux_summary = {
            "total_feedback": len(feedback_df),
            "sentiment_distribution": feedback_df['sentiment'].value_counts().to_dict() if 'sentiment' in feedback_df.columns else {},
            "feedback_types": feedback_df['feedback_type'].value_counts().to_dict() if 'feedback_type' in feedback_df.columns else {},
            "resolution_rate": (feedback_df['resolved'].sum() / len(feedback_df)) * 100 if 'resolved' in feedback_df.columns else 0
        }
        
        prompt = f"""
        Analyze the following user experience data for cybersecurity software:
        
        User Feedback Summary:
        - Total feedback received: {ux_summary['total_feedback']}
        - Sentiment distribution: {ux_summary['sentiment_distribution']}
        - Common feedback types: {ux_summary['feedback_types']}
        - Issue resolution rate: {ux_summary['resolution_rate']:.2f}%
        
        Please provide:
        1. User satisfaction assessment
        2. Most critical user pain points
        3. Recommendations to improve user experience
        4. Priority actions for customer success
        """
        
        ai_analysis = self.call_openai_api(prompt)
        
        return {
            "summary": ux_summary,
            "ai_insights": ai_analysis,
            "generated_at": datetime.now().isoformat()
        }
    
    def generate_executive_summary(self, insights_data: Dict) -> Dict:
        """Generate AI-powered executive summary"""
        
        prompt = f"""
        Create an executive summary for cybersecurity telemetry analysis based on:
        
        Overview:
        - Total events: {insights_data.get('overview', {}).get('total_events', 'N/A')}
        - Unique endpoints: {insights_data.get('overview', {}).get('unique_endpoints', 'N/A')}
        - Date range: {insights_data.get('overview', {}).get('date_range', 'N/A')}
        
        Pain Points:
        {json.dumps(insights_data.get('pain_points', {}), indent=2)}
        
        Please provide:
        1. Executive summary (2-3 sentences)
        2. Key metrics and their business impact
        3. Top 3 priority actions
        4. Risk assessment and next steps
        """
        
        ai_summary = self.call_openai_api(prompt)
        
        return {
            "executive_summary": ai_summary,
            "generated_at": datetime.now().isoformat()
        }
    
    def generate_predictive_insights(self, df: pd.DataFrame) -> Dict:
        """Generate predictive insights using AI"""
        
        # Calculate trends
        daily_stats = df.groupby(df['timestamp'].dt.date).size().describe()
        
        prompt = f"""
        Based on cybersecurity telemetry trends, provide predictive insights:
        
        Daily Event Statistics:
        - Average daily events: {daily_stats['mean']:.0f}
        - Standard deviation: {daily_stats['std']:.0f}
        - Minimum daily events: {daily_stats['min']:.0f}
        - Maximum daily events: {daily_stats['max']:.0f}
        
        Please provide:
        1. Trend analysis and predictions
        2. Capacity planning recommendations
        3. Risk forecasting
        4. Resource allocation suggestions
        """
        
        ai_predictions = self.call_openai_api(prompt)
        
        return {
            "trend_analysis": ai_predictions,
            "daily_stats": daily_stats.to_dict(),
            "generated_at": datetime.now().isoformat()
        }
    
    def run_comprehensive_analysis(self) -> Dict:
        """Run complete AI analysis pipeline"""
        print("Starting AI-powered analysis...")
        
        # Load data
        insights_data = self.load_insights_data()
        df = self.load_processed_data()
        
        if df.empty:
            return {"error": "No processed data available for AI analysis"}
        
        # Run different analysis modules
        analysis_results = {
            "threat_analysis": self.analyze_threat_patterns(df),
            "performance_analysis": self.analyze_performance_impact(df),
            "user_experience_analysis": self.analyze_user_experience(df),
            "executive_summary": self.generate_executive_summary(insights_data),
            "predictive_insights": self.generate_predictive_insights(df),
            "analysis_metadata": {
                "total_records_analyzed": len(df),
                "analysis_date": datetime.now().isoformat(),
                "ai_model_used": "gpt-3.5-turbo"
            }
        }
        
        # Save AI analysis results
        output_path = os.path.join(self.processed_data_path, "ai_analysis.json")
        with open(output_path, 'w') as f:
            json.dump(analysis_results, f, indent=2, default=str)
        
        print(f"AI analysis completed and saved to {output_path}")
        return analysis_results
    
    def generate_mock_analysis(self) -> Dict:
        """Generate mock AI analysis when API is not available"""
        mock_analysis = {
            "threat_analysis": {
                "summary": {
                    "total_threats": 12500,
                    "threat_types": {"malware": 4500, "virus": 3200, "trojan": 2800, "spyware": 2000},
                    "false_positive_rate": 12.5
                },
                "ai_insights": "The threat landscape shows elevated malware activity with a concerning false positive rate of 12.5%. Immediate attention needed for signature tuning. Recommend implementing machine learning-based detection to reduce false positives while maintaining security effectiveness.",
                "generated_at": datetime.now().isoformat()
            },
            "performance_analysis": {
                "summary": {
                    "avg_cpu_usage": 45.2,
                    "avg_memory_usage": 32.8,
                    "avg_antivirus_impact": 18.5
                },
                "ai_insights": "System performance shows moderate impact from security software. CPU usage during scans peaks at unacceptable levels. Recommend implementing intelligent scheduling and resource throttling to minimize user impact during business hours.",
                "generated_at": datetime.now().isoformat()
            },
            "user_experience_analysis": {
                "summary": {
                    "total_feedback": 450,
                    "sentiment_distribution": {"negative": 285, "neutral": 120, "positive": 45},
                    "resolution_rate": 68.5
                },
                "ai_insights": "User satisfaction is critically low with 63% negative feedback. Primary complaints center on system slowdown and scan interruptions. Urgent need for UX improvements and proactive communication about security operations.",
                "generated_at": datetime.now().isoformat()
            },
            "executive_summary": {
                "executive_summary": "Cybersecurity telemetry analysis reveals critical areas requiring immediate attention. While threat detection is effective, high false positive rates and performance impact are significantly affecting user satisfaction. Recommend prioritizing machine learning integration and performance optimization to maintain security effectiveness while improving user experience.",
                "generated_at": datetime.now().isoformat()
            },
            "predictive_insights": {
                "trend_analysis": "Based on current patterns, expect 15% increase in daily events over next quarter. Capacity planning should account for peak loads during business hours. Risk forecasting indicates potential user compliance issues if performance problems persist.",
                "generated_at": datetime.now().isoformat()
            }
        }
        
        # Save mock analysis
        output_path = os.path.join(self.processed_data_path, "ai_analysis.json")
        with open(output_path, 'w') as f:
            json.dump(mock_analysis, f, indent=2, default=str)
        
        return mock_analysis

if __name__ == "__main__":
    analyzer = AITelemetryAnalyzer()
    
    # Try to run real analysis first, fall back to mock if needed
    try:
        results = analyzer.run_comprehensive_analysis()
    except Exception as e:
        print(f"AI analysis failed: {e}")
        print("Generating mock analysis for demonstration...")
        results = analyzer.generate_mock_analysis()
    
    print("\n=== AI ANALYSIS SUMMARY ===")
    if "threat_analysis" in results:
        print(f"Threats Analyzed: {results['threat_analysis']['summary']['total_threats']}")
        print(f"False Positive Rate: {results['threat_analysis']['summary']['false_positive_rate']:.1f}%")
    
    print("\n=== EXECUTIVE SUMMARY ===")
    if "executive_summary" in results:
        print(results['executive_summary']['executive_summary'][:200] + "...")
