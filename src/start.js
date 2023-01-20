//import { log, color, printColors } from "log.js";
import { log } from "log.js";
import {
    scanNetworkMap, getNetworkMap, getNetworkMapServers, getVulnerableServers, getHackTargetMap, analyzeHackTargetMap,
    sortMapByProperty, getBotNetServers
} from "network.js";
import { virusNetwork, copyFilePattern } from "cracks.js";
import { saveMapData } from "network.js";
import { showDashboard } from "dashboard03.js";

// RAM 2.90 GB (base, run, scan, hack)

/** @param {NS} ns **/
export async function main(ns) {

    /*
     * Strategy: Grow $ fast as possible (so that I can purchase servers to grow / weaken what I have stolen)
     * I can hack n00dles for  $2.49/second or foodnstuff for $7.5k/second.
     * I can grow n00dles for $49.07/second or foodnstuff for $3.52/second.
     * Its not worth trying to grow or weaken with such a low hacking level at the very start.
     * 
     * To maintain a server at current security, I should do 1 weaken every successful 25 hacks.
     * Although foodnstuff likely increased from security level 5 to 10 quickly, by this time 
     * foodnstuff is getting below $6k/hack and growth is very slow, so more value in switching to sigma-cosmetics.
     * 
     */

    /*
     *  Find and exploit vulnerable servers.
     *  Find hackable servers and select target server.
     *  Continuously hack $ until unable to maintain $/sec or maintain hack skill/sec
     */

    let currentHackMoneyPerSecond = 0;
    let newHackMoneyPerSecond = 0;
    let currentHackingLevel = 0;
    let newHackingLevel = 0;
    let hackingLevelUpgrade = false;
    let networkMap = new Map();
    let vulnerableServers = new Map();
    let hackTargetMap = new Map();
    let botNetServerMap = new Map();
    let pid = 0;


    while (true) {

        ns.clearLog();
        ns.tail();
        const startPerformance = performance.now();

        /*
         *  Has hacking level increased?
         */

        hackingLevelUpgrade = false;
        newHackingLevel = ns.getHackingLevel();
        if (newHackingLevel != currentHackingLevel) {
            if (currentHackingLevel < 50 && newHackingLevel >= 50) {
                /* At this point we should focus on getting cracks to hack higher level servers 
                */
                ns.alert ("New Program unlocked! Create new crack to open locked ports.")
            }
            currentHackingLevel = ns.getHackingLevel();
            log(ns, `hacking level upgraded to ${currentHackingLevel}`, "SUCCESS");
            hackingLevelUpgrade = true;
        }

        /*
         *  Scan network map (get basic server stats).
         */

        if (networkMap.size == 0) {
            networkMap = scanNetworkMap(ns, 3);
            networkMap = getNetworkMap(ns, networkMap);
        };


        /*
         *  Exploit vulnerable servers (if new cracks are available).
         */

        if (vulnerableServers.size == 0) { // change this to determine if new cracks are available
            log(ns, `checking for vulnerableServers ${vulnerableServers.size}`);
            vulnerableServers = getVulnerableServers(ns, networkMap);
            if (vulnerableServers.size > 0) {
                virusNetwork(ns, vulnerableServers);
            }
        }

        /*
         *  Get botNet servers (all servers I have admin rights to run scripts)
         */

        if (botNetServerMap.size == 0) { // change this to determine if I have purchased or exploited new servers
            botNetServerMap = getBotNetServers(ns, networkMap);
            botNetServerMap.delete("home");
            copyFilePattern(ns, botNetServerMap, "/malware/");
        }

        /*
         *  Analyze network for target server.
         */

        if (hackingLevelUpgrade) {
            hackTargetMap = getHackTargetMap(ns, networkMap, currentHackingLevel);
        }

        const sortedhackTargetMap = sortMapByProperty(ns, analyzeHackTargetMap(ns, hackTargetMap), "hackMoneyPerSecond");
        saveMapData(ns, sortedhackTargetMap, "target");


        /*
         *  Dashboard03.js only needs base 1.6 GB but we cannot run it at same time as start.js due to RAM limit
         *  the ns.run adds 1 GB
         */        
        // pid = ns.run("dashboard03.js", 1, "/data/target.txt");  
        // log(ns, `dashboard pid=${pid}`);
        // ns.tail(pid);
        showDashboard(ns, "/data/target.txt");

        const currentHackTargetHostname = sortedhackTargetMap.keys().next().value; // get the value of the first key (hostname)
        const currentHackTargetChance = networkMap.get(currentHackTargetHostname).hackChance;
        newHackMoneyPerSecond =  networkMap.get(currentHackTargetHostname).hackMoneyPerSecond;
        if (newHackMoneyPerSecond < currentHackMoneyPerSecond) {
            log(ns, `\$${(newHackMoneyPerSecond.toFixed(2))}/sec is less than current \$${(currentHackMoneyPerSecond.toFixed(2))}/sec `, "WARN");    
        }
        currentHackMoneyPerSecond = newHackMoneyPerSecond;
        log(ns, `${(currentHackTargetChance * 100).toFixed(2)}% hack chance on ${currentHackTargetHostname} \$${(currentHackMoneyPerSecond).toFixed(2)}/sec`);

        /*
         *  Start hacking the target
         *  If hack chance is high then run multi-threaded to maximize income.
         *  If hack chance is low then run multiple single-threaded to maximize chance of success
         */

        const hackScriptRam = 1.7;
        pid = 0;
        botNetServerMap.forEach((server, hostname) => {

            const threads = Math.floor(server.maxRam / hackScriptRam);

            if (currentHackTargetChance * 100 > 80) {
                log(ns, `hack from ${hostname} with ${threads} threads`, "INFO");
                pid = ns.exec("/malware/hack.js", hostname, threads, currentHackTargetHostname, threads);
            } else {
                log(ns, `hack from ${hostname} with ${threads}x1 thread`, "INFO");
                for (let t = 1; t <= threads; t++) {
                    pid = ns.exec("/malware/hack.js", hostname, 1, currentHackTargetHostname);
                    // await ns.sleep(20);
                }
            }
        });

        log(ns, `start.js completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");

        while (ns.isRunning(pid)) {
            await ns.sleep(200);
        }

        const exit = await ns.prompt("Hacking completed... Exit?");
        if (exit) {
            ns.exit();
        }

    }

}


/*

Rather than waiting to hit level 50 and then spend time creating BruteSSH.exe program, we will already start to have lower income returns.
Spending money to purchase servers we will already have diminishing return and need to start growing/weakening.
Instead consider spending the first 200k on Tor router and buy BruteSSH.exe for 500k so we unlock next level of servers to hack. 

*/