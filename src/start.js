// import { functionName, functionName2 } from "./utils.js"
// RAM 3.55 GB

/** @param {NS} ns **/
export async function main(ns) {

    const totalstart = performance.now()
    const serverNames = ["n00dles","foodnstuff"]
    const files = ["hack.js","grow.js"];

    /*
    serverNames.forEach(serverName => {
        var start = performance.now()
        // RAM cost: 0.05 GB
        // Time: 0 to 0.4 milliseconds
        ns.nuke(serverName);        
        ns.printf(`Time: \t%f milliseconds`, performance.now() - start);

        var start = performance.now()
        // RAM cost: 0.6 GB
        // Time: 5.4 to 5.6 milliseconds
        ns.scp(files, serverName); 
        ns.printf(`Time: \t%f milliseconds`, performance.now() - start);
    });
    // Time: 12.2 milliseconds for 2 servers
    //ns.tprintf(`Prep time: \t%f milliseconds`, performance.now() - totalstart);
    */

    // Try to launch hack on foodnstuff with 9 threads
    // run()   1.0GB - Run a script as a separate process. This function can only be used to run scripts located on the current server (the server running the script that calls this function).
    // exec()  1.3GB - Run a script as a separate process on a specified server. This is similar to the run function except that it can be used to run a script on any server, instead of just the current server.
    // spawn() 2.0GB - Terminates the current script, and then after a delay of about 10 seconds it will execute the newly-specified script. The purpose of this function is to execute a new script without being constrained by the RAM usage of the current one. This function can only be used to run scripts on the local server.

    var start = performance.now()
  
    const hostname = "foodnstuff";
    ns.nuke(hostname);
    ns.scp("hack.js", hostname);    
    ns.printf(`Prep time: \t%f milliseconds`, performance.now() - start);

    /* 
    Experiment 1: exec 2 iterations of 9 threads
    
    start = performance.now()
    for(let i=0;i<2;i++) {

        var pid =0;
        pid = ns.exec("hack.js", hostname, 9, hostname);
        while(ns.isRunning(pid)) {
            ns.printf(`Sleeping: \t%f milliseconds`, performance.now() - start);
            await ns.sleep(1000);
        }

    }
    ns.printf(`Hack time: \t%f milliseconds`, performance.now() - start);
    /* Results
    1:        $0 hacking skill 2 (27.000 exp) both iterations failed. 
    2:        $0 hacking skill 2 (27.000 exp) both iterations failed. 
    3:        $0 hacking skill 2 (27.000 exp) both iterations failed. 
    4:   $68.53k hacking skill 6 (94.500 exp) 1st success 2nd failed. 
    5: $133.735k hacking skill 6 (108.000 exp) both success. 
    6:   $68.53k hacking skill 4 (67.500 exp) 1st failed 2nd success. 
    7:   $68.53k hacking skill 4 (67.500 exp) 1st failed 2nd success. 
    8:   $68.53k hacking skill 4 (67.500 exp) 1st failed 2nd success. 
    9: $133.735k hacking skill 6 (108.000 exp) both success. 
   10: $133.735k hacking skill 6 (108.000 exp) both success. 
   11: $133.735k hacking skill 6 (108.000 exp) both success. 
   12:        $0 hacking skill 2 (27.000 exp) both iterations failed. 
    =   $67.427k Average
    */

    /* 
    Experiment 2: exec 2 iterations of 9 single-threads 
    Includes a small delay to stagger start times to hopefully 2nd iterations
    have improved hack chance from all prior iterations that just completed.  

    start = performance.now()
    for(let i=0;i<9;i++) {
        // run hack.js on host 1 thread against host for 2 iterations with pid
        ns.exec("hack.js", hostname, 1, hostname,2,i);
        // small delay to allow 2nd iteration to improve hack chance from all prior iterations into account
        await ns.sleep(500); 
    }
    ns.printf(`Hack time: \t%f milliseconds`, performance.now() - start);
    /* Results
    1: $103.487k hacking skill 7 (117.000 exp) 
    2:  $52.936k hacking skill 4 (58.000 exp) 
    3:  $30.859k hacking skill 3 (45.000 exp) 
    4: $110.600k hacking skill 6 (94.000 exp) 
    5:  $89.180k hacking skill 5 (81.000 exp) 
    6:  $81.986k hacking skill 5 (76.500 exp) 
    7: $110.600k hacking skill 6 (94.500 exp) 
    8:  $74.765k hacking skill 7 (117.000 exp) 
    9:  $96.347k hacking skill 5 (85.5000 exp) 
   10:  $81.986k hacking skill 5 (76.500 exp)  
   11:  $96.347k hacking skill 5 (85.5000 exp)  
   12:  $60.240k hacking skill 4 (63.000 exp) 
    =   $82.444k Average
    */

    /* 
    Experiment 3: variation with the small delay in the hack script instead
    */
    start = performance.now()
    for(let i=0;i<9;i++) {
        // run hack.js on host 1 thread against host for 2 iterations with pid
        ns.exec("hack.js", hostname, 1, hostname,2,i);
    }
    ns.printf(`Hack time: \t%f milliseconds`, performance.now() - start);
    /* Results
    1:  $38.246k hacking skill 3 (49.5 exp) 
    2:  $74.765k hacking skill 5 (72.0 exp) 
    3: $117.686k hacking skill 6 (99.0 exp) 
    4:  $89.180k hacking skill 5 (81.0 exp) 
    5:  $81.986k hacking skill 5 (76.5 exp)
    6:  $67.516k hacking skill 4 (67.5 exp)
    7:  $96.347k hacking skill 5 (85.0 exp)
    8:  $67.516k hacking skill 4 (67.5 exp)
    9:  $67.516k hacking skill 4 (67.5 exp)
   10:  $74.765k hacking skill 5 (72.0 exp)
   11:  $67.516k hacking skill 4 (67.5 exp)
   12:  $67.516k hacking skill 4 (67.5 exp)
    = lower average than experiment 2
    */
    
    ns.tail();
}