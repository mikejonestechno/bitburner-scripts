# If docker not running then start docker
if ($null -eq (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
  Write-Output "Starting Docker..."
  Start-Process -FilePath "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  Start-Sleep -Seconds 5
} else {
  Write-Output "Docker process already running."
}

# Once only pull the sonar-scanner-cli docker image
# docker pull sonarsource/sonar-scanner-cli

# Set the SONAR_LOGIN environment variable to the SonarQube user token
#-e SONAR_LOGIN="sqp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \



$containerName = "sonar-scanner"
Write-Output "Starting $containerName container..."
$containers = docker ps -a --format "{{.Names}}"
if ($containers | Select-String -Pattern "^$containerName$" -Quiet) {
  docker start $containerName
} else {
  docker run -e SONAR_HOST_URL="http://ds920.local.disrupting.technology:9000" -e SONAR_LOGIN="${ENV:SONAR_LOGIN}" -e SONAR_VERBOSE=true -v "${PWD}:/usr/src" -v "sonar-cache:/opt/sonar-scanner/.sonar/cache" --name $containerName sonarsource/sonar-scanner-cli
}

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show('Remember to PAUSE the VPN to enable container API access to the NAS.',"VPN Connection",[System.Windows.Forms.MessageBoxButtons]::OK)
