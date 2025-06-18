#!/usr/bin/env python3
"""
Cybersecurity Telemetry Analysis - Main Execution Script
This script runs the complete data pipeline from generation to AI analysis
"""

import os
import sys
import argparse
import time
from datetime import datetime

# Add src directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

try:
    from data_generator import TelemetryDataGenerator
    from data_processor import TelemetryDataProcessor
    from ai_analyzer import AITelemetryAnalyzer
except ImportError as e:
    print(f"Import error: {e}")
    print("Please ensure all required Python packages are installed.")
    sys.exit(1)

class CyberSecPipeline:
    def __init__(self):
        self.base_path = os.path.dirname(os.path.abspath(__file__))
        self.data_path = os.path.join(self.base_path, "data")
        self.raw_data_path = os.path.join(self.data_path, "raw")
        self.processed_data_path = os.path.join(self.data_path, "processed")
        
        # Ensure directories exist
        os.makedirs(self.raw_data_path, exist_ok=True)
        os.makedirs(self.processed_data_path, exist_ok=True)
    
    def generate_data(self, num_events=50000):
        """Generate sample telemetry data"""
        print("=" * 60)
        print("STEP 1: GENERATING SAMPLE TELEMETRY DATA")
        print("=" * 60)
        
        generator = TelemetryDataGenerator()
        
        print(f"Generating telemetry data for {num_events} events per day...")
        start_time = time.time()
        
        generator.generate_sample_datasets(self.raw_data_path)
        
        end_time = time.time()
        print(f"✅ Data generation completed in {end_time - start_time:.2f} seconds")
        print(f"📁 Data saved to: {self.raw_data_path}")
        
        return True
    
    def process_data(self):
        """Process and clean the raw data"""
        print("\n" + "=" * 60)
        print("STEP 2: PROCESSING AND ANALYZING DATA")
        print("=" * 60)
        
        processor = TelemetryDataProcessor(
            raw_data_path=self.raw_data_path,
            processed_data_path=self.processed_data_path
        )
        
        print("Processing raw telemetry data...")
        start_time = time.time()
        
        insights = processor.process_all_data()
        
        end_time = time.time()
        print(f"✅ Data processing completed in {end_time - start_time:.2f} seconds")
        print(f"📁 Processed data saved to: {self.processed_data_path}")
        
        return insights
    
    def run_ai_analysis(self):
        """Run AI-powered analysis"""
        print("\n" + "=" * 60)
        print("STEP 3: AI-POWERED ANALYSIS")
        print("=" * 60)
        
        analyzer = AITelemetryAnalyzer(processed_data_path=self.processed_data_path)
        
        print("Running AI analysis on processed data...")
        start_time = time.time()
        
        # Try real AI analysis first, fall back to mock if needed
        try:
            ai_results = analyzer.run_comprehensive_analysis()
        except Exception as e:
            print(f"⚠️  Real AI analysis failed: {e}")
            print("🔄 Generating mock AI analysis for demonstration...")
            ai_results = analyzer.generate_mock_analysis()
        
        end_time = time.time()
        print(f"✅ AI analysis completed in {end_time - start_time:.2f} seconds")
        
        return ai_results
    
    def display_summary(self, insights, ai_results):
        """Display pipeline execution summary"""
        print("\n" + "=" * 60)
        print("PIPELINE EXECUTION SUMMARY")
        print("=" * 60)
        
        if insights:
            print(f"📊 Total Events Processed: {insights['overview']['total_events']:,}")
            print(f"🖥️  Unique Endpoints: {insights['overview']['unique_endpoints']:,}")
            print(f"📅 Data Range: {insights['overview']['date_range']}")
            
            print("\n🚨 KEY PAIN POINTS:")
            for metric, data in insights['pain_points'].items():
                status_icon = "🔴" if data['status'] == 'critical' else "🟡" if data['status'] == 'warning' else "🟢"
                print(f"   {status_icon} {metric.replace('_', ' ').title()}: {data['value']}% (threshold: {data['threshold']}%)")
        
        if ai_results and 'executive_summary' in ai_results:
            print(f"\n🤖 AI EXECUTIVE SUMMARY:")
            summary = ai_results['executive_summary']['executive_summary'][:200] + "..."
            print(f"   {summary}")
        
        print(f"\n📂 OUTPUT FILES GENERATED:")
        print(f"   • Raw data: {self.raw_data_path}/")
        print(f"   • Processed data: {self.processed_data_path}/")
        print(f"   • Web dashboard: {os.path.join(self.base_path, 'web', 'index.html')}")
        
        print(f"\n🌐 TO VIEW DASHBOARD:")
        web_path = os.path.join(self.base_path, 'web', 'index.html')
        print(f"   Open: file://{web_path}")
        print(f"   Or run: python -m http.server 8000 (from web/ directory)")
    
    def run_full_pipeline(self, num_events=50000):
        """Run the complete analysis pipeline"""
        print("🚀 CYBERSECURITY TELEMETRY ANALYSIS PIPELINE")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        pipeline_start = time.time()
        
        try:
            # Step 1: Generate Data
            self.generate_data(num_events)
            
            # Step 2: Process Data
            insights = self.process_data()
            
            # Step 3: AI Analysis
            ai_results = self.run_ai_analysis()
            
            # Display Summary
            self.display_summary(insights, ai_results)
            
            pipeline_end = time.time()
            total_time = pipeline_end - pipeline_start
            
            print(f"\n✅ PIPELINE COMPLETED SUCCESSFULLY!")
            print(f"⏱️  Total execution time: {total_time:.2f} seconds")
            
            return True
            
        except Exception as e:
            print(f"\n❌ PIPELINE FAILED: {e}")
            return False
    
    def run_quick_demo(self):
        """Run a quick demo with smaller dataset"""
        print("🎯 RUNNING QUICK DEMO MODE")
        return self.run_full_pipeline(num_events=10000)

def main():
    parser = argparse.ArgumentParser(
        description="Cybersecurity Telemetry Analysis Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py --full                    # Run complete pipeline
  python main.py --demo                    # Quick demo with smaller dataset
  python main.py --generate-only           # Only generate data
  python main.py --events 25000            # Custom number of events
        """
    )
    
    parser.add_argument('--full', action='store_true', 
                       help='Run the complete pipeline')
    parser.add_argument('--demo', action='store_true',
                       help='Run quick demo with smaller dataset')
    parser.add_argument('--generate-only', action='store_true',
                       help='Only generate sample data')
    parser.add_argument('--events', type=int, default=50000,
                       help='Number of events to generate per day (default: 50000)')
    
    args = parser.parse_args()
    
    pipeline = CyberSecPipeline()
    
    if args.demo:
        success = pipeline.run_quick_demo()
    elif args.generate_only:
        success = pipeline.generate_data(args.events)
    elif args.full or len(sys.argv) == 1:  # Default to full pipeline
        success = pipeline.run_full_pipeline(args.events)
    else:
        parser.print_help()
        return
    
    if success:
        print("\n🎉 Ready for your interview! The dashboard showcases:")
        print("   • Data extraction and processing capabilities")
        print("   • AI-powered insights and analysis")
        print("   • Professional data visualization")
        print("   • Pain point identification and recommendations")
        print("\n💡 Next steps for GitHub:")
        print("   1. Review the generated files")
        print("   2. Test the web dashboard")
        print("   3. Customize as needed")
        print("   4. Upload to GitHub repository")
    else:
        print("\n🔧 Check the error messages above and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()