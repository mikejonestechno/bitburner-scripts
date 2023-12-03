import { NS, SpawnOptions } from "@ns";
import { main as nukeServers } from "util/crack";

/**
 * Starts basic cycle of cracking and hacking
 * @param ns - The netscript interface to bitburner functions.
 * @remarks RAM cost: 4.25 GB (base, spawn, scp, nuke)
 */
export async function main(ns: NS): Promise<void> {

    /* PHASE I: Initialize data
     * Run reset.js (separate script to reduce RAM cost)
     */

    /* PHASE II: Exploit vulnerable servers and copy malware
     */  
    const vulnerableServers = nukeServers(ns);
    
    /* PHASE III: Update network servers, analyze target
     */  

    /* PHASE IV: Spawn control script (6.75 GB) to run h,g,w attack (2.9 GB)
     * Initial control script tracks progress without frequent network server analyze
     */  

    /*
     * We've run out of RAM to analyze. Spawn new script to analyze and take next actions.
     */
    ns.clearPort(1);
    ns.tryWritePort(1, "util/dashboard.js");

    const spawnOptions: SpawnOptions = {
        threads: 1,
        spawnDelay: 100,
    };
    ns.tprint("spawning control.js");
    ns.spawn("util/control.js", spawnOptions);

}
