// import { functionName, functionName2 } from "./utils.js"
// RAM 1.60 GB

/** @param {NS} ns **/
export async function main(ns) {

    // initalize arguments
    var hostname = ns.args[0];
    if (hostname === undefined) {
        hostname = "home";
    }

    var start = performance.now()
    ns.nuke(hostname);
    var end = performance.now();
    var timeTaken = end - start;
    // Time: 0.1 milliseconds
    ns.tprintf(`Time: \t%f milliseconds`, timeTaken);

}