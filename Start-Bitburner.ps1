# Start bitburner devcontainer and launch bitburner game

# If docker not running then start docker
if ($null -eq (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Output "Starting Docker..."
    Start-Process -FilePath "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Start-Sleep -Seconds 5
} else {
    Write-Output "Docker process already running."
}

# If VS Code not running start VS Code
# IF VS Code devcontainer extension is installed then start VS Code with devcontainer.json
if ($null -eq (Get-Process -Name "Visual Studio Code" -ErrorAction SilentlyContinue)) {
    Write-Output "Starting VSCode..."
    #Start-Process -FilePath "C:\Program Files\Microsoft VS Code\code.exe" -ArgumentList "./devcontainer/devcontainer.json"
    Start-Process -FilePath "C:\Program Files\Microsoft VS Code\code.exe" -ArgumentList "./.vscode/bitburner-scripts.code-workspace"
} else {
    Write-Output "VS Code process already running."
}

# Clone bitburner-scripts repo into VS Code devcontainer...
# https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/mikejonestechno/bitburner-scripts


# If bitburner not running start bitburner
if ($null -eq (Get-Process -Name "bitburner" -ErrorAction SilentlyContinue)) {
    Write-Output "Starting bitburner process..."
    start-sleep -Seconds 3 # allow time for for bitburner-filesync to be in healthy state
    Start-Process -Wait -FilePath "C:\Program Files (x86)\Steam\steamapps\common\Bitburner\bitburner.exe"
} else {
    Write-Output "Bitburner process already running. Sleeping till bitburner terminates..."
    while ($null -ne (Get-Process -Name "bitburner" -ErrorAction SilentlyContinue)) {
        Start-Sleep -Seconds 30
    } 
}

# Dont force terminate VS Code, there may be unsaved changes or additional changes users wants to make before closing VS Code.
Write-Output "This script will terminate when VS Code is terminated."

# Dont force terminate the Docker engine process itself, it will not be a graceful termination and may not work successfully as docker desktop spawns multiple processes.
