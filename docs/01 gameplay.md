# 01: Opening Gameplay & Logging

## Welcome

This series will document my thoughts and learnings as I explore the early opening gameplay. After experimenting with new ideas or concepts I will frequently perform a "hard reset" and re-start the game from scratch, skipping the tutorial.

### Hard Reset

Go to Options > Delete Save to delete the current save game and 'factory reset' to level 1 and begining of the tutorial.

Go to Options > Remote API and set the port to 12525 to connect and sync files from host / VS Code. See `/setup.md` for more info on setting up the file sync.

## Getting Started

Basic game mechanic is to hack servers to gain money. 

The more hacking experience I have the higher level servers I can unlock that have significantly higher max money available.

The more RAM I have available the more multithreaded hacks I can run in parallel and gain money faster. 

So there's a balancing objective - is it better to level up to unlock higher level servers with more money available, or better to increase RAM to gain money faster with parallel threads?

The priority may change several times until we have unlocked all servers on the network and purchased all available server upgrades.

Before I can figure out where to start, I need to get the key stats and properties of each available server and make a better determination whether my initial objective is max money or max hacking skill.

A detailed scan and analyze requires a script because the terminal commands `scan-analyze` and  `analyze` do not output all the information including `NS.getServerMaxMoney()`. 

Before I start creating scripts to analyze the servers, I want a `log()` function to help me debug and format the output of my scripts.

## Logging

The `ns.print()` method allows me to print a custom message to log but the messages are easily lost with all the other built-in log messages. There are [four color options available](https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.ns.print.md) if the message has certain prefix e.g. the message below will be printed in red font. 

``` typescript
ns.print(`ERROR Oops something went wrong!`);
```

I created a `color` map to define additional custom colors.

``` typescript
export const color: {[index: string]: string} = {
    red: "\x1b[38;5;160m", 
    orange: "\x1b[38;5;172m", 
    yellow: "\x1b[38;5;184m",
    green: "\x1b[38;5;34m",
    cyan: "\x1b[38;5;80m",
    blue: "\x1b[38;5;21m",
    indigo: "\x1b[38;5;105m",
    magenta: "\x1b[38;5;164m",
    white: "\x1b[38;5;15m", 
};
```

This allows me to print messages in with human-readable color values. 

``` typescript
ns.print(`${color.orange}ERROR Oops something went wrong!`);
```

This is great but I have to add a `$(color}` prefix to every message, and if I later wanted to change error messages from orange to yellow I would have to edit every file and update every value.

I created a `log()` function to help me be more consistent. I can pass in the log level and the function will print the message in the appropriate color. If I want to change error messages color I now only have to edit one line in the function.

``` typescript
log.log(ns, "Oops something went wrong!", ERROR);
log.log(ns, "Calling ns.scan()...");
```

If no log level is passed in the message will be logged as a debug message in debug message color.

I defined mulitple log levels and added a conditional check so that I can easily enable and disable debug logging.

``` typescript
export const logLevel: {[index: string]: number} = {
    DEBUG: 4,
    INFO: 3,
    WARN: 2,
    SUCCESS: 1.1,
    ERROR: 1,
    NONE: 0,
};

/* maxLogLevel
Set this value to 4 in order to show all output messages.
Set this value to 1 in order supress all output except errors.
 */
export const maxLogLevel = 4; 

export function log(ns: NS, message: string, level = "DEBUG") {
    const logLevelNumber = logLevel[level];

    if (logLevelNumber <= maxLogLevel) {        
        switch(logLevelNumber) {
            case 3:
                ns.print(`${color.blue}INFO  ${message}`); 
                break;
            case 1.1:
                ns.print(`${color.green}${message}`);
                break;
            case 2:
                ns.print(`${color.yellow}WARN  ${message}`);
                break;
            case 1:
                ns.print(`${color.red}ERROR ${message}`);
                break;
            default:
                ns.print(`${color.cyan}DEBUG ${message}`);
        }   
    }
};
```

The logging functions are saved in the `util/log.ts` file.