import { NS } from "@ns";
import { getNetworkServers, scanNetwork} from "util/network";
import { showScanAnalyze } from "util/dashboard";

/**
 * Scans the network to a given depth and prints server properties similar to the terminal scan-analyze command.
 * @param ns - The netscript interface to bitburner functions.
 * @returns void
 */
export function main(ns: NS) {
    let depth = Number(ns.args[0]);
    if(undefined === depth || Number.isNaN(depth)) depth = 1;
    ns.tprintf("scanAnalyze(depth=%d)", depth);

    const networkNodes = scanNetwork(ns, depth);
    const network = getNetworkServers(ns, networkNodes);
    showScanAnalyze(ns, network);
}