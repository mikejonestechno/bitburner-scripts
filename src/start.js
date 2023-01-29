import { log } from "log.js";
import { scanNetworkMap,  getNetworkMapServers, filterVulnerableMap } from "network.js";
import { virusNetwork } from "cracks.js";
import { saveMapData } from "network.js";

/*
 *  Script to perform initial scan and create networkMap.
 *  Script RAM cost is 4.65 GB
 */

/** @param {NS} ns **/
export async function main(ns) {

    ns.clearLog();
    ns.tail();

    let networkMap = new Map();
    let vulnerableServerMap = new Map();

    const startPerformance = performance.now();

    /*
     *  Scan network map (get basic stats for each server).
     */

    networkMap = scanNetworkMap(ns);
    networkMap = getNetworkMapServers(ns, networkMap);

    /*
     *  Exploit vulnerable servers (run NUKE.exe and copy malware files).
     */

    vulnerableServerMap = filterVulnerableMap(ns, networkMap);
    virusNetwork(ns, vulnerableServerMap); 

    saveMapData(ns, networkMap, "networkMap", 1);

    /*
     *  At start I only have one target - foodnstuff - so
     *  hack foodnstuff with everything I have to level up immediately,
     *  and then run analysis to maintain a sustainable minimum income
     *  while growing to maxMoney. 
     */
    const currentHackTargetHostname = "foodnstuff";
    const botNetServerMap = vulnerableServerMap;
    const hackScriptRam = 1.7;
    botNetServerMap.forEach((server, hostname) => {

        const threads = Math.floor(server.maxRam / hackScriptRam);

        for (let t = 1; t <= threads; t++) {
            ns.exec("/malware/hack.js", hostname, 1, currentHackTargetHostname);
        }
    });

    log(ns, `start.js completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");

}
