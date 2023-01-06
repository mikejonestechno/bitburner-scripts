/** @param {NS} ns **/
import * as log from "log.js";
// RAM 4.00 GB (try to keep below 4.00 GB so can run on n00dles)

export async function main(ns) {

    ns.disableLog('ALL');

    var refreshInterval;
    if (ns.args[1] == undefined) {
        refreshInterval = 2000;
    } else {
        refreshInterval = ns.args[1];
    }

    // hostnames is comma separated list of hosts, just scan 1 deep for now
    var hostnames;

    if (ns.args[0] == undefined) {
        ns.tprint("Exit: hostnames is undefined.");
        ns.exit();
        //hostnames = ns.scan();  // (0.2 GB)
    } else {
        hostnames = ns.args[0].split(",");
    }

        /*  Sample output at start of game
            hostname      chance  hack $ avail  $/hack   $/sec  'g'    grow  $/grow   $/sec sec   h sec   g sec
            n00dles          42% 0.41%  70.00k  288.75    2.49 3000 11.052%   7.74k   49.07   1      49     158
            foodnstuff       39% 0.38%   2.00m   7.50k   56.20    5  0.015%  300.00    1.82  10      51     165
        */

    ns.tail();   
           
    while(true) {
        // pixel width, height = 53 + 7 servers * 27.77 = 250
        ns.resizeTail(960, 53 + (hostnames.length * 25));

        ns.printf(`${log.color.cyan}%s%s%s%s%s%s%s%s%s%s%s%s%s`, 
        "hostname".padEnd(14), // allow chance heading to overlap
        "chance".padStart(0), 
        "hack".padStart(6), 
        "$ avail".padStart(8), 
        //"%".padStart(4), 
        //"$ max".padStart(8), 
        "$/hack".padStart(8), 
        "$/sec".padStart(8), 
        "'g'".padStart(5), 
        "grow".padStart(8),
        "$/grow".padStart(8),
        "$/sec".padStart(8), 
        "sec".padStart(4), 
        //"min".padStart(4),
        //"req".padStart(4),
        "h sec".padStart(8),
        "g sec".padStart(8),
        //"w sec".padStart(8),
        );  

        for(var hostname of hostnames) {
            // get server info by separate methods (2.55 GB)
            var server = {
                hostname: hostname,

                // server stats (0.1 GB each)
                moneyAvailable: ns.getServerMoneyAvailable(hostname),
                //moneyMax: ns.getServerMaxMoney(hostname),
                security: ns.getServerSecurityLevel(hostname),
                //securityMinimum: ns.getServerMinSecurityLevel(hostname),
                //hackingSkillRequired: ns.getServerRequiredHackingLevel(hostname),
                growthRate: ns.getServerGrowth(hostname),

                // time (0.05) depends on hacking skill and server security
                hackTime: ns.getHackTime(hostname),
                growTime: ns.getGrowTime(hostname),
                //weakenTime: ns.getWeakenTime(hostname),

                // chance (1 GB each)
                hackChance: ns.hackAnalyzeChance(hostname),
                hackMoneyPercent: ns.hackAnalyze(hostname),
            };
            
            ns.printf(`${log.color.white}%s%s%s%s%s%s%s%s%s%s%s%s%s`, 
            hostname.padEnd(16), 
            ns.nFormat(server.hackChance,"0%").padStart(4), 
            ns.nFormat(server.hackMoneyPercent,"0.00%").padStart(6),
            ns.nFormat(server.moneyAvailable,"0.00a").padStart(8), 
            //ns.nFormat((server.moneyAvailable/server.moneyMax),"0%").padStart(4), 
            //ns.nFormat(server.moneyMax,"0.00a").padStart(8),
            ns.nFormat(server.hackMoneyPercent * server.moneyAvailable,"0.00a").padStart(8), 
            ns.nFormat((server.hackChance * server.hackMoneyPercent * server.moneyAvailable)/(server.hackTime/1000),"0.00a").padStart(8), 
            ns.nFormat(server.growthRate,"0").padStart(5),
            // base growthPercent = grow/sec * 0.0003 (slightly improve if weakened below base security)
            // but n00dles is nerfed
            // Can also calculate this number from ns.growthAnalyze (1 GB) and calc the % of growth per thread
            ns.nFormat(hostname=='n00dles'?0.11052:(server.growthRate/server.security*0.0003),"0.000%").padStart(8),
            ns.nFormat((hostname=='n00dles'?0.11052:(server.growthRate/server.security*0.0003))*server.moneyAvailable,"0.00a").padStart(8),
            ns.nFormat(((hostname=='n00dles'?0.11052:(server.growthRate/server.security*0.0003))*server.moneyAvailable)/(server.growTime/1000),"0.00a").padStart(8),

            //ns.nFormat(ns.growthAnalyze(hostname,(hostname=='n00dles'?0.11052:(server.growthRate/server.security*0.0003))+1),"0.00").padStart(8),

            ns.nFormat(server.security,"0").padStart(4),
            //ns.nFormat(server.securityMinimum,"0").padStart(4),
            //ns.nFormat(server.hackingSkillRequired,"0").padStart(4),
            ns.nFormat(server.hackTime/1000,"0").padStart(8),
            ns.nFormat(server.growTime/1000,"0").padStart(8),
            //ns.nFormat(server.weakenTime/1000,"0").padStart(8),
            );
        }
        await ns.sleep(refreshInterval);
    }
}