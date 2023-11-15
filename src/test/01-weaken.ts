import { NS } from "@ns";
import { filterRootAccessServers } from "util/network";
import { readPlayerData, readDataFile } from "util/data";
import { log } from "util/log";

export async function main(ns: NS): Promise<void> {

    /*
     *  Experiment to test the effect of weakening a server before hacking it.
     */

    const player = readPlayerData(ns);
    const NETWORK_FILE = `data/${player.city}/network.txt`;
    let network = readDataFile(ns, NETWORK_FILE);
    const rootAccessServers = filterRootAccessServers(ns, network);

    const target = ns.args[0] as string;
    if (undefined === target) throw new Error("target server not specified");

    const script = "malware/weaken.js";
    const scriptRAM = 1.75;
    let remainingThreads = rootAccessServers.find((server) => server.hostname === target)?.weakenThreads ?? 0;
    log(ns, `remaining Threads ${remainingThreads}`);

    rootAccessServers.forEach((server) => {
        if (remainingThreads <= 0) return;
        const threads = Math.floor((server.maxRam - server.ramUsed) / scriptRAM);
        // exec 10 scripts running 1 thread
        //ns.exec("malware/weaken.js", server.hostname, 10, target, "--threads", 1, "--iterations", 1);
        // exec 1 script running 10 threads
        if (threads > 0) {
            log(ns, `executing ${script} on ${server.maxRam}GB ${server.hostname} with ${threads} threads`);
            ns.exec(script, server.hostname, threads, target);
            remainingThreads -= threads;
        }
    });
    log(ns, `remaining Threads ${remainingThreads}`);

}    