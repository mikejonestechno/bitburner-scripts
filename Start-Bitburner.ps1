# Once only need to build the docker container
# docker build -t bitburnerscripts:latest .

# If docker not running then start docker
if ((Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue) -eq $null) {
    Write-Output "Starting Docker..."
    Start-Process -FilePath "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Start-Sleep -Seconds 5
} else {
    Write-Output "Docker process already running."
}

Write-Output "Starting bitburnerscripts container..."
docker run --rm -d -v "C:\Users\mikej\github\bitburner-scripts\src:/app/src" -p 12525:12525 --name bitburnerscripts bitburnerscripts npm run watch

# If VS Code not running start VS Code
if ((Get-Process -Name "Visual Studio Code" -ErrorAction SilentlyContinue) -eq $null) {
    Write-Output "Starting VSCode..."
    Start-Process -FilePath "C:\Program Files\Microsoft VS Code\code.exe" -ArgumentList "./bitburner-scripts.code-workspace"
} else {
    Write-Output "VS Code process already running."
}

# If bitburner not running start bitburner
if ((Get-Process -Name "bitburner" -ErrorAction SilentlyContinue) -eq $null) {
    Write-Output "Starting bitburner process..."
    Start-Process -Wait -FilePath "C:\Program Files (x86)\Steam\steamapps\common\Bitburner\bitburner.exe"
} else {
    Write-Output "Bitburner process already running."
    while ((Get-Process -Name "bitburner" -ErrorAction SilentlyContinue) -ne $null) {
        Start-Sleep -Seconds 30
    } 
}


# When bitburner is no longer running, stop the container and quit docker
Write-Output "Stopping bitburnerscripts container..."
docker stop bitburnerscripts

Write-Output "This script will terminate when VS Code is terminated."

# Dont stop the Docker engine process itself, its not a graceful termination and doesnt work successfully as docker spawns multiple processes.
# There is no cli method for a graceful termination of docker desktop.