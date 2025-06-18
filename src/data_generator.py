"""
Cybersecurity Telemetry Data Generator
Generates realistic antivirus and security telemetry logs for analysis
"""

import json
import csv
import random
import datetime
import os
from typing import List, Dict
import uuid

class TelemetryDataGenerator:
    def __init__(self, config_path: str = None):
        self.endpoints = 50000  # Number of endpoints
        self.daily_events = 15000000  # Daily events
        self.threat_types = [
            "malware", "virus", "trojan", "spyware", "adware", 
            "ransomware", "rootkit", "worm", "suspicious_file", "phishing"
        ]
        self.scan_types = ["scheduled", "on_demand", "real_time", "quick", "full"]
        self.severity_levels = ["low", "medium", "high", "critical"]
        self.departments = ["IT", "Finance", "HR", "Sales", "Marketing", "Operations", "Legal"]
        self.os_types = ["Windows 10", "Windows 11", "macOS", "Linux Ubuntu", "Windows Server"]
        
    def generate_endpoint_info(self) -> Dict:
        """Generate endpoint information"""
        return {
            "endpoint_id": str(uuid.uuid4()),
            "hostname": f"PC-{random.randint(1000, 9999)}",
            "ip_address": f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
            "os": random.choice(self.os_types),
            "department": random.choice(self.departments),
            "last_seen": self.random_timestamp().isoformat(),
            "antivirus_version": f"2024.{random.randint(1, 12)}.{random.randint(1, 30)}"
        }
    
    def random_timestamp(self, days_back: int = 30) -> datetime.datetime:
        """Generate random timestamp within last N days"""
        now = datetime.datetime.now()
        random_days = random.uniform(0, days_back)
        return now - datetime.timedelta(days=random_days)
    
    def generate_scan_event(self, endpoint_id: str) -> Dict:
        """Generate antivirus scan event"""
        start_time = self.random_timestamp()
        duration = random.randint(30, 3600)  # 30 sec to 1 hour
        
        return {
            "event_id": str(uuid.uuid4()),
            "timestamp": start_time.isoformat(),
            "endpoint_id": endpoint_id,
            "event_type": "scan",
            "scan_type": random.choice(self.scan_types),
            "scan_duration": duration,
            "files_scanned": random.randint(10000, 500000),
            "threats_found": random.randint(0, 50),
            "threats_cleaned": random.randint(0, 45),
            "scan_status": random.choices(
                ["completed", "failed", "cancelled"], 
                weights=[85, 10, 5]
            )[0],
            "cpu_usage_avg": round(random.uniform(10, 90), 2),
            "memory_usage_mb": random.randint(100, 2048)
        }
    
    def generate_threat_event(self, endpoint_id: str) -> Dict:
        """Generate threat detection event"""
        return {
            "event_id": str(uuid.uuid4()),
            "timestamp": self.random_timestamp().isoformat(),
            "endpoint_id": endpoint_id,
            "event_type": "threat_detection",
            "threat_type": random.choice(self.threat_types),
            "threat_name": f"Threat.{random.choice(self.threat_types).title()}.{random.randint(1000, 9999)}",
            "file_path": f"C:\\Users\\{random.choice(['admin', 'user', 'guest'])}\\{random.choice(['Downloads', 'Documents', 'Desktop'])}\\suspicious_file_{random.randint(1, 999)}.exe",
            "severity": random.choice(self.severity_levels),
            "action_taken": random.choices(
                ["quarantined", "deleted", "blocked", "allowed"], 
                weights=[40, 30, 20, 10]
            )[0],
            "false_positive": random.choices([True, False], weights=[15, 85])[0]
        }
    
    def generate_performance_event(self, endpoint_id: str) -> Dict:
        """Generate system performance event"""
        return {
            "event_id": str(uuid.uuid4()),
            "timestamp": self.random_timestamp().isoformat(),
            "endpoint_id": endpoint_id,
            "event_type": "performance",
            "cpu_usage": round(random.uniform(5, 95), 2),
            "memory_usage": round(random.uniform(20, 85), 2),
            "disk_usage": round(random.uniform(30, 90), 2),
            "network_usage_kb": random.randint(100, 10000),
            "antivirus_cpu_impact": round(random.uniform(1, 25), 2),
            "boot_time_seconds": random.randint(30, 180)
        }
    
    def generate_user_feedback_event(self, endpoint_id: str) -> Dict:
        """Generate user feedback/complaint event"""
        feedback_types = [
            "slow_performance", "false_positive", "scan_interruption", 
            "update_failure", "interface_issue", "feature_request"
        ]
        
        sentiments = ["negative", "neutral", "positive"]
        feedback_texts = {
            "slow_performance": "System is running very slow during scans",
            "false_positive": "Important file was blocked incorrectly",
            "scan_interruption": "Scan keeps interrupting my work",
            "update_failure": "Updates keep failing to install",
            "interface_issue": "Interface is confusing and hard to use",
            "feature_request": "Need better scheduling options"
        }
        
        feedback_type = random.choice(feedback_types)
        
        return {
            "event_id": str(uuid.uuid4()),
            "timestamp": self.random_timestamp().isoformat(),
            "endpoint_id": endpoint_id,
            "event_type": "user_feedback",
            "feedback_type": feedback_type,
            "feedback_text": feedback_texts[feedback_type],
            "sentiment": random.choices(sentiments, weights=[60, 25, 15])[0],
            "priority": random.choice(["low", "medium", "high"]),
            "resolved": random.choices([True, False], weights=[70, 30])[0]
        }
    
    def generate_daily_logs(self, date: datetime.date, num_events: int = 50000) -> List[Dict]:
        """Generate a day's worth of telemetry logs"""
        events = []
        
        # Generate endpoint pool for the day
        active_endpoints = random.sample(
            [f"endpoint_{i}" for i in range(self.endpoints)], 
            k=min(num_events // 10, self.endpoints)
        )
        
        for _ in range(num_events):
            endpoint_id = random.choice(active_endpoints)
            
            # Event type distribution
            event_type = random.choices(
                ["scan", "threat_detection", "performance", "user_feedback"],
                weights=[40, 25, 30, 5]
            )[0]
            
            if event_type == "scan":
                event = self.generate_scan_event(endpoint_id)
            elif event_type == "threat_detection":
                event = self.generate_threat_event(endpoint_id)
            elif event_type == "performance":
                event = self.generate_performance_event(endpoint_id)
            else:
                event = self.generate_user_feedback_event(endpoint_id)
            
            events.append(event)
        
        return events
    
    def save_to_json(self, data: List[Dict], filename: str):
        """Save data to JSON file"""
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
    
    def save_to_csv(self, data: List[Dict], filename: str):
        """Save data to CSV file"""
        if not data:
            return
        
        # Get all possible fieldnames from all records
        all_fieldnames = set()
        for record in data:
            all_fieldnames.update(record.keys())
        
        fieldnames = sorted(list(all_fieldnames))
        
        with open(filename, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            # Write each row, filling missing fields with None/empty
            for row in data:
                complete_row = {field: row.get(field, None) for field in fieldnames}
                writer.writerow(complete_row)
    
    def generate_sample_datasets(self, output_dir: str = "data/raw"):
        """Generate sample datasets for different time periods"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate 7 days of data
        for i in range(7):
            date = datetime.date.today() - datetime.timedelta(days=i)
            events = self.generate_daily_logs(date, num_events=random.randint(45000, 55000))
            
            # Save as both JSON and CSV
            date_str = date.strftime("%Y%m%d")
            self.save_to_json(events, f"{output_dir}/telemetry_{date_str}.json")
            self.save_to_csv(events, f"{output_dir}/telemetry_{date_str}.csv")
            
            print(f"Generated {len(events)} events for {date}")
        
        # Generate endpoint registry
        endpoints = []
        for i in range(1000):  # Sample of endpoints
            endpoints.append(self.generate_endpoint_info())
        
        self.save_to_json(endpoints, f"{output_dir}/endpoints_registry.json")
        self.save_to_csv(endpoints, f"{output_dir}/endpoints_registry.csv")
        
        print(f"Generated {len(endpoints)} endpoint records")

if __name__ == "__main__":
    generator = TelemetryDataGenerator()
    generator.generate_sample_datasets("../data/raw")
    print("Data generation completed!")
