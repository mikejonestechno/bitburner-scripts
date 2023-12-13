import { NS } from "@ns";

/**
 * Outputs a list of colors (for debugging purposes).
 * 
 * @param ns - The netscript interface to bitburner functions.
 */
export async function main(ns: NS): Promise<void> {
    for (const key of Object.keys(color)) {
        ns.print(`${color[key]}${key}`);
    }
    log.TRACE.print(ns, "LogLevel test to check output formatting.");
    log.SUCCESS.print(ns, "Positive successful hack against server.");
    log.WARN.print(ns, "Server is getting low on available money.")
    log.INFO.print(ns, "Operation complete.")
    log.ERROR.print(ns, "Root access is required.")
    ns.print("|||||| Check icon alignment with monospace font.")
    for (const key of Object.keys(icon)) {
        ns.print(`|${icon[key]}| ${key}`);
    }
    ns.print("|||||| Check icon alignment with monospace font.")
}

// https://talyian.github.io/ansicolors/
export const color: { [key: string]: string } = {
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

export const icon: { [key: string]: string } = {
    none: "  ", // two spaces (no emoji)
    blank: "⬜",
    black: "⬛",
    trace: "🕵",
    info: "📝",
    warn: "⚠️",
    error: "🚨",
    success: "✅",
    check: "✅",
    cross: "❎",
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
    security: "👮",
    hacker: "👨‍💻",
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

class Log {
    constructor(
        public name: string,
        public level: number,
        public color: string,
        public icon: string
    ) { }

    /**
     * Formats a message by adding color and an icon.
     * 
     * @param message - The message to be formatted.
     * @returns The formatted message.
     */
    formatMessage(message: string): string {
        return `${this.color}${this.icon} ${message}`;
    }

    /**
     * Prints a formatted message to the log.
     * @param message The message to be printed.
     * @returns A promise that resolves once the message has been printed.
     */
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