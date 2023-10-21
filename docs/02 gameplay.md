# 02: Scan Network

Before I start hacking servers at random I want to discover which servers can be NUKED and hacked at the start of the game. 

## Scan-Analyze

The terminal command `scan-analyze 2` shows the server named _nectar_net_ has zero open ports required to NUKE and is two levels deep. 

Although I cannot hack _nectar_net_ at the start of the game because it requires hacking level 20, I can NUKE _nectar_net_ and start running scripts on it attacking another server.

The terminal `scan-analyze` command only scans a maximum three levels deep. There are additional `DeepScan` programs that can be unlocked later in the game but they only scan up to ten levels deep.

A complete scan of all levels deep will require a script that uses the `ns.Scan()` method to scan each server in the network.

## Breadth or Depth Search Traversal

The `ns.scan(host)` method will return names of all servers one node away from the specified host server. 

The scan response lists the names of all neighbor servers including the _home_ or parent node. Any servers purchased from Alpha Enterprises will be connected to _home_ and will also be listed when scanning the _home_ server.

I need to interate through and scan each server in turn to create a full map of all servers on the network.

Given each server is connected to its parent node, I want to avoid infinite loops and re-scanning servers I have already scanned. 

The 'breadth-first search traversal' algorithm is a suitable approach that would scan all servers one level at a time. The 'depth-first search traversal' algorithm is an alternative approach that would scan a server and all child nodes as deep as possible before scanning the next server at the same level. 

The outcome is the same, a map of all servers on the network. The difference between breadth-first and depth-first is the order in which they scan servers. 

Google or ChatGPT to learn more about 'breadth-first search traversal'.

## Depth-first Search Traversal

I choose depth-first search traversal because it allows me to easily print a list of servers in the network tree without complex conditional loops to re-arrange the order.  

I created a `scanNetworkMap()` function that scans each server starting from _home_ and builds up a flattened `Map()` of all servers in the network.


I then created a `scanAnalyze()` function that outputs the networkMap with a simple branch representation similar to the `scan-analyze` command :

```
function scanAnalyze(depth = 3)
util/network.js:  home 
util/network.js:  |-- n00dles 
util/network.js:  |-- foodnstuff 
util/network.js:  |   |-- max-hardware 
util/network.js:  |   |   |-- omega-net 
util/network.js:  |-- sigma-cosmetics 
util/network.js:  |   |-- nectar-net 
util/network.js:  |   |   |-- phantasy 
util/network.js:  |   |-- CSEC 
util/network.js:  |   |   |-- neo-net 
util/network.js:  |   |   |-- silver-helix 
util/network.js:  |-- joesguns 
util/network.js:  |-- hong-fang-tea 
util/network.js:  |-- harakiri-sushi 
util/network.js:  |-- iron-gym 
util/network.js:  |   |-- zer0 
```
I feel its a 'good-enough' visual representation of the network topology.

Remember the terminal `scan-analyze` command only scans a maximum three levels deep. There are additional `DeepScan` programs that can be unlocked later in the game but they only scan up to ten levels deep. The function I created can display all levels of the entire server network (I only show depth = 3 above). 

The next step is to analyze each server and determine which servers I can NUKE because the `ns.scan(host)` method only returns the names of the servers.

## About The Code

The function `scanNetworkMapDFS()` completes a full depth scan in around 3 milliseconds or less. The function only uses the `ns.scan()` method so it consumes 0.2 GB RAM when run. 

The log output shows the depth-first search traversal, pushing newly discovered servers on to the stack as it finds them, and then popping each one off the stack in turn until it hits max depth. 

This extract shows a scan of _foodnstuff_ discovered _max-hardware_ and then a scan of _max-hardware_ revealed _omega-net_. It reached max depth 3 and moved on to _sigma-cosmetics_.

```
function scanAnalyze(depth = 3)
DEBUG add to network n00dles
INFO  scanning n00dles
DEBUG pop off stack  foodnstuff
DEBUG add to network foodnstuff
INFO  scanning foodnstuff
DEBUG push on stack  max-hardware
DEBUG pop off stack  max-hardware
DEBUG add to network max-hardware
INFO  scanning max-hardware
DEBUG push on stack  omega-net
DEBUG pop off stack  omega-net
DEBUG add to network omega-net
DEBUG pop off stack  sigma-cosmetics
DEBUG add to network sigma-cosmetics
INFO  scanning sigma-cosmetics
```
The INFO messages in the log show each server was only scanned once and the function only scans to the max depth specified.

The depth-first search traversal can be complex in concept and syntax for someone new to coding like me. 

I needed to do a few Googles and ChatGPT created almost all the code I needed. I gave chatGPT a couple of examples of the output I wanted to help it and then adapted the code with additional logging and structure. 

``` typescript
export function scanNetworkMapDFS(ns: NS, maxDepth = 50) {
  interface Node {
    depth: number,
    hostname: string,
    parent: string,
  };

  // Create Map for storing the network tree
  const networkMap = new Map<string, Node>();

  // Create a stack for storing the nodes to be scanned, starting with the home server at depth zero
  const stack: Node[] = [
    {
      depth: 0,
      hostname: "home",
      parent: "",
    },
  ];

  const startPerformance = performance.now();
  ns.disableLog('ALL');

  while (stack.length > 0) {
    // Get the last node added to the stack (depth-first behaviour)
    const node = stack.pop() as Node;
    log(ns, `pop off stack  ${node.hostname}`);

    if (!networkMap.has(node.hostname)) {
      networkMap.set(node.hostname, node);
      log(ns, `add to network ${node.hostname}`);
    }

    /* If current node is NOT at max depth, scan the node to find deeper connections */
    if (node.depth < maxDepth) {

      log(ns, `scanning ${node.hostname}`, "INFO");

      // neighbors will be an array of hostnames connected to the node including home, parent node, and purchased servers.
      const neighbors = ns.scan(node.hostname);

      // Iterate in reverse order to maintain depth-first behavior
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];

        if (!networkMap.has(neighbor)) {
          // if neighbor is not in the networkMap, push it on to the stack!
          const childNode: Node = {
            depth: node.depth + 1,
            hostname: neighbor,
            parent: node.hostname,
          };
          log(ns, `push on stack  ${neighbor}`);
          stack.push(childNode);
        }
      }
    }
  } 

  log(ns, "scan stack is empty", "INFO");
  log(ns, `scanNetworkMapDFS() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");

  return networkMap;
}
```

In comparison the code to print the network map with a simple branch representation similar to the `scan-analyze` command was straightforward. 

Each hostname is padded out with a prefix of repeating pipe and space characters.

``` typescript
export function scanAnalyze(ns: NS, depth: number = 1) {
  // Print DFS network map to terminal similar to scan-analyze
  let networkMap = scanNetworkMapDFS(ns, depth);
  networkMap.forEach((node, hostname) => {
    let prefix = "";
    if (node.depth == 0) {
      prefix = "";
    } else {
      // simple branch representation. 
      prefix = " |  ".repeat(node.depth-1) + " |--"
    } 
    ns.tprint(`${prefix} ${hostname} `);
  });
}
```