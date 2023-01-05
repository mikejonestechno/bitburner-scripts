// import { functionName, functionName2 } from "./utils.js"
// RAM 4.90 GB (try to keep below 5.3 GB so can run in parallel with start.js)


/** @param {NS} ns **/
export async function main(ns) {

    ns.disableLog('ALL');

    ns.tail();
    ns.resizeTail(720, 512);

    // hostnames is comma separated list of hosts
    var hostnames;
    if (ns.args[0] == undefined) {
        hostnames = ns.scan();
    } else {
        hostnames = ns.args[0].split(",");
    }

    //ns.print(typeof hostnames);
    //ns.print(hostnames);

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

    ns.printf(`Hacking Skill\t%d (%.3f exp)`, player.hacking.skill, player.hacking.exp);
  
   /*
     * Server hacking - What stats would be useful to measure?
     * hack chance
     * money steal / avail (% avail) / max /
     * time
     * security / min
     * hacking skill increase (if success) - is this possible to calc?
     */

    ns.printf(`%s%s%s%s%s%s%s%s%s%s`, 
    "hostname".padEnd(16), 
    "chance".padStart(6), 
    "$ hack".padStart(8), 
    "$/sec".padStart(8), 
    "$ avail".padStart(8), 
    "$ max".padStart(8), 
    "sec".padStart(4), 
    "min".padStart(4),
    "req".padStart(4),
    "hack".padStart(8),
    );  

    for(var hostname of hostnames) {

        var server = {
            hostname: hostname,
            // server stats (0.1 GB each)
            moneyAvailable: ns.getServerMoneyAvailable(hostname),
            moneyMaximum: ns.getServerMaxMoney(hostname),
            security: ns.getServerSecurityLevel(hostname),
            securityMinimum: ns.getServerMinSecurityLevel(hostname),
            // hack time (0.05) depends on hacking skill and server security
            hackTime: ns.getHackTime(hostname),
            // (1 GB each)
            hackChance: ns.hackAnalyzeChance(hostname),
            hackMoneyPercent: ns.hackAnalyze(hostname),
            // var hackMoney = hackMoneyPercent * moneyAvailable;
            hackingSkillRequired: ns.getServerRequiredHackingLevel(hostname),
        }
        ns.printf(`%s%s%s%s%s%s%s%s%s%s`, 
        hostname.padEnd(16), 
        ns.nFormat(server.hackChance, "0%").padStart(6), 
        ns.nFormat(server.hackMoneyPercent * server.moneyAvailable,"0.00a").padStart(8), 
        ns.nFormat((server.hackMoneyPercent * server.moneyAvailable)/(server.hackTime/1000),"0.00a").padStart(8), 
        ns.nFormat(server.moneyAvailable,"0.00a").padStart(8), 
        ns.nFormat(server.moneyMaximum,"0.00a").padStart(8),
        ns.nFormat(server.security,"0").padStart(4),
        ns.nFormat(server.securityMinimum,"0").padStart(4),
        ns.nFormat(server.hackingSkillRequired,"0").padStart(4),
        ns.nFormat(server.hackTime/1000,"mm:ss").padStart(8),
        );
    }
}