// import { functionName, functionName2 } from "./utils.js"
// RAM 2.90 GB (base, run, scan, hack)

/** @param {NS} ns **/
export async function main(ns) {

    /*
     * Strategy: Grow $ fast as possible (so that I can purchase servers to grow / weaken what I have stolen)
     * I can hack n00dles for  $2.49/second or foodnstuff for $7.5k/second.
     * I can grow n00dles for $49.07/second or foodnstuff for $3.52/second.
     * Its not worth trying to grow or weaken with such a low hacking level at the very start.
     */

    const servers = ns.scan() // (0.2 GB)

    /*
     * Spread malware to all nuke-able servers.
     */
    ns.run("/malware/worm.js", 1);
    await ns.sleep(500);

    /*
     * Start hacking foodnstuff on all 16 GB servers (5 servers * 9 threads = 45 threads)
     */
    const target = "foodnstuff";
    for(const hostname of servers) {
        var threads = 0;
        var iterations = 1;
        switch (hostname) {
            case "n00dles" :
            case "iron-gym" :
                break;
            default:
                threads = 9;
            }
        if (threads > 0) {
            ns.run("/malware/exec.js", 1, "/malware/hack.js", hostname, threads, target, iterations);
            await ns.sleep(50);    
        }
    }

    /* 
     * Start Dashboard v1 on n00dles (4 GB)
     */
    ns.run("/malware/virus.js", 1, "n00dles", "dashboard01.js,log.js", servers.join());
    await ns.sleep(50);

    /* 
     * Run hack threads on home
     */
    ns.run("/malware/hack.js", 1, "foodnstuff");
    ns.run("/malware/hack.js", 1, "foodnstuff");
    ns.run("/malware/hack.js", 1, "foodnstuff");
    await ns.hack("foodnstuff");

    /* 
     * The future...?
     * At this point I have attempted 45 hacks on foodnstuff
     * Typically hacking level 13+ and $275k+
     * I could start purchasing servers (@2 GB / $110k)...
     * I could start a script to analyze and set hack target...
     * I could start a grow or weaken...
     * 
     * To maintain current security, I should do 1 weaken every successful 25 hacks.
     * Foodnstuff likely increased from security level 5 to 10 already.
     * However foodnstuff is getting below $6k/hack and growth is very slow, more value in switching to sigma-cosmetics.
     */

    //ns.run("/malware/weaken.js", 1, "sigma-cosmetics");

}