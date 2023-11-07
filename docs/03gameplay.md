# 03: Scan Analyze Network

Before I start hacking servers at random I want to discover which servers can be NUKED and hacked at the start of the game.

## Get Network Servers

The `scanNetwork()` function will do a complete scan of all servers in the network.

The next step is to get the properties of each server because the scan function depends on the `ns.scan()` method that only returns the names of the servers.

The `ns.getServer(host)` method will return a `ns.Server` object containing properties of the specified host server, including root access, hacking skill level required and money available.

I created a `getNetworkServers()` function to loop through every node in the network and get the server properties.

The next step is to visualize or further analyze the information to discover which servers can be NUKED and hacked at the start of the game.

## Scan Analyze Network

I previously created a `scan()` function that output the network servers with a simple branch representation. 

This was renamed to `scanAnalyze()` and server properties added. It will now output similar information to the terminal `scan-analyze` command. 

Here is example output of `scanAnalyze(depth = 3)` at the start of the game:

```
function scanAnalyze(depth = 3) terminal output
 home                   ✔️   8 GB        🔒🔒🔒🔒🔒
 ├ n00dles              ❌   4 GB        🔑
 ├ foodnstuff           ❌  16 GB        🔑
 │ ├ max-hardware       ❌  32 GB   80👨‍💻 🔒
 │ │ ├ omega-net        ❌  32 GB  204👨‍💻 🔒🔒
 ├ sigma-cosmetics      ❌  16 GB    5👨‍💻 🔑
 │ ├ nectar-net         ❌  16 GB   20👨‍💻 🔑
 │ │ ├ phantasy         ❌  32 GB  100👨‍💻 🔒🔒
 │ ├ CSEC               ❌   8 GB   58👨‍💻 🔒
 │ │ ├ neo-net          ❌  32 GB   50👨‍💻 🔒
 │ │ ├ silver-helix     ❌  64 GB  150👨‍💻 🔒🔒
 ├ joesguns             ❌  16 GB   10👨‍💻 🔑
 ├ hong-fang-tea        ❌  16 GB   30👨‍💻 🔑
 ├ harakiri-sushi       ❌  16 GB   40👨‍💻 🔑
 ├ iron-gym             ❌  32 GB  100👨‍💻 🔒
 │ ├ zer0               ❌  32 GB   75👨‍💻 🔒
 ```

Root access is indicated with green tick or red cross, server max RAM is displayed in GB with the required hacking skill, and the padlock icons show the number of open ports required, or a key icon if the ports are open and the server can be NUKED.

The hostnames are also colored in the bitburner terminal; hostnames are rendered green for servers with root access, yellow if the server is open and can be NUKED, orange if one port needs to be opened, or red if more than port needs to be opened.

The icons and yellow color coding make it easy to spot which servers can be NUKED and the orange color coding show which servers only need one port to be opened.

`scanAnalyze()` is a great function for a quick analysis or visual summary of the entire network similar to the  terminal `scan-analyze` command.

The `scanAnalyze()` function can display all levels of the entire server network (I only show depth = 3 above).

This is sufficient analysis to determine which servers can be NUKED and hacked at the start of the game.

The next step is to filter the network server list and NUKE those open servers!

## About The Code

The `ns.getServer(host)` method will return a `ns.Server` object containing properties of the specified host server, including root access, hacking skill level required and money available.

I created a `NetworkServer` interface that extends the `ns.Server` object to include the search traversal propertes (depth and parent). 

``` typescript
import { Server } from "@ns";

// A NetworkServer extends ns.Server by adding search traversal properties
interface NetworkServer extends Server {
  depth: number,
  parent: string,
};
```

The `getNetworkServers()` function will build an array of NetworkServers and I can use the `find()` method to get the properties of a particular server in the network, for example:

``` typescript
const network: NetworkServer[] = getNetworkServers(ns, networkNodes);
const targetServer: NetworkServer = network.find((server) => server.hostname === 'n00dles');
const targetServerMoney: number = targetServer?.moneyAvailable;
```

Typescript requires the last statement to use the optional chaining '?' in case the `targetServer` is undefined. I cannot access any property of an undefined object. In this example I have hardcoded the targetServer `n00dles` which should always exist in my network server array, but what if the array entries had been cleared, or I had made a typo and had written `'n00dels'`. 

