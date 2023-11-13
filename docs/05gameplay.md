# 05: Nuke Servers

I want to create a script to NUKE the open servers.

## Nuke Vulnerable Servers

The following code will get a filtered list of all vulnerable servers on the network.

``` typescript
const vulnerableServers = filterServerProperties(ns, network, {numOpenPortsRequired: 0});
```

The next step is to NUKE those servers using the `ns.nuke()` method.

I created a `nukeServers()` function to iterate the servers and call the `ns.nuke()` method on each server in turn. This executes in 0.10 milliseconds so no futher optimization is required.

The following output from `scanAnalyze(depth=3)` displays the network servers in yellow font representing vulnerable servers with no additional ports required to NUKE. The red cross icon indicates that I do not yet have admin access on the servers.

Before: (markdown render does not support font colors)
``` 
[home /]> run /util/scanAnalyze.js 3
network                  🔑   RAM    hack👨‍💻 ports      
home                     ✔️   8GB       1👨‍💻 🔒🔒🔒🔒🔒 
 ├ n00dles               ❌   4GB       1👨‍💻            
 │ ├ zer0                ❌  32GB      75👨‍💻 🔒      
 │ │ ├ silver-helix      ❌  64GB     150👨‍💻 🔒🔒 
 │ ├ nectar-net          ❌  16GB      20👨‍💻            
 │ │ ├ phantasy          ❌  32GB     100👨‍💻 🔒🔒 
 ├ foodnstuff            ❌  16GB       1👨‍💻            
 ├ sigma-cosmetics       ❌  16GB       5👨‍💻            
 │ ├ CSEC                ❌   8GB      51👨‍💻 🔒      
 │ │ ├ neo-net           ❌  32GB      50👨‍💻 🔒      
 │ │ ├ omega-net         ❌  32GB     181👨‍💻 🔒🔒 
 ├ joesguns              ❌  16GB      10👨‍💻            
 ├ hong-fang-tea         ❌  16GB      30👨‍💻            
 │ ├ max-hardware        ❌  32GB      80👨‍💻 🔒      
 ├ harakiri-sushi        ❌  16GB      40👨‍💻            
 ├ iron-gym              ❌  32GB     100👨‍💻 🔒  
```

Run crack.js script to call `nukeServers()` function:

```
[home /]> run /util/crack.js
VulnerableServers: n00dles, foodnstuff, sigma-cosmetics, nectar-net, joesguns, hong-fang-tea, harakiri-sushi
```

After:
```
[home /]> run /util/scanAnalyze.js 3
network                  🔑   RAM    hack👨‍💻 ports      
home                     ✔️   8GB       1👨‍💻 🔒🔒🔒🔒🔒 
 ├ n00dles               ✔️   4GB       1👨‍💻            
 │ ├ zer0                ❌  32GB      75👨‍💻 🔒      
 │ │ ├ silver-helix      ❌  64GB     150👨‍💻 🔒🔒 
 │ ├ nectar-net          ✔️  16GB      20👨‍💻            
 │ │ ├ phantasy          ❌  32GB     100👨‍💻 🔒🔒 
 ├ foodnstuff            ✔️  16GB       1👨‍💻            
 ├ sigma-cosmetics       ✔️  16GB       5👨‍💻            
 │ ├ CSEC                ❌   8GB      51👨‍💻 🔒      
 │ │ ├ neo-net           ❌  32GB      50👨‍💻 🔒      
 │ │ ├ omega-net         ❌  32GB     181👨‍💻 🔒🔒 
 ├ joesguns              ✔️  16GB      10👨‍💻            
 ├ hong-fang-tea         ✔️  16GB      30👨‍💻            
 │ ├ max-hardware        ❌  32GB      80👨‍💻 🔒      
 ├ harakiri-sushi        ✔️  16GB      40👨‍💻            
 ├ iron-gym              ❌  32GB     100👨‍💻 🔒
 ```

All vulnerable servers were successfully NUKED. The servers previously highlighted in yellow font are now displayed in green font with the green tick icon.

Now that we have root admin access to the servers the next step is to select a target server to attack.

## About The Code

I created a `crack.ts` file for all the nuke and port cracking functions. 

The `nukeServers()` function performs a simple `forEach()` loop to nuke each server.

``` typescript
export function nukeServers(ns: NS, vulnerableServers: NetworkServer[]): NetworkServer[] {
    const startPerformance = performance.now();

    vulnerableServers.forEach((server) => {
        log(ns, `nuke ${server.hostname}`, 'INFO'); 
        ns.nuke(server.hostname);
        // ns.nuke() does not return any response indicating success or fail
        // Adding a ns.hasRootAccess() to validate requires extra 0.05 GB RAM
        // Assume the command was successful and update server entry
        server["hasAdminRights"] = true;
    });
    log(ns, `nukeServers() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
    return vulnerableServers;
}
```

I have updated the filter criteria for vulnerable servers to exclude servers that I already have admin rights.

This is not strictly necessary since the `ns.nuke()` method has no return value, it does not error if a server is already nuked, and executes within 0.1 milliseconds. This is purely my obsessive compulsive optimizing behaviour!


``` typescript
    const filterCriteria: FilterCriteria = {
        numOpenPortsRequired: 0,
        hasAdminRights: false
    };
    let vulnerableServers = filterServerProperties(ns, network, filterCriteria);
```

Vulnerable servers will be nuked once (and only once).
