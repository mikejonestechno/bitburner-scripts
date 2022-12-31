# Source files

Javascript and text files that are imported into the _bitburner_ game.

> ⚠️ This is my working repository of scripts and documentation created while playing the _bitburner_ game. 🚧 Work in progress. 🏗️

Not much to see here yet but will be populated over time as I progress and play through the game.


## VScode

I use the bitburner vscode extension to automatically 'push' or import the files into the game in real time. As of January 2023 there is not a two-way sync API so files added or edited using the in-game editor are not synced back to vscode, but files added or edited in vscode will auto import into the game.

I used the technique decribed on _reddit_ by user _m0dar_ to enable the bitburner netscript [intellilsense autocomplete in vscode](https://www.reddit.com/r/Bitburner/comments/sy5ygq/imports_and_intellisense_in_vscode/). As the game is psuedo-open source there is a known issue that the vscode [NS namespace may clash](https://github.com/bitburner-official/bitburner-vscode/issues/16) and autocomplete only works in one place at a time.
