// import { functionName, functionName2 } from "./utils.js"
// RAM 2.70 GB (base, run, hack)

/** @param {NS} ns **/
export async function main(ns) {

    /* 1. Spread my malware to n00dles and foodnstuff
     * The only servers I can hack and run scripts on are n00dles and foodnstuff.
     * Infect them with a virus! Manually target them with the hack.js script.
     * Hardcode values for now, keep it simple!
     */
    const targets = ["n00dles", "foodnstuff"];
    const files = ["/malware/hack.js"];

    var pid = ns.run("/malware/virus.js", 1, `--targets=${JSON.stringify(targets)}`, `--files=${JSON.stringify(files)}`);

    /* 2. Exec hack threads on n00dles and foodnstuff
     */

    // default is script hack.js 1 thread which has default target foodnstuff 1 iteration.
    const args = ["--target=joesguns", "foo", "bar"];
    const argstring = "--target=joesguns, foo, bar";
    //ns.run("/malware/exec.js", 1, `--script=/malware/hack.js`, `--host=n00dles`, `--threads=2`, `--argstring=${JSON.stringify(args)}`);
    ns.run("/malware/exec.js", 1, `--script=/malware/hack.js`, `--host=n00dles`, `--threads=2`, `--argstring="${argstring}"`,  `--args=${JSON.stringify(args)}`);

    // I want to run spawn.js to launch remote jobs in background without waiting for it to finish... 
    // but it seems to take ages to complete and continues consuming RAM...
    //const pid = ns.run("/malware/spawn.js");
    //while (ns.isRunning(pid)) { // isRunning costs RAM! so manual sleep!
        await ns.sleep(1000);
    //}

    // so close...! we run 3 threads not 4.
    // run 2 iterations of 4 threads on home
    // not enough ram while spawn is still running
    // spawn 3 threads and then 1 hack here

    /* 3. Spawn threads on home.....
     * A-ha! I cant spawn 4 hack-only threads on home without killing this script
     * but I can spawn 3 hack-only threads and run a 4th hack in this script!
    */

    //  WE HAVE TO WAIT FOR THE ABOVE SCRIPTS TO TERMINATE AND RELEASE RAM ON HOME
    //const pid = ns.run("/malware/spawn.js");
    //while (ns.isRunning(pid)) { // isRunning costs RAM! so manual sleep!
    await ns.sleep(1000);
    //}


    for(let t=1;t<=3;t++) {        
        // add t (thread) as argument so easier to see how many active script threads are running
        ns.run("/malware/hack.js", 1, `--target=foodnstuff`, t); 
    }
    // bonus hack within this script
    //for(let i=1;i<=2;i++) {        
        //await ns.hack("foodnstuff");
    //}

    // on foodnstuff
    // each successful hack gains 6 exp points.
    // each failed hack gains 1.5 exp points.
    // this is different on each server. on noodles only gain 3.3 exp for successful hack

    //var hackSkill = ns.getHackingLevel;
    //ns.printf(`Hack Skill: %d`, hackSkill);

    

}