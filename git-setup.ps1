# Git setup script for ascend.ai project
Set-Location "C:\Users\Admin\Documents\ascend.ai"

# Initialize git repository
& "C:\Program Files\Git\bin\git.exe" init

# Add all files
& "C:\Program Files\Git\bin\git.exe" add .

# Create initial commit
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Ascend.ai TikTok management platform"

Write-Host "Git repository initialized and initial commit created"
