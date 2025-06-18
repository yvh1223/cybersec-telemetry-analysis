#!/bin/bash
# Setup script for Cybersecurity Telemetry Analysis Project

echo "🚀 Setting up Cybersecurity Telemetry Analysis Project"
echo "======================================================"

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1)
echo "   $python_version"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📦 Installing requirements..."
pip install -r requirements.txt

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "   1. Activate environment: source venv/bin/activate"
echo "   2. Run demo: python main.py --demo"
echo "   3. View dashboard: open web/index.html"
echo ""
echo "🔑 Optional: Set OpenAI API key for real AI analysis:"
echo "   export OPENAI_API_KEY='your-api-key-here'"
echo ""