import { NS } from "@ns";
import { log } from "util/log";
import { refreshData, refreshPlayerData } from "util/data";
import { NetworkServer, refreshNetworkServers } from "util/network";


/**
 * Analyzes the network servers and refreshes the data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns A Promise that resolves once the analysis is complete.
 */
export async function main(ns: NS): Promise<void> {
    refreshPlayerData(ns);
    let network = refreshNetworkServers(ns, true);
    network = hackAnalyze(ns, network);
    refreshData(ns, "network", network, true);
}

/**
 * Generates additional server properties for hack analysis.
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of network servers to analyze.
 * @returns An array of network servers with their analysis results.
 */
export function hackAnalyze(ns: NS, network: NetworkServer[]) {
    // find the server with the highest money per second
    const targetHackMoneyPerSecond = {
        money: 0,
        hostname: "",
    };
    // find the server with the highest maxMoney per second
    const targetHackMaxMoneyPerSecond = {
        money: 0,
        hostname: "",
    };
    const startPerformance = performance.now();
    network.forEach((server) => {
        log(ns, `hackAnalyze ${server.hostname}`);
        const hackTime = ns.getHackTime(server.hostname) / 1000; // milliseconds
        const hackChance = ns.hackAnalyzeChance(server.hostname);
        const hackMoneyPercent = ns.hackAnalyze(server.hostname);
        const hackMoney = hackMoneyPercent * (server.moneyAvailable ?? 0);
        const hackMaxMoney = hackMoneyPercent * (server.moneyMax ?? 0);
        const hackMoneyPerSecond = (hackChance * hackMoney) / hackTime;
        if (hackMoneyPerSecond > targetHackMoneyPerSecond.money) {
            targetHackMoneyPerSecond.money = hackMoneyPerSecond;
            targetHackMoneyPerSecond.hostname = server.hostname;
        }
        const hackMaxMoneyPerSecond = (hackChance * hackMaxMoney) / hackTime;
        if (hackMaxMoneyPerSecond > targetHackMaxMoneyPerSecond.money) {
            targetHackMaxMoneyPerSecond.money = hackMaxMoneyPerSecond;
            targetHackMaxMoneyPerSecond.hostname = server.hostname;
        }
        // hack threads always increase security by 0.002 // no need for ns.hackAnalyzeSecurity(1, server.hostname);
        const properties = {
            hackTime: hackTime,
            hackChance: hackChance,
            hackMoneyPercent: hackMoneyPercent,
            hackMoney: hackMoney,
            hackMaxMoney: hackMaxMoney,
            hackMoneyPerSecond: hackMoneyPerSecond,
            hackMaxMoneyPerSecond: hackMaxMoneyPerSecond,
        };
        Object.assign(server, properties);
    });

    network.forEach((server) => {
        server.targetHackMoneyPerSecond = (server.hostname === targetHackMoneyPerSecond.hostname);
        server.targetHackMaxMoneyPerSecond = (server.hostname === targetHackMaxMoneyPerSecond.hostname);
    });

    log(ns, `hackAnalyze() ${network.length} servers in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return network;
}

export function growAnalyze(ns: NS, network: NetworkServer[]) {
    const startPerformance = performance.now();
    const targetGrowMoneyPerSecond = {
        money: 0,
        hostname: "",
    };
    network.forEach((server) => {
        // skip servers I cant grow 
        if (server.moneyMax === 0 || server.hasAdminRights === false) { return; }
        log(ns, `growAnalyze ${server.hostname}`);
        const growTime = ns.getGrowTime(server.hostname) / 1000; // milliseconds
        // growth factor to get to maxMoney
        const growThreadsMoney = (server.moneyMax?? 0) - (server.moneyAvailable?? 0) ;
        const growthAnalyzeFactor = (server.moneyMax ?? 0) / (server.moneyAvailable ?? 1);      
        const growThreads = (growthAnalyzeFactor === 1) ? 0 : ns.growthAnalyze(server.hostname, growthAnalyzeFactor);
        // How much money will each thread grow? 
        const growMoney = (growThreads === 0) ? 0 : growThreadsMoney / growThreads;
        const growMoneyPerSecond = (growMoney === 0) ? 0 : growMoney / growTime; 
        if (growMoneyPerSecond > targetGrowMoneyPerSecond.money && server.hostname !== "n00dles") {
            targetGrowMoneyPerSecond.money = growMoneyPerSecond;
            targetGrowMoneyPerSecond.hostname = server.hostname;
        }
        // growThreadSecurity is always 0.0040; // ns.growthAnalyzeSecurity(1, server.hostname);
        const weakenTime = ns.getWeakenTime(server.hostname) / 1000; // milliseconds
        const weakenSecurity = (server.hackDifficulty ?? 0) - (server.minDifficulty ?? 0);
        const weakenThreads = weakenSecurity / 0.0500;
        // weakenSecurity is always 0.0500; // ns.weakenAnalyze(1);

        const properties = {
            growTime: growTime,
            growthAnalyzeFactor: growthAnalyzeFactor,
            growThreads: growThreads,
            growThreadsMoney: growThreadsMoney,
            growMoney: growMoney,
            growMoneyPerSecond: growMoneyPerSecond,
            weakenTime: weakenTime,
            weakenThreads: weakenThreads,
        };
        Object.assign(server, properties);
    });
    network.forEach((server) => {
        server.targetGrowMoneyPerSecond = (server.hostname === targetGrowMoneyPerSecond.hostname);
    });
    log(ns, `growAnalyze() ${network.length} servers in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return network;
}
