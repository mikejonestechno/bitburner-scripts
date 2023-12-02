import { NS } from "@ns";
import { scan } from "util/network";

/**
 * Scans the network to a given depth and prints server properties similar to the terminal scan-analyze command.
 * @param ns - The netscript interface to bitburner functions.
 * @returns NetworkNode[]
 * @remarks RAM cost: 1.8 GB (base, scan)
 */
export function main(ns: NS) {

    let depth = Number(ns.args[0]);
    if(undefined === depth || Number.isNaN(depth)) depth = 1; // default depth
    
    const networkNodes = scan(ns, depth);

    return networkNodes;
}