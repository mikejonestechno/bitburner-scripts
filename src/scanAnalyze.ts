import { NS } from "@ns";
import { getNetworkServers} from "util/network";
import { scanAnalyzeColumns, showDashboard } from "util/dashboard";

/**
 * Scans the network to a given depth and prints server properties similar to the terminal scan-analyze command.
 * @param ns - The netscript interface to bitburner functions.
 * @param hideDashboard - do not print server properties to terminal, useful when spawning this script from another script.
 * @returns void
 */
export async function main(ns: NS, maxDepth = 1, hideDashboard = false): Promise<void> {
    let depth = Number(ns.args[0]);
    if(undefined === depth || Number.isNaN(depth)) depth = maxDepth;
    const network = getNetworkServers(ns);
    const filteredNetwork = network.filter(node => node.depth <= depth);
    if (!hideDashboard) {
        ns.tprintf("scanAnalyze(depth=%d)", depth);
        showDashboard(ns, filteredNetwork, scanAnalyzeColumns, true)
    }; 
}