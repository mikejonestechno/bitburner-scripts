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

If _foodnstuff_ was at maximum available money of $50.0m that would be $187.50k for each successful hack. with a maximum average hack rate = $1.41k per second.

To steal $1m will require 133.33 threads and each hack will increase the server security by 0.0020.

```
[home /]> run util/dashboard.js --hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack hack s hack $/s    $ max   $/hack  max $/s $1m thd sec/hack 
n00dles              4GB       1👨‍💻  42.43%   0.41%  $70.00k  $288.75    49s    $2.49   $1.75m   $7.22k   $62.17    0.00   0.0020 
foodnstuff          16GB       1👨‍💻  38.57%   0.38%   $2.00m   $7.50k    51s   $56.20  $50.00m $187.50k   $1.41k  133.33   0.0020 
sigma-cosmetics     16GB       5👨‍💻   0.00%   0.00%   $2.30m    $0.00    61s    $0.00  $57.50m    $0.00    $0.00    0.00   0.0020 
joesguns            16GB      10👨‍💻   0.00%   0.00%   $2.50m    $0.00    86s    $0.00  $62.50m    $0.00    $0.00    0.00   0.0020 
hong-fang-tea       16GB      30👨‍💻   0.00%   0.00%   $3.00m    $0.00   159s    $0.00  $75.00m    $0.00    $0.00    0.00   0.0020 
harakiri-sushi      16GB      40👨‍💻   0.00%   0.00%   $4.00m    $0.00   196s    $0.00 $100.00m    $0.00    $0.00    0.00   0.0020 
iron-gym            32GB     100👨‍💻   0.00%   0.00%  $20.00m    $0.00   784s    $0.00 $500.00m    $0.00    $0.00    0.00   0.0020 
```

## Grow Dashboard

It's not all about the hacking! To get that maximum hack rate I will need to grow and weaken the servers.

I can grow and weaken ALL servers I have root access on, regardless of required hacking skill.

The _foodnstuff_ server has a growth factor of 5. It has $2.00m available and to grow by 10% ($200.00k) will require 636.35 threads.

Each thread will grow $314.29 and take 165 seconds giving a grow rate of $1.91 per second.

Each grow will increase server security by 0.0040.

Each weaken on _foodnstuff_ will take 206 seconds and reduce server security by 0.0500.

```
[home /]> run util/dashboard.js --grow
hostname               RAM grow  $ avail   $ grow threads   $/grow grow s    g $/s sec/grow weak s sec/weak 
n00dles                4GB   3k  $70.00k   $7.00k    0.91   $7.70k   158s   $48.83   0.0040   197s   0.0500 
foodnstuff            16GB    5   $2.00m $200.00k  636.35  $314.29   165s    $1.91   0.0040   206s   0.0500 
sigma-cosmetics       16GB   10   $2.30m $230.00k  318.18  $722.87   196s    $3.69   0.0040   245s   0.0500 
joesguns              16GB   20   $2.50m $250.00k  238.51   $1.05k   275s    $3.82   0.0040   343s   0.0500 
hong-fang-tea         16GB   20   $3.00m $300.00k  238.51   $1.26k   510s    $2.47   0.0040   637s   0.0500 
harakiri-sushi        16GB   40   $4.00m $400.00k  119.26   $3.35k   627s    $5.35   0.0040   784s   0.0500 
iron-gym              32GB   20  $20.00m   $2.00m  476.79   $4.19k    3ks    $1.67   0.0040    3ks   0.0500 
```

The next step is to analyze these statistics and identify which server(s) to hack, grow or weaken first.

## About The Code

I created additional column definitions in the `dashboard.ts` file to support different views of data. 

The `main()` function was updated to include `ns.flags()` parameters to select which columns to show on the dashboard.

```
export function main(ns: NS) {
    const flags = ns.flags([
        ['hack', false], // Display hack analysis dashboard 
        ['grow', false], // Display grow analysis dashboard
    ]);
    let columns: Column[] = dashboardColumns;
    if (flags.hack) { columns = hackColumns; }
    else if (flags.grow) { columns = growColumns; }

    ...
```

The dashboard code just formats and prints a list of server properties, it does not contain any logic or analytic processing.

### Analyze

I created a separate `analyze.ts` file with functions to call additional netscript methods and calculate server properties.

``` typescript
export function hackAnalyze(ns: NS, network: NetworkServer[]) {

    const startPerformance = performance.now();

    network.forEach((server) => {
        log(ns, `analyzing server ${server.hostname}`);

        const hackMoneyPercent = ns.hackAnalyze(server.hostname);
        const hackMoney = hackMoneyPercent * (server.moneyAvailable ?? 0);
        const hackMaxMoney = hackMoneyPercent * (server.moneyMax ?? 0);
        const hackChance = ns.hackAnalyzeChance(server.hostname);
        const hackThreadSecurity = 0.002; //ns.hackAnalyzeSecurity(1, server.hostname);
        const hackTime = ns.getHackTime(server.hostname) / 1000; // milliseconds
        const hackMillionDollarThreads = ns.hackAnalyzeThreads(server.hostname, 1000000);
        const properties = {
            hackTime: hackTime,
            hackChance: hackChance,
            hackMoneyPercent: hackMoneyPercent,
            hackMoney: hackMoney,
            hackMaxMoney: hackMaxMoney,
            hackMoneyPerSecond: (hackChance * hackMoney) / hackTime,
            hackMaxMoneyPerSecond: (hackChance * hackMaxMoney) / hackTime,
            hackThreadSecurity: hackThreadSecurity,
            hackMillionDollarThreads: hackMillionDollarThreads < 0 ? 0 : hackMillionDollarThreads,
        };
        Object.assign(server, properties);
    });

    log(ns, `analyzeNetworkMap() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return network;
}
```

### Cache Data To File

While the `showDashboard()` function just renders server properties and does not require any RAM, the `main()` script function that gets and populates the data for the dashboard required increasing amounts of RAM.

All the additional analyze netscript calls resulted in the dashboard script requiring a total 11 GB RAM including `ns.scan()` and `ns.getServer()`.

I created new functions to read and write data to files. These functions convert or `stringify` objects to JSON strings that can be written to a txt file.

The `scanNetwork()` function was updated so if a maximum depth scan had been performed the network nodes data would be written to file. 

``` typescript
  if (maxDepth === defaultMaxDepth) {
    log(ns, `writing networkNodes to ${NETWORK_NODES_FILE}`);
    ns.write(NETWORK_NODES_FILE, JSON.stringify(networkNodes), "w");
  }
```

At the start of the `scanNetwork()` function it attempts to read the file into a NetworkNode[] object, and if file data exists, returns the data filtered for the requested maxDepth. 

This enables the `scanNetwork()` function to use a cache of the previous scan data and no longer needs to re-generate the depth-first search traversal every time the function is called.

``` typescript
  const DATA = readDataFile(ns, NETWORK_NODES_FILE) as NetworkNode[];
  if (DATA) {
    return DATA.filter((networkNode) => networkNode.depth <= maxDepth);
  }
```

The `readDataFile()` function is in a separate `data.ts` file that contains a few other helper functions to read data with `JSON.parse` in a consistent way.

Using the cached data files meant I could reduce the netscript calls in the main dashboard script from 11.00GB to 6.00GB.

This is not the final optimization, just enough to enable analysis and dashboards to be displayed at the start of the game.
