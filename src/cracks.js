/** @param {NS} ns **/
import { log } from "log.js";

/*
 *  Functions for cracking ports and nuke admin rights.
 */

// map crack filenames with the netscript functions to run
export function crackFiles(ns) {
    return {
    "BruteSSH.exe": ns.brutessh,
    "FTPCrack.exe": ns.ftpcrack,
    "relaySMTP.exe": ns.relaysmtp,
    "HTTPWorm.exe": ns.httpworm,
    "SQLInject.exe": ns.sqlinject
    };
}

export function getCracksAvailable(ns) {

    const cracksAvailable = Object.keys(crackFiles(ns)).filter(file => ns.fileExists(file, "home"));

    log.log(ns,`getCracksAvailable: ${cracksAvailable}`);
    return cracksAvailable;
}

export function crackServer(ns, hostname, cracksAvailable = getCracksAvailable(ns)) {

    for (const crackFile of cracksAvailable) {
        const runCrack = crackFiles(ns)[crackFile];
        // There is no return value so we cant tell if crack was successful without checking server properties
        // which will increase RAM cost.
        log.log(ns,`[${hostname}] crackServer: run ${crackFile} `);
        runCrack(hostname);
    }
}

export function wormNetworkMap(ns, networkMap) {
    // crack
    // replicate malware
    // nuke admin rights
}

export function virusNetwork(ns, networkMap) {
    copyFilePattern(ns, networkMap);
    nukeServers(ns, networkMap);
}

export function copyFilePattern(ns, networkMap, malwareFilePattern = "/malware/") {
    const malwareFiles = ns.ls("home", malwareFilePattern);
    copyFiles(ns, networkMap, malwareFiles);
}

export function copyFiles(ns, networkMap, malwareFiles) {
    // copy an array of file paths to each server in the network map
    const startPerformance = performance.now();
    networkMap.forEach((server, hostname) => {
        log(ns, `replicating malware to ${hostname}`); 
        ns.scp(malwareFiles, hostname);
    });
    log(ns, `copyFiles() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   
}

export function nukeServers(ns, networkMap) {
    const startPerformance = performance.now();
    networkMap.forEach((server, hostname) => {
        log(ns, `nuke ${hostname}`); 
        ns.nuke(hostname);
        server["hasAdminRights"] = true;
    });
    log(ns, `nukeServers() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   
}

