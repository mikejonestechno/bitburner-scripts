import { NS } from "@ns";
import { log } from "util/log";
import { NetworkServer, filterVulnerableServers } from "util/network";
import { readNetworkData, readTextFile } from "util/data";

/**
 * Nukes the specified vulnerable servers and injects malware.
 * @param ns - The netscript interface to bitburner functions.
 * @returns An array of the same vulnerable servers that were nuked.
 * @remarks RAM cost: 2.25 GB (base, scp, nuke)
 */
export function main(ns: NS): NetworkServer[] {
    const network = readNetworkData(ns);
    let vulnerableServers = filterVulnerableServers(ns, network);
    vulnerableServers = nukeServers(ns, vulnerableServers);
    // copy malware to ALL network servers at the start, saves RAM cost of running scp until I purchase new servers
    injectMalware(ns, network);
    return vulnerableServers;
}    

/**
 * Nukes the specified vulnerable servers.
 * @param ns - The netscript interface to bitburner functions.
 * @param vulnerableServers - An array of vulnerable servers to nuke.
 * @returns An array of the same vulnerable servers that were nuked.
 */
export function nukeServers(ns: NS, vulnerableServers: NetworkServer[]): NetworkServer[] {
    const startPerformance = performance.now();
    vulnerableServers.forEach((server) => {
        log(ns, `nuke ${server.hostname}`, 'INFO'); 
        // ns.nuke() does not return any response indicating success or fail, but does throw runtime error if attempting to nuke a server with locked ports
        try {
            ns.nuke(server.hostname);            
        } catch (error) {
            log(ns, `nuke ${server.hostname} failed, needs more ports open?`, 'WARN')
        }
        // Adding a ns.hasRootAccess() to validate requires extra 0.05 GB RAM
        // Assume the command was successful and update server property
        server.hasAdminRights = true;
    });
    log(ns, `nukeServers() nuked ${vulnerableServers.length} servers in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return vulnerableServers;
}

/**
 * Copy files listed in data/malware.txt to all network servers (root access is NOT required).
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of network servers to copy the files to.
 */
export async function injectMalware(ns: NS, network: NetworkServer[]): Promise<void> {
    const malwareFiles = readTextFile(ns, "/data/malware.txt");
    networkServerCopyFiles(ns, network, malwareFiles, "home"); 
}

/**
 * Copies an array of file paths to each server in the provided network.
 * Root access is NOT required.
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of NetworkServer objects to copy the files to.
 * @param filePaths - An array of file paths to copy to each server.
 */
export function networkServerCopyFiles(ns: NS, network: NetworkServer[], filePaths: string[], sourceServer = "home") {
    const startPerformance = performance.now();
    network.forEach((server) => {
        log(ns, `replicating files to ${server.hostname}`); 
        ns.disableLog("scp");
        ns.scp(filePaths, server.hostname, sourceServer);
    });
    log(ns, `networkCopyFiles() ${filePaths.length} files to ${network.length} servers in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   
}
