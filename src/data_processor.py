"""
Data Processor for Cybersecurity Telemetry Analysis
Cleans, processes, and prepares raw telemetry data for analysis
"""

import pandas as pd
import json
import os
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, List, Tuple

class TelemetryDataProcessor:
    def __init__(self, raw_data_path: str = "../data/raw", processed_data_path: str = "../data/processed"):
        self.raw_data_path = raw_data_path
        self.processed_data_path = processed_data_path
        os.makedirs(processed_data_path, exist_ok=True)
    
    def load_raw_data(self) -> pd.DataFrame:
        """Load all raw telemetry data files"""
        all_data = []
        
        for filename in os.listdir(self.raw_data_path):
            if filename.startswith("telemetry_") and filename.endswith(".csv"):
                file_path = os.path.join(self.raw_data_path, filename)
                df = pd.read_csv(file_path)
                all_data.append(df)
        
        if all_data:
            combined_df = pd.concat(all_data, ignore_index=True)
            return combined_df
        else:
            return pd.DataFrame()
    
    def load_endpoints_data(self) -> pd.DataFrame:
        """Load endpoints registry data"""
        endpoints_path = os.path.join(self.raw_data_path, "endpoints_registry.csv")
        if os.path.exists(endpoints_path):
            return pd.read_csv(endpoints_path)
        return pd.DataFrame()
    
    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and validate the telemetry data"""
        print(f"Original data shape: {df.shape}")
        
        # Convert timestamp to datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Remove duplicates
        df = df.drop_duplicates(subset=['event_id'])
        
        # Remove rows with missing critical fields
        critical_fields = ['event_id', 'timestamp', 'endpoint_id', 'event_type']
        df = df.dropna(subset=critical_fields)
        
        # Fill missing values for numeric columns
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        df[numeric_columns] = df[numeric_columns].fillna(0)
        
        # Fill missing values for string columns
        string_columns = df.select_dtypes(include=['object']).columns
        for col in string_columns:
            if col not in critical_fields:
                df[col] = df[col].fillna('unknown')
        
        print(f"Cleaned data shape: {df.shape}")
        return df
    
    def create_aggregated_metrics(self, df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
        """Create aggregated metrics for different analysis levels"""
        aggregated_data = {}
        
        # Daily aggregations
        daily_agg = df.groupby(df['timestamp'].dt.date).agg({
            'event_id': 'count',
            'endpoint_id': 'nunique',
            'cpu_usage_avg': 'mean',
            'memory_usage_mb': 'mean'
        }).reset_index()
        daily_agg.rename(columns={'event_id': 'total_events', 'endpoint_id': 'active_endpoints'}, inplace=True)
        aggregated_data['daily_metrics'] = daily_agg
        
        # Endpoint-level aggregations
        endpoint_agg = df.groupby('endpoint_id').agg({
            'event_id': 'count',
            'threats_found': 'sum',
            'threats_cleaned': 'sum',
            'scan_duration': 'mean',
            'cpu_usage_avg': 'mean',
            'false_positive': lambda x: x.sum() if x.dtype == bool else 0
        }).reset_index()
        endpoint_agg.rename(columns={'event_id': 'total_events'}, inplace=True)
        aggregated_data['endpoint_metrics'] = endpoint_agg
        
        # Threat analysis
        threat_df = df[df['event_type'] == 'threat_detection'].copy()
        if not threat_df.empty:
            threat_agg = threat_df.groupby(['threat_type', 'severity']).agg({
                'event_id': 'count',
                'false_positive': lambda x: x.sum() if x.dtype == bool else 0
            }).reset_index()
            threat_agg.rename(columns={'event_id': 'threat_count'}, inplace=True)
            aggregated_data['threat_analysis'] = threat_agg
        
        # Performance metrics
        perf_df = df[df['event_type'] == 'performance'].copy()
        if not perf_df.empty:
            perf_agg = perf_df.groupby(perf_df['timestamp'].dt.hour).agg({
                'cpu_usage': 'mean',
                'memory_usage': 'mean',
                'antivirus_cpu_impact': 'mean'
            }).reset_index()
            aggregated_data['hourly_performance'] = perf_agg
        
        return aggregated_data
    
    def identify_pain_points(self, df: pd.DataFrame) -> Dict[str, any]:
        """Identify key pain points from the data"""
        pain_points = {}
        
        # High false positive rate
        threat_df = df[df['event_type'] == 'threat_detection'].copy()
        if not threat_df.empty and 'false_positive' in threat_df.columns:
            false_positive_rate = threat_df['false_positive'].mean() * 100
            pain_points['false_positive_rate'] = {
                'value': round(false_positive_rate, 2),
                'threshold': 10,  # 10% threshold
                'status': 'critical' if false_positive_rate > 10 else 'normal'
            }
        
        # System performance impact
        perf_df = df[df['event_type'] == 'performance'].copy()
        if not perf_df.empty and 'antivirus_cpu_impact' in perf_df.columns:
            avg_cpu_impact = perf_df['antivirus_cpu_impact'].mean()
            pain_points['avg_cpu_impact'] = {
                'value': round(avg_cpu_impact, 2),
                'threshold': 15,  # 15% threshold
                'status': 'warning' if avg_cpu_impact > 15 else 'normal'
            }
        
        # Scan failure rate
        scan_df = df[df['event_type'] == 'scan'].copy()
        if not scan_df.empty and 'scan_status' in scan_df.columns:
            failure_rate = (scan_df['scan_status'] != 'completed').mean() * 100
            pain_points['scan_failure_rate'] = {
                'value': round(failure_rate, 2),
                'threshold': 5,  # 5% threshold
                'status': 'critical' if failure_rate > 5 else 'normal'
            }
        
        # User satisfaction (based on feedback)
        feedback_df = df[df['event_type'] == 'user_feedback'].copy()
        if not feedback_df.empty and 'sentiment' in feedback_df.columns:
            negative_feedback_rate = (feedback_df['sentiment'] == 'negative').mean() * 100
            pain_points['negative_feedback_rate'] = {
                'value': round(negative_feedback_rate, 2),
                'threshold': 30,  # 30% threshold
                'status': 'warning' if negative_feedback_rate > 30 else 'normal'
            }
        
        return pain_points
    
    def generate_insights_summary(self, df: pd.DataFrame, pain_points: Dict) -> Dict:
        """Generate summary insights for executive dashboard"""
        total_events = len(df)
        unique_endpoints = df['endpoint_id'].nunique()
        date_range = f"{df['timestamp'].min().date()} to {df['timestamp'].max().date()}"
        
        # Calculate key metrics
        threat_events = len(df[df['event_type'] == 'threat_detection'])
        scan_events = len(df[df['event_type'] == 'scan'])
        
        summary = {
            'overview': {
                'total_events': total_events,
                'unique_endpoints': unique_endpoints,
                'date_range': date_range,
                'threat_events': threat_events,
                'scan_events': scan_events
            },
            'pain_points': pain_points,
            'recommendations': self.generate_recommendations(pain_points)
        }
        
        return summary
    
    def generate_recommendations(self, pain_points: Dict) -> List[str]:
        """Generate recommendations based on identified pain points"""
        recommendations = []
        
        for metric, data in pain_points.items():
            if data['status'] in ['warning', 'critical']:
                if metric == 'false_positive_rate':
                    recommendations.append("Implement machine learning-based threat detection to reduce false positives")
                elif metric == 'avg_cpu_impact':
                    recommendations.append("Optimize scan scheduling during off-peak hours to reduce system impact")
                elif metric == 'scan_failure_rate':
                    recommendations.append("Investigate scan failure root causes and improve error handling")
                elif metric == 'negative_feedback_rate':
                    recommendations.append("Enhance user experience and provide better communication about security actions")
        
        if not recommendations:
            recommendations.append("System performance is within acceptable parameters - continue monitoring")
        
        return recommendations
    
    def save_processed_data(self, df: pd.DataFrame, aggregated_data: Dict, insights: Dict):
        """Save all processed data to files"""
        # Save main processed dataset
        df.to_csv(os.path.join(self.processed_data_path, "telemetry_processed.csv"), index=False)
        df.to_json(os.path.join(self.processed_data_path, "telemetry_processed.json"), orient='records', indent=2)
        
        # Save aggregated datasets
        for name, data in aggregated_data.items():
            data.to_csv(os.path.join(self.processed_data_path, f"{name}.csv"), index=False)
            data.to_json(os.path.join(self.processed_data_path, f"{name}.json"), orient='records', indent=2)
        
        # Save insights
        with open(os.path.join(self.processed_data_path, "insights_summary.json"), 'w') as f:
            json.dump(insights, f, indent=2, default=str)
        
        print(f"Processed data saved to {self.processed_data_path}")
    
    def process_all_data(self):
        """Main processing pipeline"""
        print("Starting data processing pipeline...")
        
        # Load raw data
        raw_df = self.load_raw_data()
        if raw_df.empty:
            print("No raw data found!")
            return
        
        # Clean data
        cleaned_df = self.clean_data(raw_df)
        
        # Create aggregations
        aggregated_data = self.create_aggregated_metrics(cleaned_df)
        
        # Identify pain points
        pain_points = self.identify_pain_points(cleaned_df)
        
        # Generate insights
        insights = self.generate_insights_summary(cleaned_df, pain_points)
        
        # Save processed data
        self.save_processed_data(cleaned_df, aggregated_data, insights)
        
        print("Data processing completed!")
        return insights

if __name__ == "__main__":
    processor = TelemetryDataProcessor()
    insights = processor.process_all_data()
    
    if insights:
        print("\n=== KEY INSIGHTS ===")
        print(f"Total Events: {insights['overview']['total_events']:,}")
        print(f"Unique Endpoints: {insights['overview']['unique_endpoints']:,}")
        print(f"Date Range: {insights['overview']['date_range']}")
        
        print("\n=== PAIN POINTS ===")
        for metric, data in insights['pain_points'].items():
            status_icon = "🔴" if data['status'] == 'critical' else "🟡" if data['status'] == 'warning' else "🟢"
            print(f"{status_icon} {metric}: {data['value']}% (threshold: {data['threshold']}%)")
        
        print("\n=== RECOMMENDATIONS ===")
        for i, rec in enumerate(insights['recommendations'], 1):
            print(f"{i}. {rec}")
