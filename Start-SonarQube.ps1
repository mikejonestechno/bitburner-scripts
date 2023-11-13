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

#
# ?? do i need to disable surfshark and then retry staring the container so it can get its connection to ds920?
#

$containerName = "sonar-scanner"
Write-Output "Starting $containerName container..."
$containers = docker ps -a --format "{{.Names}}"
if ($containers | Select-String -Pattern "^$containerName$" -Quiet) {
  docker start $containerName
} else {
  docker run -e SONAR_HOST_URL="http://ds920.local.disrupting.technology:9000" -e SONAR_LOGIN="${ENV:SONAR_LOGIN}" -e SONAR_VERBOSE=true -v "${PWD}:/usr/src" -v "sonar-cache:/opt/sonar-scanner/.sonar/cache" --name $containerName sonarsource/sonar-scanner-cli
}
