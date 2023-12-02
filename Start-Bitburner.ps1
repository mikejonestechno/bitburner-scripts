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
# Clone bitburner-scripts repo into VS Code devcontainer...
# https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/mikejonestechno/bitburner-scripts

if ($null -eq (Get-Process -Name "Visual Studio Code" -ErrorAction SilentlyContinue)) {
    Write-Output "Starting VSCode WSL..."

    # https://code.visualstudio.com/docs/remote/wsl
    $arglist = "--remote wsl+Ubuntu /home/wsluser/github/bitburner-scripts";
    # or $arglist = "--folder-uri vscode-remote://wsl+Ubuntu/home/wsluser/github/bitburner-scripts"
    Start-Process -FilePath "C:\Program Files\Microsoft VS Code\code.exe" -ArgumentList $arglist

    # if devcontainer CLI extension is installed via VSCode UI (f1)
    # Start-Process -FilePath "devcontainer" -ArgumentList "open \\wsl.localhost\Ubuntu\home\wsluser\github\bitburner-scripts"

} else {
    Write-Output "VS Code process already running."
}


# If bitburner not running start bitburner
if ($null -eq (Get-Process -Name "bitburner" -ErrorAction SilentlyContinue)) {
    Write-Output "Starting bitburner process..."
    start-sleep -Seconds 5 # allow time for for bitburner-filesync to be in healthy state
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
