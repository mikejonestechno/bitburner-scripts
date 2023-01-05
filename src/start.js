// import { functionName, functionName2 } from "./utils.js"
// RAM 2.75 GB (base, run, hack)

/** @param {NS} ns **/
export async function main(ns) {

    /* 
     * 1. Spread my malware to n00dles and foodnstuff.
     * The only servers I can hack and run scripts on are n00dles and foodnstuff.
     * Infect them with a virus! Manually target them with the hack.js script.
     * We can't run parallel scripts with ns.exec on home with only 8 GB RAM.
     * Use ns.sleep and avoid using ns.isRunning which also consumes RAM.
     * Hardcode values for now, keep it simple! 
     */
    
    const targets = ["n00dles", "foodnstuff"];
    const files = ["/malware/hack.js"];

    ns.run("/malware/virus.js", 1, `--targets=${JSON.stringify(targets)}`, `--files=${JSON.stringify(files)}`);
    await ns.sleep(50);

    var pid = 0;

    while (true) {    
    /*
     * 2. Exec hack threads on n00dles and foodnstuff.
     */

    // manually monitor the server stats for now
    //ns.closeTail(pid) // close tail window from last iteration
    pid = ns.run("analyzeServers.js", 1); 
    ns.tail("analyzeServers.js");
    //ns.resizeTail(800, 800, pid); // doesnt seem to take effect?
    await ns.sleep(50);

    var exit = await ns.prompt(`Hacking Level: ${ns.getHackingLevel()}. Want to stop?`);
    if (exit) {
        ns.exit();
    }


    // exec hack.js from n00dles with 2 threads on target foodnstuff
    ns.run("/malware/exec.js", 1, "/malware/hack.js", "n00dles", 2, "foodnstuff");
    await ns.sleep(50);

    // exec hack.js from foodnstuff with 9 threads on target foodnstuff
    ns.run("/malware/exec.js", 1, "/malware/hack.js", "foodnstuff", 9, "foodnstuff");
    await ns.sleep(50);

    /* 
     * 3. Run hack threads on home.
    */

    ns.run("/malware/hack.js", 1, "foodnstuff");
    ns.run("/malware/hack.js", 1, "foodnstuff");
    ns.run("/malware/hack.js", 1, "foodnstuff");
    await ns.hack("foodnstuff");
    await ns.sleep(50);

    }

    /* 
     * 4. Repeat if needed.
     */

    /*
     * after 1 iteration level 4 (54)
     * foodnstuff drops from 7.5k/hack to 7.3k/hack.
     * 
     * after 2 iterations level 8 (139) 
     * foodnstuff would only return 6.93k/hack
     * while a maxed n00dles would return 7k/hack... 
     * while sigma-cosmetics is available to hack its 58% chance of $4.3k
     * 
     * after 3 iterations level 11 (216)
     * foodnstuff 85% chance of 6.62k
     * sigma-cosmetics 67% chance of 5.49k
     * while joesguns is available its 41% chance of 1.61k 
     * definitely need to think about a weaken or grow?
     * 
     * after 4 iterations level 15 (301)
     * foodnstuff 86% chance of 6.28k
     * sigma-cosmetics 73% chance of 6.33k
     * joesguns 53% chance on 3.54k
     * 
     * 
     */


    /*
     * on foodnstuff
     * each successful hack gains 6 exp points.
     * each failed hack gains 1.5 exp points.
     * this is different on each server. on noodles only gain 3.3 exp for successful hack
     * 15 hacks * 6 exp = 90 points
     * could be 22.5 to 90 exp.
     * 
     * 63 points = level 4
     */

    //var hackSkill = ns.getHackingLevel;
    //ns.printf(`Hack Skill: %d`, hackSkill);

    

}