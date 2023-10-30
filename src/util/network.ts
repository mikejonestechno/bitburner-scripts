import { NS } from "@ns";
import { log, icon, color } from "util/log";

import { Server } from "@ns";

export function main(ns: NS, depth: any) {
  depth = ns.args[0];
  scanAnalyze(ns, depth);
}

// A NetworkNode only contains hostname and basic scan search traversal properties
type NetworkNodes = Map<string, NetworkNode>;
type NetworkNode = {
  depth: number,
  hostname: string,
  parent: string,
};

// A NetworkServer extends ns.Server by adding search traversal properties
export type Network = Map<string, NetworkServer>;
interface NetworkServer extends Server {
  depth: number,
  parent: string,
  // Add an 'index signature' to enable access and filter properties based on key string
  // required for the filterServerProperties() function
  [key: string]: any; 
};

// DEPRECATED: The scan function is superceeded by the scanAnalyze function
// but is retained here in case I want to revisit or maintain for historical reference.
export function scan(ns: NS, depth: number = 1) {
  // Print network map to terminal similar to scan-analyze
  const networkNodes: NetworkNodes = scanNetwork(ns, depth);
  networkNodes.forEach((networkNode, hostname) => {
    const prefix: string = networkNode.depth == 0 ? "" : " ┃".repeat(networkNode.depth-1) + " ┣";
    ns.tprintf('%s %s', prefix, hostname);
  });
}

export function scanAnalyze(ns: NS, depth: number = 1) {
  /*  Print network map to terminal similar to scan-analyze

      hostname color mapping:
      red: numOpenPortsRequired > 1
      orange: numOpenPortsRequired = 1
      yellow: numOpenPortsRequired = 0 but still !rootAccess 
      green: rootAcess == true
  */  
  const networkNodes: NetworkNodes = scanNetwork(ns, depth);
  const network: Network = getNetworkServers(ns, networkNodes);
  network.forEach((server, hostname) => {

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
        (prefix + " " + hostnameColor + hostname).padEnd(prefixPad),
        rootAccess,
        color['reset'],
        maxRam,
        requiredHackingSkill,
        numOpenPortsRequired,
    );
  });
}

export function getNetworkServers(ns: NS, networkNodes: NetworkNodes): Network {
  /*
   *  Add server properties to Network map using ns.getServer()
   *  Simulates an nmap request for information about a network server.
   *  RAM cost: 2 GB
   */

  const startPerformance = performance.now();
  const networkServers: Network = new Map();
  networkNodes.forEach((networkNode, hostname) => {
    log(ns, `getServer ${hostname}`, "INFO"); 
    // create a new networkServer object and 'spread' (shallow copy) node and server properties
    const networkServer: NetworkServer = { ...networkNode, ...ns.getServer(hostname)};
    // log message verifies a server and node property were copied
    log(ns, `ip=${networkServer.ip}, depth=${networkServer.depth}`)
    networkServers.set(hostname, networkServer);
  });
  log(ns, `getNetworkMapServers() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");    
  return networkServers;
}


export function scanNetwork(ns: NS, maxDepth = 50): NetworkNodes {
  /*
   *  Scans all servers on the network using depth-first search traversal. 
   *  Simulates a trace route tool using ICMP messages to discover information about the network topology and the location of servers.
   *  Although ns.scan() doco says it returns 'servers' it does not return ns.Server objects, just the hostnames.
   *  This function uses the term NetworkNode to avoid type conflicts.
   *  scanNetwork() takes 1 to 4 milliseconds.
   *  RAM cost: 0.20 GB
   */
  
  // Create Map for storing the network tree
  const networkNodes: NetworkNodes = new Map();

  // Create a stack for storing the nodes to be scanned, starting with the home server at depth zero
  const stack: NetworkNode[] = [
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
    const networkNode = stack.pop() as NetworkNode;
    log(ns, `pop off stack  ${networkNode.hostname}`);

    if (!networkNodes.has(networkNode.hostname)) {
      log(ns, `add to network ${networkNode.hostname}`);
      networkNodes.set(networkNode.hostname, networkNode);
    }

    /* If current node is NOT at max depth, scan the node to find deeper connections */
    if (networkNode.depth < maxDepth) {
      log(ns, `scanning ${networkNode.hostname}`, "INFO");

      // neighbors will be an array of hostnames connected to the node including home, parent node, and purchased servers.
      const neighbors = ns.scan(networkNode.hostname);

      // Iterate in reverse order to maintain depth-first behavior
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];

        if (!networkNodes.has(neighbor)) {
          // if neighbor is not in the network, push it on to the stack!
          const childNode: NetworkNode = {
            depth: networkNode.depth + 1,
            hostname: neighbor,
            parent: networkNode.hostname,
          };
          log(ns, `push on stack  ${neighbor}`);
          stack.push(childNode);
        }
      }
    }
  } 

  log(ns, "scan stack is empty", "INFO");
  log(ns, `scanNetwork() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");

  return networkNodes;
}

export function isKeyOfObject<T extends Object>(
  key: string | number | symbol,
  obj: T,
  ): key is keyof T {
  return key in obj;
}

export type FilterCriteria = Partial<NetworkServer>;
export function filterServerProperties(ns: NS, network: Network, filters: Partial<NetworkServer>): Network {
  // home server has all properties. 
  const home = network.get("home") as NetworkServer;
  const validKeys = Object.keys(filters).every((key) => isKeyOfObject(key, home));
  if (!validKeys) {
    throw new Error('Invalid property names in filter: ' + Object.keys(filters) );
  }

  // create new Map to store servers that match filter criteria
  const filteredNetwork : Network = new Map();
  const startPerformance = performance.now();
  for (const [hostname, server] of network) {
    let allFiltersMatch = true;

    for (const property of Object.keys(filters)) {
      if (server[property] !== filters[property]) {
        log(ns, `${hostname} did not match filter: ${property} !== ${filters[property]}`);
        allFiltersMatch = false;
        break; // dont bother checking other filter properties for this server
      }
    }
    if (allFiltersMatch) {
      log(ns,`${server.hostname} matched filters: ${Object.keys(filters)}`);
      filteredNetwork.set(hostname, server);
    }
  }
  log(ns,`${filteredNetwork.size} servers matched filters: ${Object.keys(filters)}`, "INFO");
  log(ns, `filterServerProperties() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
  return filteredNetwork;
}
