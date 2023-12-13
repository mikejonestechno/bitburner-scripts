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
    /* ns.exec("script.js", "home"); */
}

function init(ns: NS)  {
    /* Ports are cleared when you start the game or soft reset
     * So reload data from file cache
     *
     * Load persistent file data to temporary port cache
     * 
     * If network data missing, queue script to analyze network
     * If network node data missing, queue script to scan network
     * 
     * If no servers with root access found, THIS START script needs to crack/nuke servers
     * so we can run the other scripts
     * 
     * Something here to check status of running scripts...?
     * and kill some or all of them
     * 
     * 
     */

}