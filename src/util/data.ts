import { NS, Player } from "@ns";
import { log } from "util/log";

type Data = {
    file: string,
    port: number,
};

export const DATA: { [key: string]: Data } = {
    player: {
        file: "/data/player.txt",
        port: 1,
    },
    network: {
        file: "/data/network.txt",
        port: 2,
    }
}

const PLAYER_DATA_FILE = DATA.player.file;

/**
 * Write player data to a file.
 * @param {import('ns')} ns - The netscript interface to bitburner functions.
 */
export async function main(ns: NS): Promise<void> {
    writePlayerData(ns); 
}

/**
 * Reads and parses the data from the file system.
 * @param ns - The netscript interface to bitburner functions.
 * @returns The parsed data.
 */
export function readDataFile(ns: NS, filename: string) {
    const DATA = ns.read(filename);
    if (DATA.length === 0) {
        const message = `data file ${filename} is empty.`;
        log(ns, message, "WARN");
    } else {
        return (JSON.parse(DATA));
    }
}

/**
 * Reads player data file.
 * @param ns - The netscript interface to bitburner functions.
 * @returns The parsed player data.
 */
export function readPlayerData(ns: NS): Player {
    const player = readDataFile(ns, PLAYER_DATA_FILE) as Player;
    if (undefined === player) {
        throw new Error(`Failed to load ${PLAYER_DATA_FILE}. Run util/data.js or call writePlayerData() to re-generate.`);
    }
    return player;
}

/**
 * Writes the latest player data to a file.
 * @param ns - The netscript interface to bitburner functions.
 * @returns The latest player data.
 * @remarks DEPRECATED: use refreshPlayerData() instead.
 */
export function writePlayerData(ns: NS): Player {
    const player = ns.getPlayer();
    log(ns, `write ${PLAYER_DATA_FILE}`, "INFO");
    ns.write(PLAYER_DATA_FILE, JSON.stringify(player), "w");
    return player;
}


/**
 * Reads and parses data of a specific type from the given namespace.
 * @param ns The netscript interface to bitburner functions.
 * @param type The type of data to read.
 * @returns The parsed data.
 */
export function readData(ns: NS, type: string): any {
    return JSON.parse(ns.peek(DATA[type].port) as string);
}

/**
 * Get the latest player data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns The latest player info.
 * @remarks RAM cost: 0.5 GB
 */
export function refreshPlayerData(ns: NS, force = false): Player {
    const player = ns.getPlayer();
    refreshData(ns, "player", player, force);
    return player;
}

/**
 * Write data to port
 * @param ns - The netscript interface to bitburner functions.
 * @returns true if successful, false otherwise.
 * @remarks RAM cost: 0 GB
 */
export function tryWriteData(ns: NS, type: string, data: any, writeFile = false): boolean {
    data = JSON.stringify(data);
    if (writeFile) {
        ns.write(DATA[type].file, data, "w");
    }
    return ns.tryWritePort(DATA[type].port, data);
}
// Queues that i use to store variables should only contiain one entry
export function refreshData(ns: NS, type: string, data: any, force = false): boolean {
    if (force) {
        ns.clearPort(DATA[type].port); // clear and initialize new value
    }
    const result = tryWriteData(ns, type, data, force);
    if (!force) {
        ns.readPort(DATA[type].port); // pop old value
    }
    return result;
}

/**
 * Clear the data files and ports.
 * @param ns - The netscript interface to bitburner functions.
 * @returns true if successful, false otherwise.
 * @remarks RAM cost: 1 GB (rm)
 */
export function clearData(ns: NS) {
    for (const type in DATA) {
        ns.clearPort(DATA[type].port);
        ns.rm(DATA[type].file);
    }
}
export function clearAllData(ns: NS) {
    const filePaths = ns.ls("home", "data/");
    filePaths.forEach((filePath) => {
        ns.rm(filePath);
    });
}    