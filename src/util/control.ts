import { NS } from "@ns";
import { log } from "util/log";

export async function main(ns: NS): Promise<void> {

    /* When the game starts all temporary port data is cleared.
     * This script will re-start and will need to recover.
     * run exec start.js to load persistent data into the temporary port cache.
     */
    log.TRACE.print(ns, "Control started");
    
    // TODO: ensure there is only ever one instance of this script running.

    while (true) {
        const time = new Date().toLocaleTimeString([], { hour12: false });
        log.TRACE.print(ns, `Control running... ${time}`);
        
        /* Read state from the temporary port cache 
                if cache is empty load from last saved file 
                consider refresh data or wipe the feedback queue?*/

        /* Read state in the state feedback queue and process them */

        /* Identify additional scripts that need to be run (if any) */

        /* Read scripts in the control queue and execute them */

        await ns.sleep(1000 * 10);

    }
}
