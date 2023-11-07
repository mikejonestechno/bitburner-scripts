import { NS } from "@ns";
import { log } from "util/log";
import { NetworkServer } from "util/network";


export function nukeServers(ns: NS, vulnerableServers: NetworkServer[]): NetworkServer[] {
    const startPerformance = performance.now();

    ns.tprint("nukeServers: " + vulnerableServers.map((server) => server.hostname).join(", "));

    vulnerableServers.forEach((server) => {
        log(ns, `nuke ${server.hostname}`, 'INFO'); 
        ns.nuke(server.hostname);
        // ns.nuke() does not return any response indicating success or fail
        // Adding a ns.hasRootAccess() to validate requires extra 0.05 GB RAM
        // Assume the command was successful and update server property
        server["hasAdminRights"] = true;
    });
    log(ns, `nukeServers() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return vulnerableServers;
}