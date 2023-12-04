import { NS } from "@ns";
import { clearPortData, writeFileList, refreshPlayerData } from "util/data";
import { NetworkServer, refreshNetworkScan } from "util/network";
import { nukeServers, injectMalware } from "util/crack";

/**
 * Resets the game data by clearing all data and refreshing the player data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns A promise that resolves once the reset is complete.
 * @remarks RAM cost: 4.45 GB (base, exec, scp, getPlayer, ls, scan, nuke)
 */
export async function main(ns: NS): Promise<void> {
    clearPortData(ns);
    // skip deleteFiles, just overwrite them // deleteFiles(ns, "/data/", "home");
    refreshPlayerData(ns, true);

    const networkNodes = refreshNetworkScan(ns, 50, true) as NetworkServer[];
    
    // Nuke all servers at depth 1 or 2 (will silently fail if ports are closed)
    const vulnerableServers = networkNodes.filter(node => node.depth >= 1 && node.depth <= 2);
    nukeServers(ns, vulnerableServers);

    writeFileList(ns, "/data/malware.txt", "/malware/", "home");
    writeFileList(ns, "/data/malware.txt", "/util/", "home", "a");
    await injectMalware(ns, networkNodes);

    // quick temp solution, will need to queue control script to start the attack
    ns.exec("/util/analyze.js", "foodnstuff");
}
