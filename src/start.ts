import { NS } from "@ns";

/**
 * Starts basic cycle of cracking and hacking
 * @param ns - The netscript interface to bitburner functions.
 * @remarks RAM cost: 
 */
export async function main(ns: NS): Promise<void> {

    /* PHASE I: Initialize data
     * Run reset.js (separate script to reduce RAM cost)
     */

    /* PHASE II: Exploit vulnerable servers and copy malware
     * Also included in reset.js (separate script to reduce RAM cost)
     */  
    
    /* PHASE III: Update network servers, analyze target
     * Run analyze.js (separate script to reduce RAM cost)
     */

    /* PHASE IV: Spawn control script (6.75 GB) to run attack (2.9 GB)
     * Initial control script tracks progress without frequent network server analyze
     */  
    ns.exec("script.js", "home");
}
