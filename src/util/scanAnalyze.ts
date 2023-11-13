import { NS } from "@ns";
import { getNetworkServers, scanNetwork} from "util/network";
import { scanAnalyzeColumns, showDashboard } from "util/dashboard";

/**
 * Scans the network to a given depth and prints server properties similar to the terminal scan-analyze command.
 * @param ns - The netscript interface to bitburner functions.
 * @param hideDashboard - do not print server properties to terminal, useful when spawning this script from another script.
 * @returns void
 */
export function main(ns: NS, maxDepth: number = 1, saveNetworkFile: boolean = false, hideDashboard: boolean = false) {
    let depth = Number(ns.args[0]);
    if(undefined === depth || Number.isNaN(depth)) depth = maxDepth;
    const networkNodes = scanNetwork(ns, depth);
    const network = getNetworkServers(ns, networkNodes, saveNetworkFile);
    if (!hideDashboard) {
        ns.tprintf("scanAnalyze(depth=%d)", depth);
        showDashboard(ns, network, scanAnalyzeColumns, true)
    }; 
}