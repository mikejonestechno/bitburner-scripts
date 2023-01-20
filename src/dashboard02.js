/** @param {NS} ns **/
import * as log from "log.js";
// RAM 5.00 GB (try to keep below 5.3 GB so can run in parallel with start.js)

export async function main(ns) {

    ns.disableLog('ALL');

    var refreshInterval;
    if (ns.args[1] == undefined) {
        refreshInterval = 1000;
    } else {
        refreshInterval = ns.args[1];
    }
    
    // hostnames is comma separated list of hosts, just scan 1 deep for now
    var hostnames;
    if (ns.args[0] == undefined) {
        hostnames = ns.scan();  // (0.2 GB)
    } else {
        hostnames = ns.args[0].split(",");
    }

        /* Sample output at start of game

        Hacking Skill	1 (0.000 exp) 0:00:12
        hostname      chance  hack $ avail   %   $ max  $/hack   $/sec  'g'    grow  $/grow   $/sec sec min req   h sec   g sec   w sec
        n00dles          42% 0.41%  70.00k  4%   1.75m  288.75    2.49 3000 11.052%   7.74k   49.07   1   1   1      49     158     197
        foodnstuff       39% 0.38%   2.00m  4%  50.00m   7.50k   56.20    5  0.015%  300.00    1.82  10   3   1      51     165     206
        sigma-cosmetics   0% 0.00%   2.30m  4%  57.50m    0.00    0.00   10  0.030%  690.00    3.52  10   3   5      61     196     245
        joesguns          0% 0.00%   2.50m  4%  62.50m    0.00    0.00   20  0.040% 1000.00    3.64  15   5  10      86     275     343
        hong-fang-tea     0% 0.00%   3.00m  4%  75.00m    0.00    0.00   20  0.040%   1.20k    2.35  15   5  30     159     510     637
        harakiri-sushi    0% 0.00%   4.00m  4% 100.00m    0.00    0.00   40  0.080%   3.20k    5.10  15   5  40     196     627     784
        iron-gym          0% 0.00%  20.00m  4% 500.00m    0.00    0.00   20  0.020%   4.00k    1.59  30  10 100     784    2510    3137
        */

    ns.tail();

    while(true) {

        // pixel width, height = 55.55 + 7 servers * 27.77 = 250
        ns.resizeTail(1240, 250);

        /*
        * Player hacking skill / experience stats 
        */
        var player = {
            hacking: {
                // get hacking skill level (0.05 GB)
                skill:  ns.getHackingLevel(),
                // getPlayer hacking experience (0.5 GB)
                exp: ns.getPlayer().exp.hacking
            }
        };

        // (0.1 GB) Consider showing how exp much we expect to gain from active scripts
        //ns.printf(`activeScriptExpGain:`, ns.getScriptExpGain());

        ns.printf(`${log.color.yellow}Hacking Skill\t%d (%.3f exp) %s`, player.hacking.skill, player.hacking.exp, ns.nFormat(ns.getTimeSinceLastAug()/1000,"0:0"));
    
        ns.printf(`${log.color.cyan}%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s`, 
        "hostname".padEnd(14), // allow chance heading to overlap
        "chance".padStart(0), 
        "hack".padStart(6), 
        "$ avail".padStart(8), 
        "%".padStart(4), 
        "$ max".padStart(8), 
        "$/hack".padStart(8), 
        "$/sec".padStart(8), 
        "'g'".padStart(5), 
        "grow".padStart(8),
        "$/grow".padStart(8),
        "$/sec".padStart(8), 
        "sec".padStart(4), 
        "min".padStart(4),
        "req".padStart(4),
        "h sec".padStart(8),
        "g sec".padStart(8),
        "w sec".padStart(8),
        );  

        for(var hostname of hostnames) {
            // get server info by separate methods (2.55 GB)
            var server = {
                hostname: hostname,

                // server stats (0.1 GB each)
                moneyAvailable: ns.getServerMoneyAvailable(hostname),
                moneyMax: ns.getServerMaxMoney(hostname),
                security: ns.getServerSecurityLevel(hostname),
                securityMinimum: ns.getServerMinSecurityLevel(hostname),
                hackingSkillRequired: ns.getServerRequiredHackingLevel(hostname),
                growthRate: ns.getServerGrowth(hostname),

                // time (0.05) depends on hacking skill and server security
                hackTime: ns.getHackTime(hostname),
                growTime: ns.getGrowTime(hostname),
                weakenTime: ns.getWeakenTime(hostname),

                // chance (1 GB each)
                hackChance: ns.hackAnalyzeChance(hostname),
                hackMoneyPercent: ns.hackAnalyze(hostname),
            };
            
            ns.printf(`${log.color.white}%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s%s`, 
            hostname.padEnd(16), 
            ns.nFormat(server.hackChance,"0%").padStart(4), 
            ns.nFormat(server.hackMoneyPercent,"0.00%").padStart(6),
            ns.nFormat(server.moneyAvailable,"0.00a").padStart(8), 
            ns.nFormat((server.moneyAvailable/server.moneyMax),"0%").padStart(4), 
            ns.nFormat(server.moneyMax,"0.00a").padStart(8),
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
            ns.nFormat(server.securityMinimum,"0").padStart(4),
            ns.nFormat(server.hackingSkillRequired,"0").padStart(4),
            ns.nFormat(server.hackTime/1000,"0").padStart(8),
            ns.nFormat(server.growTime/1000,"0").padStart(8),
            ns.nFormat(server.weakenTime/1000,"0").padStart(8),
            );
        }
        //await ns.sleep(refreshInterval);
        ns.spawn("dashboard02.js");
    }
}