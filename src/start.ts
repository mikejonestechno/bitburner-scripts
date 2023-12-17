import { NS } from "@ns";
import { log } from "util/log";
import { Script } from "util/control";
import { DataStore } from "util/data";
import { NetworkServer } from "util/network";

/**
 * Starts basic cycle of cracking and hacking
 * 
 * Normally control.js would restart in background and needs to recover.
 * control.js may need to terminate some scripts and restart them or 
 * scripts may need to self-terminate themselves if ports are clear on startup.
 * 
 * On a clean start.js needs to either exec control.js on home
 * then do minimal setup, then switch control.js to other server
 * or do minimial setup itself then exec control.js on another server
 * 
 * may need to include isRunning(PID) mechanism to wait for scripts to run??
 * may neeed to check all scripts on all servers to check exclusive and not
 * spawn duplicate scan or control scripts?
 * 
 * ---
 * 
 * idea - start adds scan, crack, analyze, control to queue
 * then runs control on home and control runs them in sequence not async.
 * even if the scripts are not technically needed, the scripts will just refresh the data 
 * and re-apply cracks and malware
 * finally queue control on n00dles and terminate control on home
 * and then queue attack strategy script to start attacks going.
 * 
 * @param ns - The netscript interface to bitburner functions.
 * @remarks RAM cost: 
 */
export async function main(ns: NS): Promise<void> {

    //const controlServer = "home";

    const dataStore = new DataStore();

    /** 
     * PHASE I: Initialize network data 
     * Run reset.js to wipe out all old data if needed
     */
    scanNetwork(ns, dataStore);

    /**
     *  PHASE II: Exploit vulnerable servers and copy malware     
     */  
    exploitNetwork(ns, dataStore);

    /* PHASE III: Update network servers, analyze target
     * Run analyze.js (separate script to reduce RAM cost)
     */

    /* PHASE IV: Start control script
     * Initial control script tracks progress without frequent network server analyze
     * TODO: replace n00dles with a root access server with min RAM to run control 
     * 
     * Consider chicken/egg. Need a way to determine whether or not to run control.js
     * 
     */
    log.TRACE.print(ns, "Add control.js to control queue");
    const script = new Script("control.js", "n00dles");
    dataStore.control.set(ns, script);

    log.TRACE.print(ns, "start.js execute script");
    script.execute(ns);
}

// dont call this function 'scan' because bitburner bug mistakes it for ns.scan and adds 0.2 GB RAM cost
function scanNetwork(ns: NS, dataStore: DataStore)  {
    /** 
     * Initialize network node data at game start.
     */
    log.TRACE.print(ns, "Initializing network data...");
    const network = dataStore.network.get(ns) as unknown as NetworkServer[];
    if (undefined === network) {
        log.TRACE.print(ns, "No network data found. Need to queue scan...");
        const script = new Script("scan.js", "home", 1, [50, "--save", "--quiet"]);
        /**
         * exec immediately, not from a controller bc controller will add RAM cost
         * // dataStore.control.set(ns, script); 
         * BUT WE NEED mechanism to wait for scan.js to complete and then re-queue start.js?
         */ 
        script.execute(ns);
    } else {
        log.SUCCESS.print(ns, "Network data loaded successfully.");
        log.TRACE.print(ns, `Network data: ${network[0].hostname}`);
    }
}

function exploitNetwork(ns: NS, dataStore: DataStore) {
    /**
     * Exploit vulnerable servers
     */
    log.TRACE.print(ns, "Exploiting vulnerable servers...");
    const network = dataStore.network.get(ns) as unknown as NetworkServer[];

    if (undefined === network) {
        log.TRACE.print(ns, "UH OH! No network data found. Abort...");
        throw new Error("No network data found. Abort...");
    }
    // Nuke all servers at depth 1 or 2 (will silently fail if ports are closed)
    //const vulnerableServers = network.filter(node => node.depth = 1 && node.depth <= 2);
    // If no vulnerable servers, queue crack
    log.TRACE.print(ns, "Vulnerable servers found. Need to queue crack...");
    //const script = new Script("crack.js", "home", 1);
}