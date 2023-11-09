import { NS } from "@ns";
import { NetworkServer } from "util/network";
import { log } from "util/log";

/**
 * Generates additional server properties for hack analysis.
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of network servers to analyze.
 * @returns An array of network servers with their analysis results.
 */
export function hackAnalyze(ns: NS, network: NetworkServer[]) {

    const startPerformance = performance.now();

    network.forEach((server) => {
        log(ns, `analyzing server ${server.hostname}`);

        const hackMoneyPercent = ns.hackAnalyze(server.hostname);
        const hackMoney = hackMoneyPercent * (server.moneyAvailable ?? 0);
        const hackMaxMoney = hackMoneyPercent * (server.moneyMax ?? 0);
        const hackChance = ns.hackAnalyzeChance(server.hostname);
        const hackThreadSecurity = 0.002; //ns.hackAnalyzeSecurity(1, server.hostname);
        const hackTime = ns.getHackTime(server.hostname) / 1000; // milliseconds
        const hackMillionDollarThreads = ns.hackAnalyzeThreads(server.hostname, 1000000);
        const properties = {
            hackTime: hackTime,
            hackChance: hackChance,
            hackMoneyPercent: hackMoneyPercent,
            hackMoney: hackMoney,
            hackMaxMoney: hackMaxMoney,
            hackMoneyPerSecond: (hackChance * hackMoney) / hackTime,
            hackMaxMoneyPerSecond: (hackChance * hackMaxMoney) / hackTime,
            hackThreadSecurity: hackThreadSecurity,
            hackMillionDollarThreads: hackMillionDollarThreads < 0 ? 0 : hackMillionDollarThreads,
        };
        Object.assign(server, properties);
    });

    log(ns, `analyzeNetworkMap() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return network;
}

export function growAnalyze(ns: NS, network: NetworkServer[]) {
    const startPerformance = performance.now();

    network.forEach((server) => {
        log(ns, `analyzing server ${server.hostname}`);
        const growTime = ns.getGrowTime(server.hostname) / 1000; // milliseconds
        // How many threads to multiply available money by a given multiplier
        // e.g. How many threads needed for 10% growth (1.1x multiplicative factor)?
        const growthFactor = 1.1;
        const growThreads = ns.growthAnalyze(server.hostname, growthFactor);
        // How much is 10% money anyway?
        const growThreadsMoney = ((server.moneyAvailable?? 0) * growthFactor) - (server.moneyAvailable?? 0) ;
        // How much money will each thread grow?
        const growMoney = growThreadsMoney / growThreads;
        const growMoneyPerSecond = growMoney / growTime; 
        const growThreadSecurity = 0.0040; // ns.growthAnalyzeSecurity(1, server.hostname);
        const weakenTime = ns.getWeakenTime(server.hostname) / 1000; // milliseconds
        const weakenSecurity = 0.0500; // ns.weakenAnalyze(1);
        const properties = {
            growTime: growTime,
            growThreads: growThreads,
            growThreadsMoney: growThreadsMoney,
            growMoney: growMoney,
            growMoneyPerSecond: growMoneyPerSecond,
            growThreadSecurity: growThreadSecurity,
            weakenTime: weakenTime,
            weakenSecurity: weakenSecurity,
        };
        Object.assign(server, properties);
    });

    log(ns, `analyzeNetworkMap() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return network;
}
