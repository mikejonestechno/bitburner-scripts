import { NS } from "@ns";
import { printNetworkNodes, scanNetwork } from "util/network";
import { DataStore } from "util/data";

/**
 * Scans the network to a given depth and prints server properties similar to the terminal scan-analyze command.
 * @argument maxDepth - The maximum depth to scan.
 * @argument quiet - Flag to supress printing scan output to terminal
 * @argument save - Flag to save network nodes to dataStore
 * @remarks RAM cost: 1.8 GB (base, scan)
 */
export function main(ns: NS) {
    let maxDepth = ns.args[0] as number;
    const flag = ns.flags([["quiet", false], ["save", false]]);
    if (flag.save) {
        maxDepth = 50;
    } else if (maxDepth === undefined) {
        maxDepth = 1;
    }
    const networkNodes = scanNetwork(ns, maxDepth);
    if (flag.save) {
        const dataStore = new DataStore();
        dataStore.network.set(ns, networkNodes);        
    }
    if (!flag.quiet) {
        printNetworkNodes(ns, networkNodes);
    }
}