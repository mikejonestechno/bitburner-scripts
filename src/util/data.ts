import { NS, Player } from "@ns";
import { log } from "util/log";

const PLAYER_DATA_FILE = "/data/player.txt";

/**
 * Write player data to a file.
 * @param {import('ns')} ns - The namespace object.
 */
export function main(ns: NS) {
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
        const MESSAGE = `data file ${filename} is empty.`;
        log(ns, MESSAGE, "WARN");
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
    return readDataFile(ns, PLAYER_DATA_FILE) as Player;
}

/**
 * Writes the player data to a file.
 * @param ns - The netscript interface to bitburner functions.
 */
export function writePlayerData(ns: NS) {
    const PLAYER_DATA = ns.getPlayer();
    ns.write(PLAYER_DATA_FILE, JSON.stringify(PLAYER_DATA), "w");
    return PLAYER_DATA;
}

