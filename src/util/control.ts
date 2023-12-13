import { NS, SpawnOptions } from "@ns";
import { main as analyzeNetwork } from "util/analyze";

export async function main(ns: NS): Promise<void> {

    /*
     * Analyze all servers on network to refresh properties
     */
    analyzeNetwork(ns);

    /*
     *  At the start of the game _home_ only has 8GB RAM so need to queue up scripts
     *  and spawn them one at a time.
     */

    const portData = ns.readPort(1) as string;
    if(portData === "NULL PORT DATA") {
        ns.tprint("Null port data: No scripts to run.");
        return;
    }

    const spawnOptions: SpawnOptions = {
        threads: 1,
        spawnDelay: 100,
    };
    ns.spawn(portData, spawnOptions);

    /* we dont have enough RAM to RUN script AND re-spawn.
    
    //const [filePath, ...args] = portData.split(",");
    ns.print("running " + portData);
    const processId = ns.run(portData);
    if (processId === 0) {
        const message = `Error: failed to run ${portData}`;
        log.TRACE.print(ns, message, "ERROR")
        ns.tprint(message);
    }
    

    const peek = ns.peek(1);
    if (peek === "NULL PORT DATA") {
        ns.tprint("End of control queue, no further scripts to run.");
    } else {
        // respawn to run next script in queue
        ns.print(`respawn control.js to run ${peek}`);
        ns.spawn("util/control.js", spawnOptions);
    }
    */
}
