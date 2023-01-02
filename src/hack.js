// import { functionName, functionName2 } from "./utils.js"
// RAM 1.75 GB

/** @param {NS} ns **/
export async function main(ns) {

    // initalize arguments
    var hostname = ns.args[0];
    var iterations = ns.args[1];

    if (hostname == undefined) {
        ns.getHostname(); // RAM cost 0.05 GB
    }
    if (iterations == undefined) {
        iterations = 1;
    }

    for(let i=0;i<iterations;i++){
        var start = performance.now()
        await ns.hack(hostname);
        ns.printf(`Time: \t%f milliseconds`, performance.now() - start);
        // small delay to allow 2nd iteration to improve hack chance from all prior iterations into account
        await ns.sleep(1000); 
    }

}