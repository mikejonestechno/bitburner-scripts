import { NS } from "@ns";
import { log, icon, color } from "util/log";

import { Server } from "@ns";

export function main(ns: NS, depth: any) {
  depth = ns.args[0];
  scanAnalyze(ns, depth);
}

// A NetworkNode only contains hostname and basic scan search traversal properties
type NetworkNode = {
  depth: number,
  hostname: string,
  parent: string,
};

// A NetworkServer extends ns.Server by adding search traversal properties and may be extended further with calculated hacking values
export interface NetworkServer extends Server {
  depth: number,
  parent: string,
  // Add an 'index signature' to enable access and filter properties based on key string
  // required for the filterServerProperties() function
  [key: string]: any; 
};

// DEPRECATED: The scan function is superceeded by the scanAnalyze function
// but is retained here in case I want to revisit or maintain for historical reference.
export function scan(ns: NS, depth: number = 1) {
  // Print network to terminal similar to scan-analyze (without the analysis)
  const networkNodes: NetworkNode[] = scanNetwork(ns, depth);
  networkNodes.forEach((networkNode) => {
    const prefix: string = networkNode.depth == 0 ? "" : " ┃".repeat(networkNode.depth-1) + " ┣";
    ns.tprintf('%s %s', prefix, networkNode.hostname);
  });
}

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

export function getNetworkServers(ns: NS, networkNodes: NetworkNode[]): NetworkServer[] {
  /*
   *  Add server properties to Network using ns.getServer()
   *  Simulates an nmap request for information about a network server.
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


export function scanNetwork(ns: NS, maxDepth = 50): NetworkNode[] {
  /*
   *  Scans all servers on the network using depth-first search traversal. 
   *  Simulates a trace route tool using ICMP messages to discover information about the network topology and the location of servers.
   *  Although ns.scan() doco says it returns 'servers' it does not return ns.Server objects, just the hostnames.
   *  This function uses the term NetworkNode to avoid type conflicts with ns.Server and native DOM Node objects.
   *  scanNetwork() takes 1 to 4 milliseconds.
   *  RAM cost: 0.20 GB
   */
  
  // Create array for storing the network tree
  const networkNodes: NetworkNode[] = [];

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
    const stackNode = stack.pop() as NetworkNode;
    log(ns, `pop off stack   ${stackNode.hostname}`);

    // push the node to the networkNodes array if there are no networkNodes with the hostname
    if (!networkNodes.some((networkNode) => networkNode.hostname === stackNode.hostname)) {      
      log(ns, `push on network ${stackNode.hostname}`);
      networkNodes.push(stackNode);
    }

    /* If current node is NOT at max depth, scan the node to find deeper connections */
    if (stackNode.depth < maxDepth) {
      log(ns, `scanning ${stackNode.hostname}`, "INFO");

      // neighbors will be an array of hostnames connected to the node including home, parent node, and purchased servers.
      const neighbors = ns.scan(stackNode.hostname);

      // Iterate in reverse order to maintain depth-first behavior
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];

        //if (!networkNodes.has(neighbor)) {
        if (!networkNodes.some((networkNode) => networkNode.hostname === neighbor)) {  
          // if neighbor is not in the network, push it on to the stack!
          const childNode: NetworkNode = {
            depth: stackNode.depth + 1,
            hostname: neighbor,
            parent: stackNode.hostname,
          };
          log(ns, `push on stack   ${neighbor}`);
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
export function filterServerProperties(ns: NS, network: NetworkServer[], filters: Partial<NetworkServer>): NetworkServer[] {
  // home server has all properties. 
  const home = network.find((server) => server.hostname === "home");
  if (!home) {
    throw new Error('Home server not found in the network');
  }

  const validKeys = Object.keys(filters).every((key) => isKeyOfObject(key, home));
  if (!validKeys) {
    throw new Error('Invalid property names in filter: ' + Object.keys(filters) );
  }

  // create new array to store servers that match filter criteria
  const filteredNetwork : NetworkServer[] = [];
  const startPerformance = performance.now();
  for (const server of network) {
    let allFiltersMatch = true;

    for (const property of Object.keys(filters)) {
      if (server[property] !== filters[property]) {
        log(ns, `${server.hostname} did not match filter: ${property} !== ${filters[property]}`);
        allFiltersMatch = false;
        break; // dont bother checking other filter properties for this server
      }
    }
    if (allFiltersMatch) {
      log(ns,`${server.hostname} matched filters: ${Object.keys(filters)}`);
      filteredNetwork.push(server);
    }
  }
  log(ns,`${filteredNetwork.length} servers matched filters: ${Object.keys(filters)}`, "INFO");
  log(ns, `filterServerProperties() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
  return filteredNetwork;
}
