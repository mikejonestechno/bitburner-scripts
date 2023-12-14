import { NS } from "@ns";
import { scan } from "util/network";

/**
 * Scans the network to a given depth and prints server properties similar to the terminal scan-analyze command.
 * @argument maxDepth - The maximum depth to scan.
 * @argument quiet - If defined do NOT print scan to terminal
 * @remarks RAM cost: 1.8 GB (base, scan)
 */
export function main(ns: NS) {
    const maxDepth = ns.args[0] as number;
    /* if a second argument is provided, do NOT print the scan to the terminal */
    const print = undefined == ns.args[1];
    scan(ns, maxDepth, print);
}