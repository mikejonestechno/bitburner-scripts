import { NS } from "@ns";
import { clearData, clearAllData, refreshPlayerData } from "util/data";
import { refreshNetworkScan, refreshNetworkServers } from "util/network";

/**
 * Resets the game data by clearing all data and refreshing the player data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns A promise that resolves once the reset is complete.
 * @remarks RAM cost: 7.5 GB (base, spawn, getServer, rm, getPlayer, ls, scan)
 */
export async function main(ns: NS): Promise<void> {
    clearData(ns);
    clearAllData(ns);
    refreshPlayerData(ns, true);
    refreshNetworkScan(ns, 1, true);
    refreshNetworkServers(ns, true);
    // TODO: given this script already includes ls, create a txt list of malware files to save RAM cost later
    ns.spawn("util/start.js", {threads: 1, spawnDelay: 50});
}
