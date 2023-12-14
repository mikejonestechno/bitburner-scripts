import { NS } from "@ns";
import { log } from "./util/log";

/**
 * Starts basic cycle of cracking and hacking
 * @param ns - The netscript interface to bitburner functions.
 * @remarks RAM cost: 
 */
export async function main(ns: NS): Promise<void> {

    /* PHASE I: Initialize data
     * Run reset.js (separate script to reduce RAM cost)
     */
    initialize(ns);

    /* PHASE II: Exploit vulnerable servers and copy malware
     * Also included in reset.js (separate script to reduce RAM cost)
     */  
    
    /* PHASE III: Update network servers, analyze target
     * Run analyze.js (separate script to reduce RAM cost)
     */

    /* PHASE IV: Spawn control script (6.75 GB) to run attack (2.9 GB)
     * Initial control script tracks progress without frequent network server analyze
     */
    const controlProcess = ns.exec("util/control.js", "n00dles");
    if (controlProcess == 0) {
        log.ERROR.print(ns, "Control script failed to start.");
        // NOTE its plausible server has old version of the script, may need to run reset.js
    } else {
        log.INFO.print(ns, `Control script started on PID ${controlProcess}.`);
    }

}

function initialize(ns: NS)  {
    /* Ports are cleared when you start the game or soft reset
     * and reset.js can be used to manually reset and wipe data if needed.
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
    log.TRACE.print(ns, "Initializing data...");
}