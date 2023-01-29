// import { functionName, functionName2 } from "./utils.js"
// RAM 2.90 GB (base, run, scan, hack)

/** @param {NS} ns **/
export async function main(ns) {

    var hackingLevel = 1;
    var hackingExp = 0.000;
    var newHackingLevel;
    ns.disableLog('ALL');
    ns.tail();

    while (true) {
        newHackingLevel = ns.getHackingLevel();
        if (newHackingLevel > hackingLevel) {
            hackingLevel = newHackingLevel;
            hackingExp = ns.getPlayer().exp.hacking;
            ns.printf("Level %d: %.3f %s", hackingLevel, hackingExp, ns.nFormat(ns.getTimeSinceLastAug()/1000,"0:0"));
        }
        await ns.sleep(10);
    }

    /* Go to university and do the "Algorithms" course 8 exp/second.
    Will cost money, but game allows you to go millions into debt!
    Reach hacking level 50 in 4 minutes just at university.

    Hacking level = 17 + level * 0.6 
    exp slowing increasing by 1 exp per level

    Level 1: 1.000 
    Level 2: 17.600 0:00:11
    Level 3: 35.200 0:00:13
    Level 4: 52.800 0:00:15
    Level 5: 72.000 0:00:18
    Level 6: 91.200 0:00:20
    Level 7: 110.400 0:00:23
    Level 8: 131.200 0:00:25
    Level 9: 152.000 0:00:28
    Level 10: 174.400 0:00:31
    Level 11: 196.800 0:00:33
    Level 12: 220.800 0:00:36
    Level 13: 243.200 0:00:39
    Level 14: 268.800 0:00:42
    Level 15: 294.400 0:00:46
    Level 16: 320.000 0:00:49
    Level 17: 347.200 0:00:52
    Level 18: 376.000 0:00:56
    Level 19: 404.800 0:00:59
    Level 20: 433.600 0:01:03 <- level 20 in 1 minute!
    Level 21: 464.000 0:01:07
    Level 22: 496.000 0:01:11
    Level 23: 529.600 0:01:15
    Level 24: 563.200 0:01:19
    Level 25: 598.400 0:01:24
    Level 26: 633.600 0:01:28
    Level 27: 670.400 0:01:33
    Level 28: 708.800 0:01:37
    Level 29: 748.800 0:01:42
    Level 30: 788.800 0:01:47  <- 1st message from jump3r
    Level 40: 1273.600 0:02:48 <- 2nd message from jump3r
    Level 50: 1937.600 0:04:11 <- 1st message from CyberSec (est cost -$230k)
                                  unlocks programming BruteSSH.exe 
    */


}    