//import { log, color, printColors } from "log.js";
import { log } from "log.js";
import {
    filterTargetMap, sortMapByProperty, filterBotNetMap, analyzeNetworkMap, analyzeHackNetworkMap, sumMaxRam,
} from "network.js";
// import { portMap } from "network.js"; // not a function... supposedly should work but netscript nerfed?
import { saveMapData, readMapData } from "network.js";
import { showDashboard } from "dashboard03.js";

// RAM 3.8 GB without doing 'exec' or 'run'

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
    let botNetMap = new Map();
    let targetMap = new Map();
    let pid = 0;


    const dataFilePath = ns.args[0];

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
            currentHackingLevel = ns.getHackingLevel();
            log(ns, `hacking level upgraded to ${currentHackingLevel}`, "SUCCESS");
            hackingLevelUpgrade = true;
        }

        // read the full networkMap
        networkMap = readMapData(ns, dataFilePath);

        // filter the botNet servers that I can run scripts on
        botNetMap = filterBotNetMap(ns, networkMap);
        botNetMap.delete("home"); // I am using home for this analyze script, later replace this to filter servers with available ram

        // filter the targets at or below my current hacking level (just filter the botNet servers, the servers I have admin rights on)
        targetMap = filterTargetMap(ns, botNetMap, currentHackingLevel);

        // Analyze targets for grow and weaken stats. Changes based on the security level of the server and hacking level.
        // Refresh stats for target server after performing h/g/w and refresh stats for all target servers after hacking level upgrade.
        targetMap = analyzeNetworkMap(ns, targetMap); 

        // Analyze servers for hack stats.
        targetMap = analyzeHackNetworkMap(ns, targetMap); 

        // Sort the target to hack, grow, weaken
        targetMap = sortMapByProperty(ns, targetMap, ["hackMaxMoneyPerSecond"]);
          
        /*
            Next section of code calculates target threads to get the hackMaxMoneyPerSecond
        */      
        const currentTargetHostname = targetMap.keys().next().value; // get the value of the first key (hostname)
        const targetMoneyAvailable = targetMap.get(currentTargetHostname).moneyAvailable;
        const targetMoneyMax = targetMap.get(currentTargetHostname).moneyMax;

        /*
            Calculate number of grow threads to get up to maxMoney
        */
        const targetGrowMoney = targetMoneyMax - targetMoneyAvailable;
        // growMoney2x is from growthAnalyze estimated money per grow thread
        const targetGrowThreads = Math.floor(targetGrowMoney / targetMap.get(currentTargetHostname).growMoney2x);
        log(ns, `${currentTargetHostname} needs ${targetGrowThreads} grow threads for \$${targetGrowMoney} up to maxMoney`);

        /*  Calculate number of weaken threads for sustainable growth
            Each Grow increases security by 0.004
            Each Weaken reduces security by 0.05 so sustainable growth requires 1 weaken per 12.5 grows 
        */
        let targetWeakenThreads = Math.floor(targetGrowThreads / 12.5);

        /*
            Calculate additional weaken threads to get to minSecurity. Security effects hack chance but mostly affects time to hack, 
            so even though I may have a high hack chance, I still want to reduce the hack time to maximize my income.
            Based on what I know so far, min security wont have significant imapct so dont want to rush and get min security
            but iterate down towards min security over time and then sustain it.
        */
        const targetSecurity = Math.floor(targetMap.get(currentTargetHostname).hackDifficulty);
        const targetSecurityMin = targetMap.get(currentTargetHostname).minDifficulty;
        // each Weaken reduces security by 0.05 so each security level requires 20 weaken per level
        targetWeakenThreads += (targetSecurity - targetSecurityMin) * 20;
        log(ns, `${currentTargetHostname} needs ${targetWeakenThreads} weaken threads for sustainable growth`);
    

        /*  ----------------------------------------------------------------------
            Calculate minimum income and reserve some threads for continuous hack grow weaken threads
            These sustainable hack/weaken threads will continue to draw down money while most of the theads are growing the target
        */

        const botNetMaxRam = sumMaxRam(ns, botNetMap);
        const growThreadRam = 1.75; // grow or weaken script requires 1.75 GB per thread
        const botNetThreadsMax = Math.floor(botNetMaxRam / growThreadRam); // this is approximate, we cant split a thread across servers

        const minIncomeThreadPercent = 0.2;
        const minIncomeThreadsMax = Math.floor(botNetThreadsMax * minIncomeThreadPercent);

        // each Hack increases security by 0.002
        // each Weaken reduces security by 0.05 so maintain security requires 1 weaken per 25 hacks 
        let minIncomeWeakenThreads = minIncomeThreadsMax / 25;

        // Find server with highest hack money per second
        const minIncomeMap = sortMapByProperty(ns, targetMap, ["hackMoneyPerSecond"]);
        const currentMinIncomeHostname = minIncomeMap.keys().next().value; // get the value of the first key (hostname)

        // how much income per cycle, how many grow threads to grow back what I stole?
        const minIncomeHackMoney = targetMap.get(currentMinIncomeHostname).hackMoney * minIncomeThreadsMax;
        const minIncomeGrowThreads = minIncomeHackMoney / targetMap.get(currentMinIncomeHostname).growMoney2x;

        /*  Calculate number of weaken threads for sustainable growth
            Each Grow increases security by 0.004
            Each Weaken reduces security by 0.05 so sustainable growth requires 1 weaken per 12.5 grows 
        */
        minIncomeWeakenThreads = minIncomeWeakenThreads + (minIncomeGrowThreads / 12.5);

        log(ns, `${currentMinIncomeHostname} with ${minIncomeThreadsMax} hack threads of max ${botNetThreadsMax} threads will generate $${minIncomeHackMoney}`);
        log(ns, `${currentMinIncomeHostname} needs ${minIncomeGrowThreads} grow and ${minIncomeWeakenThreads} weaken threads for sustainable income.`);


        /*
         *  Dashboard03.js only needs base 1.6 GB but we cannot run it at same time as start.js due to RAM limit
         *  the ns.run adds 1 GB
         */        
        saveMapData(ns, targetMap, "targetMap", 2);
        showDashboard(ns, "/data/targetMap.txt");



        let writeSuccess = false;
        ns.clearPort(3);
        ns.clearPort(4);


        /*
            Queue a request target Grow threads
        */
        //log(ns, `Request ${currentTargetHostname} grow with ${targetGrowThreads} threads`, "INFO");



        //writeSuccess = ns.tryWritePort(3, JSON.stringify([currentTargetHostname, "g", botNetThreadsAvailable]));



        /*
            Queue a request to grow our current target by botNetThreadsAvailable
        log(ns, `Request ${currentTargetHostname} grow with ${botNetThreadsAvailable} threads`, "INFO");
        writeSuccess = ns.tryWritePort(3, JSON.stringify([currentTargetHostname, "g", botNetThreadsAvailable]));

        /*
            Queue a request to sustain our income by sustainableThreadsAvailable
        log(ns, `Request ${currentTargetHostname} sustain with ${sustainableThreadsAvailable} threads`, "INFO");
        writeSuccess = ns.tryWritePort(4, JSON.stringify([currentTargetHostname, "s", sustainableThreadsAvailable]));
        */

        ns.exit();

        /*
            I know how the current botNet max threads and how many grow/weaken threads and how many hack/weaken threads to run.
            I need to run the right number of threads on the botNet servers.

            Loop servers but keep high ram servers for sustainable multithread hacks to maximize income
            This first experiment requires agent(s) to continuously poll for work when they are done.
            
            Initially allocate high ram to sustainable queue. Will need to experiment how to 'interupt' or reset thread counts
            as analysis changes over time.

            Desigate high ram servers to continuously poll the sustainable queue until queue is empty
            Desigate low ram servers to continuously poll the target queue until queue is empty

            Will need to add in a weaken thread to the mix somehow.

        */






        /*
         *  Start hacking the target
         *  If hack chance is high then run multi-threaded to maximize income.
         *  If hack chance is low then run multiple single-threaded to maximize chance of success
         */
        /*
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
        //*/

        log(ns, `start.js completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");

        /*
        while (ns.isRunning(pid)) {
            await ns.sleep(200);
        }
        */

    }

}


/*

Rather than waiting to hit level 50 and then spend time creating BruteSSH.exe program, we will already start to have lower income returns.
Spending money to purchase servers we will already have diminishing return and need to start growing/weakening.
Instead consider spending the first 200k on Tor router and buy BruteSSH.exe for 500k so we unlock next level of servers to hack. 

*/