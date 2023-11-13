import { NS } from "@ns";

// https://talyian.github.io/ansicolors/
export const color: {[index: string]: string} = {

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

export async function main(ns: NS): Promise<void> {
    /* `run util/log.js` to output list of colors (for debugging).
    /*
    for (let i = 0; i<255; i++) {
        ns.print(`\x1b[38;5;${i}m This is color ${i}`);
    } 
    */
	for(const key of Object.keys(color)) {
		ns.print(`${color[key]}${key}`);
	}
    /**/
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
export const maxLogLevel = 3; 

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