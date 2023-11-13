import { NS, SpawnOptions } from "@ns";
import { main as initializeData } from "util/data";
import { main as scanAnalyze } from "util/scanAnalyze";
import { main as nukeServers } from "util/crack";

export function main(ns: NS) {

    /* 
     * Delete all data files in data directory
     */
    // The ns.rm() adds 1GB RAM cost so manually run util/reset.js for now // reset(ns); 

    /*
     *  Initialize player.txt data file (money, hacking level, location, etc.) 
     *  This is used to generate other data files for the current city.
     */
    initializeData(ns);
    
    /*
     *  Scan network servers (get basic stats for each server and save network.txt data file).
     */
    scanAnalyze(ns, 50, true, true);
  
    /*
     *  Exploit vulnerable servers (run NUKE.exe).
     */  
    nukeServers(ns);
    
    /*
     * We've run out of RAM to analyze. Spawn new script to analyze and take next actions.
     */
    ns.clearPort(1);
    ns.tryWritePort(1, "util/dashboard.js");

    const spawnOptions: SpawnOptions = {
        threads: 1,
        spawnDelay: 100,
    };
    ns.tprint("spawning control.js");
    ns.spawn("util/control.js", spawnOptions);

}
