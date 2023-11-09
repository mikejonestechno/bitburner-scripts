import { NS, SpawnOptions } from "@ns";
import { scanNetwork, getNetworkServers, FilterCriteria, filterServerProperties } from "util/network";
import { nukeServers } from "util/crack";
import { writePlayerData } from "./util/data";

export function main(ns: NS) {

    /*
     *  Initialize player data file (money, hacking level, location, etc.) 
     *  This is used to generate other data files for the current city.
     */

    const PLAYER = writePlayerData(ns);
    const NETWORK_FILE = `data/${PLAYER.city}/network.txt`;

    /*
     *  Scan network servers (get basic stats for each server).
     */

    let networkNodes = scanNetwork(ns, 50);
    let network = getNetworkServers(ns, networkNodes);
    ns.write(NETWORK_FILE, JSON.stringify(network), "w");
  
    /*
     *  Exploit vulnerable servers (run NUKE.exe).
     */

    // for debug of error handling the next line contains typo on property name
    // const filterCriteria: FilterCriteria = {numberOpenPortsRequired: 0};
    let filterCriteria: FilterCriteria = {
        numOpenPortsRequired: 0,
        hasAdminRights: false
    };
    let vulnerableServers = filterServerProperties(ns, network, filterCriteria);

    nukeServers( ns, vulnerableServers);

    /*
     *  Show default dashboard
     */
    const spawnOptions: SpawnOptions = {
        threads: 1,
        spawnDelay: 100,
    };
    ns.spawn("util/dashboard.js", spawnOptions);
}
