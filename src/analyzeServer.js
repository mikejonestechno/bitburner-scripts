// import { functionName, functionName2 } from "./utils.js"
// RAM 7.70 GB

/** @param {NS} ns **/
export async function main(ns) {
    
    // initalize arguments
    var hostname = ns.args[0];
    if (hostname === undefined) {
        hostname = "home";
    }

    /*
    n00dles starts with min security so no need to weaken.
    n00dles starts with $0.07 m but has max $1.75 m
    so grow it close to max but keep the same min security
    
    */

    // Analyze Grow
    // var grewPercent = ns.grow(hostname); // 150 MB

    // the time depends on hack skill and security level
    var growTime = ns.getGrowTime(hostname); // 50 MB
    ns.printf(`growTime:\t%f seconds`, growTime/1000);

    // fixed at 0.004 per thread?
    var growSecurity = ns.growthAnalyzeSecurity(1,hostname,1); // 1 GB
    ns.printf(`growSecurity:\t%f per thread`, growSecurity);

    growSecurity = ns.growthAnalyzeSecurity(10,hostname,1); // 1 GB
    ns.printf(`growSecurity:\t%f per 10 threads`, growSecurity);

    var growThreads = ns.growthAnalyze(hostname,1.1,1); // 1 GB
    ns.printf(`growThreads:\t%f required for 10%% increase`, growThreads);
    var growThreads = ns.growthAnalyze(hostname,25,1); // 1 GB
    ns.printf(`growThreads:\t%f required for 25x current value`, growThreads);

    // Analyze Hack

    // the time depends on hack skill and security level
     ns.printf(`hackTime:\t%f seconds`, ns.getHackTime(hostname) / 1000);

    ns.printf(`hackMoney:\t%f %%`, ns.hackAnalyze(hostname) * 100);

    ns.printf(`hackChance:\t%f %%`, ns.hackAnalyzeChance(hostname) * 100);

    // fixed at 0.002 per thread?
    ns.printf(`hackSecurity:\t%f per thread`, ns.hackAnalyzeSecurity(1,hostname));
    
    ns.printf(`hackThreads:\t%f required to steal \$10,000`, ns.hackAnalyzeThreads(hostname,10000)); 

    ns.tail(); // display the log (stays visible after script terminates)
}