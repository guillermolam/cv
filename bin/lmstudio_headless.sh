#!/bin/bash

# Stop LM Studio server if it's running
lms server stop

# Start LM Studio daemon
lms daemon up

# Start LM Studio server
lms server start

# Download model (uncomment to use)
# lms get openai/gpt-oss-20b

# Check if LM Studio server is running
curl -s http://localhost:1234/v1/models | grep -q "gpt-oss-20b"
if [ $? -eq 0 ]; then
    echo "LM Studio server is running with model gpt-oss-20b"
else
    echo "LM Studio server is running but model gpt-oss-20b not found."
fi

# Create service in macOS (requires sudo)
sudo launchctl unload /Library/LaunchDaemons/lmstudio.service.plist
sudo launchctl load /Library/LaunchDaemons/lmstudio.service.plist