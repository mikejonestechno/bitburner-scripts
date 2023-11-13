# 07: Get Hack, Grow, Weaken Stats

I want to to select a target server to attack.

## Statistics 

The `ns.GetServer()` method returns general properties of each server including money available and max money, but I need to use other netscript methods to get additional hacking statistics.

I created a `hackAnalyze()` function to get hacking statistics for each server by calling `ns.hackAnalyze()`, `ns.hackAnalyzeChance()` and `ns.getHackTime()`.

A similar `growAnalye()` function gets additional statistics for each server. 

## Hacking Dashboard

I created a hacking dashboard to show the additional statistics.

At the start of the game I can only hack _n00dles_ and _foodnstuff_. All the other servers have a zero percent chance of a successful hack because I do not have the required hacking skill level.

A hack on the _foodnstuff_ server has a 38.57% chance of success. Each hack will steal 0.38% of the available money if successful.

The current available money on _foodnstuff_ is $2.00m so 0.38% * $2.00m = $7.5k per hack if the hack is successful.

On average each hack has a 38.57% chance of stealing $7.5k and will take 51 seconds so that's an average hack rate of (38.57% * $7.5k) / 51 = $56.20 per second.

If _foodnstuff_ was at maximum available money of $50.00m that would be $187.50k for each successful hack. with a maximum average hack rate = $1.41k per second.

The _foodnstuff_ server is the best hack target with current hack rate $56.20 / second, and the highest max money hack rate of $1.41k / second. 

```
[home /]> run util/dashboard.js --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  42.43%   0.41%  $70.00k  $288.75    49s    $2.49   $1.75m   $7.22k   $62.17 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  38.57%   0.38%   $2.00m   $7.50k    51s   $56.20  $50.00m $187.50k   $1.41k ✔️ ✔️ 
```

## Grow Dashboard

It's not all about the hacking! To get that maximum hack rate I will need to grow and weaken the servers.

I can grow and weaken ALL servers I have root access on, regardless of required hacking skill.

The _foodnstuff_ server has an internal grow factor of 5. It has $2.00m available and to grow to max $50.00m will require growing by $48.00m, which is a growth factor of $50.00m / $2.00m = 25.

A growth factor of 25 will require 21.49k threads and each thread will grow $48.00m / 21.49 = $2.23k per thread. Grow threads will take 165 seconds giving a grow rate of $13.56 per second.

The _foodnstuff_ server current security level is 10.00 with minimum security of 3.00. Weaken will take 206 seconds and require 140.00 threads to weaken from 10.00 to minimum security 3.00.


```
[home /]> run util/dashboard.js --show grow
hostname               RAM grow  $ avail    $ max     diff  factor threads   $/grow   time    g $/s       👮   min 👮 weak s threads 📈 
n00dles                4GB   3k  $70.00k   $1.75m   $1.68m   25.00   30.71  $54.71k   158s  $347.02   1.00👮   1.00👮   197s    0.00 ❌ 
foodnstuff            16GB    5   $2.00m  $50.00m  $48.00m   25.00  21.49k   $2.23k   165s   $13.56  10.00👮   3.00👮   206s  140.00 ❌ 
sigma-cosmetics       16GB   10   $2.30m  $57.50m  $55.20m   25.00  10.75k   $5.14k   196s   $26.20  10.00👮   3.00👮   245s  140.00 ❌ 
joesguns              16GB   20   $2.50m  $62.50m  $60.00m   25.00   8.06k   $7.45k   275s   $27.13  15.00👮   5.00👮   343s  200.00 ❌ 
hong-fang-tea         16GB   20   $3.00m  $75.00m  $72.00m   25.00   8.06k   $8.94k   510s   $17.53  15.00👮   5.00👮   637s  200.00 ❌ 
nectar-net            16GB   25   $2.75m  $68.75m  $66.00m   25.00   8.59k   $7.68k   471s   $16.33  20.00👮   7.00👮   588s  260.00 ❌ 
harakiri-sushi        16GB   40   $4.00m $100.00m  $96.00m   25.00   4.03k  $23.84k   627s   $37.99  15.00👮   5.00👮   784s  200.00 ✔️ 
```

I cannot hack _harakiri-sushi_ until I have the required hacking skill, but I can weaken and grow _harakiri-sushi_ which has the highest internal grow factor 40 and the highest grow rate of $37.99 per second. 

