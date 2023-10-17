# Once only need to build the docker image
# docker build -t bitburner-typescript:latest .

# If docker not running then start docker
if ((Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue) -eq $null) {
    Write-Output "Starting Docker..."
    Start-Process -FilePath "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Start-Sleep -Seconds 5
} else {
    Write-Output "Docker process already running."
}

Write-Output "Starting bitburner-filesync container..."
# bind mount the src directory and NetscriptDefinitions.d.ts to sync the intellisense definitions from the connected game back to the host text editor
$definitionFileName = "NetscriptDefinitions.d.ts"
If (!(Test-Path "$($pwd)/$($definitionFileName)")) {
    New-Item -Path $pwd -Name $definitionFileName -ItemType File -Force -Value "This definition file will be updated and overwritten on successful file sync." | Out-Null
}
docker run --rm -d -v "$($pwd)/src:/app/src" -v "$($pwd)/NetscriptDefinitions.d.ts:/app/NetscriptDefinitions.d.ts" -p 12525:12525 --name bitburner-filesync bitburner-typescript

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
    Write-Output "Bitburner process already running. Sleeping till bitburner terminates..."
    while ((Get-Process -Name "bitburner" -ErrorAction SilentlyContinue) -ne $null) {
        Start-Sleep -Seconds 30
    } 
}

# When bitburner is no longer running, automatically stop the filesync container.
Write-Output "Stopping bitburner-filesync container..."
docker stop bitburner-filesync

# Dont force terminate VS Code, there may be unsaved changes or additional changes users wants to make before closing VS Code.
Write-Output "This script will terminate when VS Code is terminated."

# There is no cli method for a graceful termination of docker desktop.
# Dont force terminate the Docker engine process itself, it will not be a graceful termination and may not work successfully as docker desktop spawns multiple processes.
