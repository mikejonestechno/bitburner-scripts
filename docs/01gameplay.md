# 01: Opening Gameplay & Logging

## Welcome

This series will document my thoughts and learnings as I explore the early opening gameplay. After experimenting with new ideas or concepts I will frequently perform a "hard reset" and re-start the game from scratch, skipping the tutorial.

### Hard Reset

Go to Options > Delete Save to delete the current save game and 'factory reset' to level 1 and begining of the tutorial.

Go to Options > Remote API and set the port to 12525 to connect and sync files from host / VS Code. See `/setup.md` for more info on setting up the file sync.

## Getting Started

Basic game mechanic is to hack servers to gain money, buying cybernetic augmentations to improve performance. 

The more hacking experience I have the higher level servers I can unlock that have significantly higher max money available.

The more RAM I have available the more multithreaded hacks I can run in parallel and gain money faster. 

So there's a balancing objective - is it better to level up to unlock higher level servers with more money available, or better to increase RAM to gain money faster with parallel threads?

The priority may change several times until we have unlocked all servers on the network and purchased all available server upgrades.

Before I can figure out where to start, I need to get the key stats and properties of each available server and make a better determination whether my initial objective is max money or max hacking skill.

A detailed scan and analyze requires a script because the terminal commands `scan-analyze` and  `analyze` do not output all the information including `NS.getServerMaxMoney()`. 

Before I start creating scripts to analyze the servers, I want a `log()` function to help me debug and format the output of my scripts.

## Logging

The `ns.print()` method allows me to print a custom message to log but the messages are easily lost with all the other built-in log messages. There are [four color options available](https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.ns.print.md) if the message has certain prefix e.g. the message below will be automatically printed in red font. 

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
ns.print(`${color.cyan}Calling ns.scan()...`);
```

This is great to help my debug messages stand out but I have to add a `$(color}` prefix to every message, and if I later wanted to change debug messages from cyan to yellow I would have to edit every file and update every value.

I created a `Log {}` class to help me be more consistent. I can create a separate log for different log levels and the function will print the message in the appropriate color. If I want to change the error log message color I now only have to edit one line in the log variable.

``` typescript
log.ERROR.print(ns, "Oops something went wrong!");
log.INFO.print(ns, "Calling ns.scan()...");
```

I defined mulitple log levels and added a conditional check so that I can easily enable and disable debug trace logging. The Log class is really just a print formatter to emulate a proper logging routine.

The primary purpose for the `log.LEVEL.print()` function is the ability to consistently print or supress debug messages by changing `maxLogLevel` and this meets my needs for now. 

``` typescript
class Log {
    constructor(
        public name: string,
        public level: number,
        public color: string,
        public icon: string
    ) { }

    formatMessage(message: string): string {
        return `${this.color}${this.icon} ${message}`;
    }

    print(ns: NS, message: string): void {
        if (this.level <= maxLogLevel.level) {
            ns.print(this.formatMessage(message));
        }
    }
}

export const log = {
    TRACE: new Log("TRACE", 4, color.cyan, icon.trace),
    INFO: new Log("INFO", 3, color.blue, icon.info),
    WARN: new Log("WARN", 2, color.yellow, icon.warn),
    SUCCESS: new Log("SUCCESS", 1.1, color.green, icon.success),
    ERROR: new Log("ERROR", 1, color.red, icon.error),
    NONE: new Log("NONE", 0, color.paleBlack, ""),
};

const maxLogLevel = log.TRACE;
```

The logging functions are saved in the `util/log.ts` file.