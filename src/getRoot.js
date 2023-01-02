// import { functionName, functionName2 } from "./utils.js"
// RAM 1.60 GB

/** @param {NS} ns **/
export async function main(ns) {

    // initalize arguments
    var hostname = ns.args[0];
    if (hostname === undefined) {
        hostname = "home";
    }

    await ns.root(hostname);
}