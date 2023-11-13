import { NS, Player } from "@ns";
import { log } from "util/log";

const PLAYER_DATA_FILE = "/data/player.txt";

/**
 * Write player data to a file.
 * @param {import('ns')} ns - The netscript interface to bitburner functions.
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
 */
export function writePlayerData(ns: NS) {
    const player = ns.getPlayer();
    ns.write(PLAYER_DATA_FILE, JSON.stringify(player), "w");
    return player;
}
