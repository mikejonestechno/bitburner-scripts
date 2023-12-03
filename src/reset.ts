import { NS } from "@ns";
import { clearData, deleteFiles, writeFileList, refreshPlayerData } from "util/data";
import { refreshNetworkScan, refreshNetworkServers } from "util/network";

/**
 * Resets the game data by clearing all data and refreshing the player data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns A promise that resolves once the reset is complete.
 * @remarks RAM cost: 7.5 GB (base, spawn, getServer, rm, getPlayer, ls, scan)
 */
export async function main(ns: NS): Promise<void> {
    clearData(ns);
    // todo: consider replacing deleteFiles with injectMalware (replace ns.rm with ns.scp)
    // this would reduce 0.6 GB from start.js
    deleteFiles(ns, "/data/", "home");
    writeFileList(ns, "/data/malware.txt", "/malware/", "home");
    refreshPlayerData(ns, true);
    refreshNetworkScan(ns, 1, true);
    // TODO: consider removing refreshNetworkServers() and just nuke all depth 2 servers in reset.
    // this would move 2 GB getServer to start.js
    // separate control for tracking hacking progress, start for cracking servers and doing initial analyze
    refreshNetworkServers(ns, true);
    ns.spawn("util/start.js", {threads: 1, spawnDelay: 50});
}
