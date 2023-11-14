import { NS } from "@ns";
import { log } from "util/log";
import { NetworkServer, filterVulnerableServers, getNetworkServers } from "util/network";
import { readDataFile, readPlayerData } from "util/data";


export async function main(ns: NS): Promise<void> {
    const player = readPlayerData(ns);
    const NETWORK_FILE = `data/${player.city}/network.txt`;
    let network = readDataFile(ns, NETWORK_FILE);
    const vulnerableServers = filterVulnerableServers(ns, network);
    nukeServers(ns, vulnerableServers);
    network = getNetworkServers(ns, network, true); // refresh network.txt after nuking
    injectMalware(ns, network);
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
        ns.nuke(server.hostname);
        // ns.nuke() does not return any response indicating success or fail
        // Adding a ns.hasRootAccess() to validate requires extra 0.05 GB RAM
        // Assume the command was successful and update server property
        server.hasAdminRights = true;
    });
    log(ns, `nukeServers() nuked ${vulnerableServers.length} servers in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return vulnerableServers;
}

export const injectMalware = networkServerCopyFilePattern; // Alias for networkServerCopyFilePattern
/**
 * Copies files matching a specified pattern from the home directory to a list of network servers.
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of network server objects to copy the files to.
 * @param filePattern - The pattern to match against file names in the home directory. Defaults to "/malware/".
 */
export function networkServerCopyFilePattern(ns: NS, network: NetworkServer[], filePattern: string = "/malware/", sourceServer: string = "home") {
    const filePaths = ns.ls(sourceServer, filePattern);
    networkServerCopyFiles(ns, network, filePaths, sourceServer);
}

/**
 * Copies an array of file paths to each server in the provided network.
 * Root access is NOT required.
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of NetworkServer objects to copy the files to.
 * @param filePaths - An array of file paths to copy to each server.
 */
export function networkServerCopyFiles(ns: NS, network: NetworkServer[], filePaths: string[], sourceServer: string = "home") {
    const startPerformance = performance.now();
    network.forEach((server) => {
        log(ns, `replicating files to ${server.hostname}`); 
        ns.scp(filePaths, server.hostname, sourceServer);
    });
    log(ns, `networkCopyFiles() ${filePaths.length} files to ${network.length} servers in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   
}
