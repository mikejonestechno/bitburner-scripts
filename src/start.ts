import { NS } from "@ns";
import { log, icon, color } from "util/log";
import { scanNetwork, getNetworkServers, FilterCriteria, filterServerProperties } from "util/network";
import { nukeServers } from "util/crack";

export function main(ns: NS) {

    /*
     *  Scan network map (get basic stats for each server).
     */

    const networkNodes = scanNetwork(ns);
    const network = getNetworkServers(ns, networkNodes);
  
    /*
     *  Exploit vulnerable servers (run NUKE.exe).
     */

    // for debug of error handling the next line contains typo on property name
    //const filterCriteria: FilterCriteria = {numberOpenPortsRequired: 0};
    const filterCriteria: FilterCriteria = {
        numOpenPortsRequired: 0,
        hasAdminRights: false
    };
    let vulnerableServers = filterServerProperties(ns, network, filterCriteria);

    vulnerableServers = nukeServers( ns, vulnerableServers);

}
