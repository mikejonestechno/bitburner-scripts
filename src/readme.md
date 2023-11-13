# Source files

Typescript, javascript and text files that are imported into the _bitburner_ game.

> ⚠️ This is my working repository of scripts and documentation created while playing the _bitburner_ game. 🚧 Work in progress. 🏗️

Not much to see here yet but will be populated over time as I progress and play through the game.

## Queue Ports

Bitburner netscript 'ports' can be used to share data between all servers on the network, simulating an exposed API that reads and writes data to different TCP ports. Using netscript ports makes it easier to share and synchronize data than creating .txt files containing data and copying files between servers (hoping they have the latest version).

The following ports are reserved in my scripts:

1. control port - initially used to control spawn scripts on _home_ server that starts with only 8GB RAM.
2. player JSON - the recent output of ns.getPlayer() to reduce RAM cost in other scripts.
3. network JSON - the recent list of all servers on current network to pass server data between scripts.


## VScode

I use the official bitburner [`typescript-template`](https://github.com/bitburner-official/typescript-template/blob/main/DockerGuide.md) project running in a docker container to automatically 'push' or import the files into the game in real time. The official remote API is not a two-way sync so files added or edited using the in-game editor are not synced back to vscode, but files added or edited in vscode will auto import into the game.

