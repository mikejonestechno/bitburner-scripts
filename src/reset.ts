import { NS } from "@ns";
import { clearPortData, writeFileList, tryWriteData } from "util/data";
import { NetworkServer, refreshNetworkScan } from "util/network";
import { nukeServers, injectMalware } from "util/crack";

/**
 * Lightweight minimal script to clear data and nuke servers.
 * This enables a control script to be executed on other servers.
 * @param ns - The netscript interface to bitburner functions.
 * @returns A promise that resolves once the reset is complete.
 * @remarks RAM cost: 3.95 GB (base, exec, scp, ls, scan, nuke)
 */
export async function main(ns: NS): Promise<void> {

    clearPortData(ns);    
    // skip deleteFiles, just overwrite them // deleteFiles(ns, "/data/", "home");

    // Scan network to max depth 50, force overwrite of network data
    const networkNodes = refreshNetworkScan(ns, 50, true) as NetworkServer[];
    
    // Nuke all servers at depth 1 or 2 (will silently fail if ports are closed)
    const vulnerableServers = networkNodes.filter(node => node.depth >= 1 && node.depth <= 2);
    nukeServers(ns, vulnerableServers);

    // Copy malware to all servers
    writeFileList(ns, "/data/malware.txt", "/malware/", "home");
    writeFileList(ns, "/data/malware.txt", "/util/", "home", "a");
    await injectMalware(ns, networkNodes);

    // add list of scripts to control queue
    tryWriteData(ns, "control", "/util/analyze.js")

    // exec control script on another server to continue execution
    // quick temp solution, will need to queue control script to start the attack
    ns.exec("/util/analyze.js", "foodnstuff");

}