The next step is to analyze these statistics and design experiments to identify which server(s) to hack, grow or weaken first. Is it really worth weakening servers at the start of the game or should I just hack them to pieces to increase hacking skill?

## About The Code

I created additional column definitions in the `dashboard.ts` file to support different views of data. 

The `main()` function was updated to include `ns.flags()` parameters to select which columns to show on the dashboard.

``` typescript
export function main(ns: NS) {
    const flags = ns.flags([
        ['show', "dashboard"], // Columns to show. Valid values are "hack", "grow", "scanAnalyze", "dashboard"
    ]);

    let columns: Column[];
    switch (flags.show) {
        case "hack": columns = hackColumns; break;
        case "grow": columns = growColumns; break;
        case "scanAnalyze": columns = scanAnalyzeColumns; break;
        default: columns = dashboardColumns; break;
    }

    ...
```

The dashboard code is intended to be a 'dumb' formatter and just print a list of server properties, it will not contain any logic or analytic processing.

### Analyze

I created a separate `analyze.ts` file with functions to call additional netscript methods and calculate server properties.

The `targetHackMoneyPerSecond` and `hackMaxMoneyPerSecond` variable are used to track which servers have the highest hack rates.

``` typescript
export function hackAnalyze(ns: NS, network: NetworkServer[]) {

    ...

    network.forEach((server) => {
        log(ns, `hackAnalyze ${server.hostname}`);
        const hackTime = ns.getHackTime(server.hostname) / 1000; // milliseconds
        const hackChance = ns.hackAnalyzeChance(server.hostname);
        const hackMoneyPercent = ns.hackAnalyze(server.hostname);
        const hackMoney = hackMoneyPercent * (server.moneyAvailable ?? 0);
        const hackMaxMoney = hackMoneyPercent * (server.moneyMax ?? 0);
        const hackMoneyPerSecond = (hackChance * hackMoney) / hackTime;
        if (hackMoneyPerSecond > targetHackMoneyPerSecond.money) {
            targetHackMoneyPerSecond.money = hackMoneyPerSecond;
            targetHackMoneyPerSecond.hostname = server.hostname;
        }
        const hackMaxMoneyPerSecond = (hackChance * hackMaxMoney) / hackTime;
        if (hackMaxMoneyPerSecond > targetHackMaxMoneyPerSecond.money) {
            targetHackMaxMoneyPerSecond.money = hackMaxMoneyPerSecond;
            targetHackMaxMoneyPerSecond.hostname = server.hostname;
        }

    ...
```

### Cache Data To File

While the `showDashboard()` function just renders server properties and does not require any RAM, the `main()` script function that gets and populates the data for the dashboard required increasing amounts of RAM.

All the additional netscript analyze function calls resulted in the dashboard script requiring a total 11 GB RAM including `ns.scan()` and `ns.getServer()`.

I created new functions to read and write data to files. These functions convert or `stringify` objects to JSON strings that can be written to a txt file.

The `scanNetwork()` function was updated so if a maximum depth scan had been performed, the network nodes data would be written to file. 

``` typescript
  if (maxDepth === defaultMaxDepth) {
    log(ns, `writing networkNodes to ${NETWORK_NODES_FILE}`);
    ns.write(NETWORK_NODES_FILE, JSON.stringify(networkNodes), "w");
  }
```

At the start of the `scanNetwork()` function it attempts to read the file into a `NetworkNode[]` object, and if file data exists, returns the data filtered for the requested maxDepth. 

This enables the `scanNetwork()` function to use a cache of the previous scan data and no longer needs to re-generate the depth-first search traversal every time the function is called.

``` typescript
  const DATA = readDataFile(ns, NETWORK_NODES_FILE) as NetworkNode[];
  if (DATA) {
    return DATA.filter((networkNode) => networkNode.depth <= maxDepth);
  }
```

The `readDataFile()` function is in a separate `data.ts` file that contains a few other helper functions to read data with `JSON.parse` in a consistent way.

Using the cached data files meant I could reduce the netscript calls in the main dashboard script from 11.00GB to 1.60GB.

Further refactoring of the `start.ts` script was also required to keep RAM below 8GB. It will re-spawn a `control.ts` script to run the `analyze()` function and spawn the `dashboard.ts` script.

The next steps are to review all the statistics and design experiments to identify which server(s) to hack, grow or weaken first.