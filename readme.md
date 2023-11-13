# bitburner-scripts

> ⚠️ This is my working repository of Typescript scripts and documentation created while playing the _bitburner_ game.
>
> 🚧 Work in progress. 🏗️

## About

> _Bitburner_ is a free programming-based incremental game that revolves around hacking and cyberpunk themes. The game requires you to write working JavaScript / Typescript code to automate gameplay and solve puzzles. The game can be played at https://bitburner-official.github.io or installed locally through [Steam](https://store.steampowered.com/app/1812820/Bitburner/).

## Source files

I use the bitburner file sync API in the bitburner [typescript-template](https://github.com/bitburner-official/typescript-template) project to automatically 'push' or import my `src` script files into the game in real time.

- [/src](/src)

To get setup I created a docker container to run the file sync nodejs service. I also created a PowerShell script that will launch everything with one click; it will start the docker engine, start the file sync container, open my VS Code bitburner workspace and launch the bitburner game. A SonarQube script will launch a container to run a local static code analysis and publish to a local Sonar instance running on my NAS.

- [DockerGuide.md](DockerGuide.md)
- [Start-Bitburner.ps1](Start-Bitburner.ps1)
- [Start-SonarQube.ps1](Start-SonarQube.ps1)

## Documentation

Documented guides and help pages that I created while playing the _bitburner_ game.

- [/docs](/docs)

Dev Diary of my incremental progress through each iteration or 'soft reset'. Includes my lessons learnt in javascript programming and gameplay strategy learnt while playing the game.

- [/docs/diary](/docs/diary)

I want the diary to help my self-learning and track my progress as I understand more advanced gameplay mechanics and unlock new features in the game; and to track my progress learning javascript programming because I feel I learn and can recall what I have learnt better when I have to clarify, describe and refine my thoughts in writing.
