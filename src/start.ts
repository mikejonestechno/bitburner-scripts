import { NS } from "@ns";
import { log } from "util/log";
import { Script } from "util/control";
import { DataStore } from "util/data";

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

    /* PHASE IV: Run attack (2.9 GB)
     * Initial control script tracks progress without frequent network server analyze
     * TODO: replace n00dles with a root access server with min RAM to run control 
     */
    const script = new Script(ns, "control.js", "n00dles");
    const dataStore = new DataStore();
    dataStore.control.set(ns, script);
    script.execute();
}

function initialize(ns: NS)  {
    /* Ports are cleared when you start the game or soft reset.
     * If ports are not clear, run reset.js to clear them.
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
     */
    log.TRACE.print(ns, "Initializing data...");

    if (ns.peek(DATA.network.port) != "NULL PORT DATA") {
        log.ERROR.print(ns, "Network data port is not empty.");
        // load from persistent file
            // if persistent file missing queue scan and network script?
    }
    if (ns.peek(DATA.player.port) != "NULL PORT DATA") {
        log.ERROR.print(ns, "Player data port is not empty.");
        // load from persistent file
        // queue scan and player script?
    }

}