import { NS } from "@ns";
import { log, icon, color } from "util/log";
import { scanNetwork, getNetworkServers, FilterCriteria, filterServerProperties } from "util/network";
import { nukeServers } from "util/crack";
import { showDashboard } from "./util/dashboard";

export function main(ns: NS) {

    /*
     *  Scan network servers (get basic stats for each server).
     */

    let networkNodes = scanNetwork(ns);
    let network = getNetworkServers(ns, networkNodes);
  
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
     *  Show dashboard of vulnerable servers.
     */
    filterCriteria = {
        purchasedByPlayer: false,
        hasAdminRights: true
    };
    vulnerableServers = filterServerProperties(ns, network, filterCriteria);

    networkNodes = scanNetwork(ns, 6);
    network = getNetworkServers(ns, networkNodes);
    showDashboard(ns, network);

    // const homeMaxRam = ns.getPurchasedServerMaxRam("home");
    // ns.print(homeMaxRam); // = 1048576 GB = 1.048 TB

}
