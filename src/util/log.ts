import { NS } from "@ns";

// https://talyian.github.io/ansicolors/
export const color: {[key: string]: string} = {
    // pale
    paleBlack: "\x1b[30m",
    paleRed: "\x1b[38;5;9m", 
    paleOrange: "\x1b[38;5;94m",
    paleYellow: "\x1b[38;5;11m",
    paleGreen: "\x1b[38;5;10m",
    paleCyan: "\x1b[38;5;14m",
    paleBlue: "\x1b[38;5;19m",
    paleIndigo: "\x1b[38;5;55m",
    paleMagenta: "\x1b[38;5;13m",
    paleWhite: "\x1b[38;5;243m", 
    // mid
    red: "\x1b[38;5;160m", 
    orange: "\x1b[38;5;172m", 
    yellow: "\x1b[38;5;184m",
    green: "\x1b[38;5;34m",
    cyan: "\x1b[38;5;80m",
    blue: "\x1b[38;5;21m",
    indigo: "\x1b[38;5;105m",
    magenta: "\x1b[38;5;164m",
    white: "\x1b[38;5;15m", 
    // bright
    brightRed: "\x1b[38;5;1m",
    brightOrange: "\x1b[38;5;208m",
    brightYellow: "\x1b[38;5;227m",
    brighGreen: "\x1b[38;5;46m",
    brightCyan: "\x1b[38;5;51m",
    brightBlue: "\x1b[38;5;4m",
    brightMagenta: "\x1b[38;5;5m",
    brightWhite: "\x1b[38;5;7m",
    reset: "\u001b[0m"
};

/**
 * Outputs a list of colors for debugging purposes.
 * 
 * @param ns - The netscript interface to bitburner functions.
 * @returns A promise that resolves when the function completes.
 */
export async function main(ns: NS): Promise<void> {
    for(const key of Object.keys(color)) {
        ns.print(`${color[key]}${key}`);
    }
    log(ns, "LogLevel test to check output formatting.")
    log(ns, "Positive successful hack against server.", logLevel.SUCCESS )
    log(ns, "Server is getting low on available money.", logLevel.WARN )
    log(ns, "Operation complete.", logLevel.INFO )
    log(ns, "Root access is required.", logLevel.ERROR )
}

export const icon: {[index: string]: string} = {
    true: "✔️",
    false: "❌",
    dollar: "💲",
    money: "💵",
    moneyWings: "💸",
    bank: "🏦",
    chart: "📈",
    moneybag: "💰",
    lock: "🔒",
    unlock: "🔓",
    key: "🔑",
    detective: "🕵",
    police: "👮",
    techno: "👨‍💻",
    pirateFlag: "🏴‍☠️",
    biohazard: "☣️",
    syringe: "💉",
    laptop: "💻",
    screen: "🖥️",
    target: "🎯",
    "100": "💯",
    skull: "💀",
    bomb: "💣",
    fire: "🔥",
    wall: "🧱",
    shield: "🛡️",
    bow: "🏹",
    attack: "⚔️",
    firecracker: "🧨",
    explosion: "💥",
    robot: "🤖",
    plug: "🔌",
    joystick: "🕹️",
    satelite: "📡",
    toolbox: "🧰",
    tools: "🛠️",
    globe: "🌐",
    alarmClock: "⏰",
    stopwatch: "⏱️",
    timer: "⏲️",
    thread: "🧵",
    seed: "🌱",
    dice: "🎲",
    strength: "💪",
    trophy: "🏆",
    first: "🥇",
    crystalBall: "🔮",
    racehorse: "🐎",
}; 

type LogLevel = {
    [key: string]: {  
        name: string, 
        level: number,
        color: string,
    }
};
export const logLevel: LogLevel = {
    "TRACE": {name: "TRACE", level: 4, color: color.cyan},
    "INFO": {name: "INFO", level: 3, color: color.blue},
    "WARN": {name: "WARN", level: 2, color: color.yellow},
    "SUCCESS": {name: "SUCCESS", level: 1.1, color: color.green},
    "ERROR": {name: "ERROR", level: 1, color: color.red},
    "NONE": {name: "NONE", level: 0, color: color.paleBlack},
};

const maxLogLevel = logLevel.TRACE; 

export async function log(ns: NS, message: string, messageLogLevel = logLevel.TRACE): Promise<void> {   
    if (messageLogLevel.level <= maxLogLevel.level) {        
        ns.print(`${messageLogLevel.color}${messageLogLevel.name} ${message}`);
    }
}