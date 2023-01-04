// import { functionName, functionName2 } from "./utils.js"
// RAM 2.70 GB (base, run, hack)

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

    var pid = ns.run("/malware/virus.js", 1, `--targets=${JSON.stringify(targets)}`, `--files=${JSON.stringify(files)}`);
    await ns.sleep(20);

    /*
     * 2. Exec hack threads on n00dles and foodnstuff.
     */

    // exec hack.js from n00dles with 2 threads on target foodnstuff
    ns.run("/malware/exec.js", 1, "/malware/hack.js", "n00dles", 2, "foodnstuff");
    await ns.sleep(20);

    // exec hack.js from foodnstuff with 9 threads on target foodnstuff
    ns.run("/malware/exec.js", 1, "/malware/hack.js", "foodnstuff", 9, "foodnstuff");
    await ns.sleep(20);

    /* 
     * 3. Run hack threads on home.
    */

    ns.run("/malware/hack.js", 1, "foodnstuff");
    ns.run("/malware/hack.js", 1, "foodnstuff");
    ns.run("/malware/hack.js", 1, "foodnstuff");
    await ns.hack("foodnstuff");


    /* 
     * 4. Repeat if needed.
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