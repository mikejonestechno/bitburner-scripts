import { NS } from "@ns";
import { log } from "util/log";
//import { DataStore } from "util/data";

export async function main(ns: NS): Promise<void> {

    log.TRACE.print(ns, "Control started");

    /**
     * When the game starts all temporary port data is cleared.
     * Expect control script to self-recover when game starts.
     * Perhaps it needs to run a start script to load persistent data and re-initialize the cache
     */

    // TODO: ensure there is only ever one instance of this script running?

    //const dataStore = new DataStore();
    //const player = dataStore.player.get(ns);

    while (true) {
        const time = new Date().toLocaleTimeString([], { hour12: false });
        log.TRACE.print(ns, `Control running... ${time}`);
        
        /* Read state from the temporary port cache 
                if cache is empty load from last saved file 
                consider refresh data or wipe the feedback queue?*/

        /* Read state in the state feedback queue and process them */

        /* Identify additional scripts that need to be run (if any) */

        /* Read scripts in the control queue and execute them */

        /* if we are in idle state save data to persistent storage? */
        await ns.sleep(1000 * 10);

    }
}

export class Script {
    private script: string;
    private server: string;
    private threadRunOptions?: number;
    private args?: (string | number | boolean)[];

    constructor(script: string, server: string, threadRunOptions?: number, args?: (string | number | boolean)[]) {
        this.script = script;
        this.server = server;
        this.threadRunOptions = threadRunOptions;
        this.args = args;
    }

    /**
     * Executes the script on the server with consistent logging.
     * @returns The process ID of the executed script.
     */
    public execute(ns: NS): number {
        const process = ns.exec(this.script, this.server, this.threadRunOptions, ...(this.args ?? []));
        if (process == 0) {
            log.ERROR.print(ns, `${this.script} failed to start on ${this.server}.`);
        } else {
            log.INFO.print(ns, `${this.script} started on ${this.server} with PID ${process}.`);
        }
        return process;
    }
}
