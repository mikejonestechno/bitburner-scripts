import { NS } from "@ns";
import { log } from "util/log";
import { Network } from "util/network";


export function nukeServers(ns: NS, vulnerableServers: Network) {
    const startPerformance = performance.now();

    ns.tprint("nukeServers: " + Array.from(vulnerableServers.keys()).join(", "));

    vulnerableServers.forEach((server, hostname) => {
        log(ns, `nuke ${hostname}`, 'INFO'); 
        ns.nuke(hostname);
        // ns.nuke() does not return any response indicating success or fail
        // Adding a ns.hasRootAccess() to validate requires extra 0.05 GB RAM
        // Assume the command was successful and update server Map
        server["hasAdminRights"] = true;
    });
    log(ns, `nukeServers() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return vulnerableServers;
}