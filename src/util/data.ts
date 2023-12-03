import { NS, Player } from "@ns";
import { log } from "util/log";
import { NetworkServer } from "util/network";

type Data = {
    file: string,
    port: number,
};

export const DATA: { [key: string]: Data } = {
    control: {
        file: "/data/control.txt",
        port: 1,
    },
    player: {
        file: "/data/player.txt",
        port: 2,
    },
    network: {
        file: "/data/network.txt",
        port: 3,
    }
}

/**
 * Write player data.
 * @param {import('ns')} ns - The netscript interface to bitburner functions.
 */
export async function main(ns: NS): Promise<void> {
    refreshPlayerData(ns, true);
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
 * Reads network data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns The parsed player data.
 */
export function readNetworkData(ns: NS): NetworkServer[] {
    const network = readData(ns, "network") as NetworkServer[];
    if (undefined === network) {
        throw new Error(`Failed to load network data.`);
    }
    return network;
}

/**
 * Reads player data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns The parsed player data.
 */
export function readPlayerData(ns: NS): Player {
    const player = readData(ns, "player") as Player;
    if (undefined === player) {
        throw new Error(`Failed to load player data. Run util/data.js or call refreshPlayerData() to re-generate.`);
    }
    return player;
}

/**
 * Reads and parses data of a specific type from the given namespace.
 * @param ns The netscript interface to bitburner functions.
 * @param type The type of data to read.
 * @returns The parsed data.
 */
export function readData(ns: NS, type: string): object {
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
export function tryWriteData(ns: NS, type: string, rawdata: unknown, writeFile = false): boolean {
    const data = JSON.stringify(rawdata);
    if (writeFile) {
        ns.write(DATA[type].file, data, "w");
    }
    return ns.tryWritePort(DATA[type].port, data);
}
// Queues that i use to store variables should only contiain one entry
export function refreshData(ns: NS, type: string, data: unknown, force = false): boolean {
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
/**
 * Deletes files matching the specified pattern from the given server.
 * @param ns - The netscript interface to bitburner functions.
 * @param filePattern - The pattern to match the file names against. Defaults to "/data/".
 * @param sourceServer - The server from which to delete the files. Defaults to "home".
 */
export function deleteFiles(ns: NS, filePattern = "/data/", sourceServer = "home") {
    const filePaths = ns.ls(sourceServer, filePattern);
    filePaths.forEach((filePath) => {
        ns.rm(filePath);
    });
}
/**
 * Writes a list of file paths to a specified file.
 * @param ns - The netscript interface to bitburner functions.
 * @param file - The path of the file to write the list of file paths to. Defaults to "data/malware.txt".
 * @param filePattern - The pattern to match file paths against. Defaults to "/malware/".
 * @param sourceServer - The name of the server to search for file paths. Defaults to "home".
 * @returns An array of file paths that were written to the file.
 */
export function writeFileList(ns: NS, file = "data/malware.txt", filePattern = "/malware/", sourceServer = "home"): string[] {
    const filePaths = ns.ls(sourceServer, filePattern);
    ns.write(file, filePaths.join('\n'), "w");
    return filePaths
}
/**
 * Reads a txt file and returns its contents as an array of strings.
 * @param ns - The netscript interface to bitburner functions.
 * @param file - The path of the file to read. Defaults to "data/malware.txt".
 * @returns An array of strings representing the lines in the file.
 */
export function readTextFile(ns: NS, file = "data/malware.txt"): string[] {
    return ns.read(file).split('\n');
}