> I can start to appreciate how Typescript is trying to help me catch mistakes in my code that could lead to unhandled errors if not detected early enough.

The `getNetworkServers()` function uses the Typescript 'spread' operator `...` to shallow copy properties from the `networkNode` and `Server` objects to a new `networkServer` object.

``` typescript
export function getNetworkServers(ns: NS, networkNodes: NetworkNode[]): NetworkServer[] {
  /*
   *  Add server properties to Network using ns.getServer()
   *  RAM cost: 2 GB
   */

  const startPerformance = performance.now();
  const networkServers: NetworkServer[] = [];
  networkNodes.forEach((networkNode) => {
    log(ns, `getServer ${networkNode.hostname}`, "INFO"); 
    // create a new networkServer object and 'spread' (shallow copy) node and server properties
    const networkServer: NetworkServer = { ...networkNode, ...ns.getServer(networkNode.hostname)};
    // log message verifies a server and node property were copied
    log(ns, `ip=${networkServer.ip}, depth=${networkServer.depth}`)
    networkServers.push(networkServer);
  });
  log(ns, `getNetworkServers() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");    
  return networkServers;
}

```

The `scanAnalyze()` function performs a number of formatting conditions to set the hostname color. 

The strings are padded with spaces so that values align. Padding for the hostname was more challenging because it had to take the server branch depth into account, as well as the hidden hex code representing the color that is not actually rendered to screen.
 
``` typescript
export function scanAnalyze(ns: NS, depth: number = 1) {
  /*  Print network to terminal similar to scan-analyze

      hostname color mapping:
      red: numOpenPortsRequired > 1
      orange: numOpenPortsRequired = 1
      yellow: numOpenPortsRequired = 0 but still !rootAccess 
      green: rootAcess == true
  */  
  const networkNodes: NetworkNode[] = scanNetwork(ns, depth);
  const network: NetworkServer[] = getNetworkServers(ns, networkNodes);
  network.forEach((server) => {

    let hostnameColor = color["yellow"]; 
    let numOpenPortsRequired: string = icon['key'];

    if (server.numOpenPortsRequired !== undefined && server.numOpenPortsRequired > 0) {
      numOpenPortsRequired = icon['lock'].repeat(server.numOpenPortsRequired);
      hostnameColor = server.numOpenPortsRequired == 1 ? color["orange"] : color["red"];
    } 

    const rootAccess: string = icon[server.hasAdminRights.toString()] ;
    if (server.hasAdminRights) {
      // ensure color is always green even if ports are still locked (eg home)
      hostnameColor = color["green"];
    } 

    const maxRam: string = server.maxRam.toString().padStart(4) + " GB";

    let requiredHackingSkill: string = ("").padStart(7);
    if (server.requiredHackingSkill !== undefined && server.requiredHackingSkill > 1) {
      requiredHackingSkill = (server.requiredHackingSkill.toString() + icon['techno']).padStart(10);
    } 

    const prefix: string = server.depth == 0 ? "" : " │".repeat(server.depth-1) + " ├";
    const prefixPad: number = 18 + (depth * 2) + hostnameColor.length;   

    ns.tprintf('%s%s%s%s%s %s',
        (prefix + " " + hostnameColor + server.hostname).padEnd(prefixPad),
        rootAccess,
        color['reset'],
        maxRam,
        requiredHackingSkill,
        numOpenPortsRequired,
    );
  });
}
```

### ASCII Box Drawing Characters

The terminal `scan-analyze` command uses the heavy (thick) box drawing unicode characters and bitburner appears to render them in a wider font glyph that pushes out the spacing.

I spent some time exploring options, but for monospaced fonts all characters are supposed to be the same width and I abandoned trying to align whitespace padding for heavy box characters.

If monospace pad alignment is important stick to the light (thin) box drawing elements. 

```
  ns.tprintf("│".repeat(20)+"Here");
  ns.tprintf("├".repeat(20)+"Here"); // light box drawing glyphs are fine
  ns.tprintf("┣".repeat(20)+"Here"); // heavy box drawing glyphs get rendered wider than other chars in bitburner
  ns.tprintf(" ".repeat(20)+"Here"); // regular space char
```