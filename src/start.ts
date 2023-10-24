import { NS } from "@ns";
import { log, icon, color } from "util/log";
import { scanNetwork, getNetworkServers, filterServerProperties } from "util/network";


export function main(ns: NS) {
    
    const networkNodes = scanNetwork(ns);
    const network = getNetworkServers(ns, networkNodes);
  
    //const vulnerableServers = filterServerProperties(ns, network, {numberOpenPortsRequired: 0});
    const vulnerableServers = filterServerProperties(ns, network, {numOpenPortsRequired: 0});
    ns.tprint("VulnerableServers: " + Array.from(vulnerableServers.keys()).join(", "));

}
