# Setup 

## Initial setup from scratch

Clone https://github.com/bitburner-official/typescript-template

Copy all files to personal repo https://github.com/mikejonestechno/bitburner-scripts

Add a DOCKERFILE to install node, npm and run the file sync watcher service.
Add a .dockerignore so that the src scripts are not copied to the container but will be host volume mounted at run time.

``` powershell
docker build -t bitburnerscripts:latest .
```

## Running the game

The docker container will continue running after the game and vscode is exited so stop the container after exiting the game.

```
docker run --rm -d -v "$(pwd)/src:/app/src" -p 12525:12525 --name bitburnerscripts bitburnerscripts npm run watch

Start-Process -Wait "C:\Program Files (x86)\Steam\steamapps\common\Bitburner\bitburner.exe"

docker stop bitburner
```

### PowerShell Game Launcher

I created a PowerShell script that will launch everything with one click; it will start the docker engine, start the file sync container, open my VS Code bitburner workspace and launch the bitburner game. 

- [Start-Bitburner.ps1](Start-Bitburner.ps1)

