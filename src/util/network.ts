import { NS, Server } from "@ns";
import { log, icon } from "util/log";
import { readPlayerData } from "util/data";

/**
 * Refresh the network server data.
 * @param ns - The netscript interface to bitburner functions.
 */
export async function main(ns: NS): Promise<void> {
  getNetworkServers(ns);
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
}

/**
 * Scans the network to a given depth and prints hostnames similar to the terminal scan-analyze command.
 * @deprecated The scan function is superceeded by the scanAnalyze.ts function
 * but is retained here in case I want to revisit or maintain for historical reference.
 * @param depth - The depth to which the network should be scanned. Defaults to 1 if not provided or invalid.
 */
export function scan(ns: NS, depth: number, print = true) {
  if(undefined === depth || Number.isNaN(depth)) depth = 1;
  const networkNodes: NetworkNode[] = scanNetwork(ns, depth);
  //TODO: save network data
  if (print) {
    printNetworkNodes(ns, networkNodes);
  }
}

/**
 * Prints the scanned network node hostnames similar to the terminal scan-analyze command.
 * @param networkNodes - An array of NetworkNode objects.
 */
export function printNetworkNodes(ns: NS, networkNodes: NetworkNode[]) {
  log.TRACE.print(ns, "printNetworkNodes()");
  networkNodes.forEach((networkNode) => {
    const prefix: string = networkNode.depth == 0 ? "" : " ┃".repeat(networkNode.depth-1) + " ┣";
    ns.tprintf('%s %s', prefix, networkNode.hostname);
  });
}

/**
 * Retrieves information about network servers by adding server properties to Network using ns.getServer().
 * Simulates an nmap request for information about a network server.
 * @param ns - The netscript interface to bitburner functions.
 * @returns An array of NetworkServer objects containing information about each server.
 */
export function getNetworkServers(ns: NS): NetworkServer[] {
  const networkNodes = readNetworkData(ns) as NetworkNode[];
  const startPerformance = performance.now();
  const networkServers: NetworkServer[] = [];
  networkNodes.forEach((networkNode) => {
    // create a new networkServer object and 'spread' (shallow copy) node and server properties
    const networkServer: NetworkServer = { ...networkNode, ...ns.getServer(networkNode.hostname)};
    if (networkServer.moneyMax !== undefined && networkServer.moneyMax > 0) {
      networkServer.moneyAvailablePercent = (networkServer.moneyAvailable ?? 0) / (networkServer.moneyMax ?? 1);
    }
    networkServer.ramAvailable = networkServer.maxRam - networkServer.ramUsed;
    log.TRACE.print(ns, `getServer ${networkServer.hostname} depth ${networkServer.depth} ${icon.security} ${networkServer.hackDifficulty}`); 
    networkServers.push(networkServer);
  });
  log.TIME.performance(ns, "getNeworkServers()", startPerformance);
  return networkServers;
}

/**
 * Scans all servers on the network using depth-first search traversal. 
 * Simulates a trace route tool using ICMP messages to discover information about the network topology and the location of servers.
 * Although ns.scan() doco says it returns 'servers' it does not return ns.Server objects, just the hostnames.
 * This function uses the term NetworkNode to avoid type conflicts with ns.Server and native DOM Node objects.
 * @param ns - The netscript interface to bitburner functions.
 * @param maxDepth - The maximum depth to scan. Defaults to 50 if not provided or NaN.
 * @returns An array of NetworkNode objects representing the network topology.
 * @remarks RAM cost: 0.20 GB
 */
const defaultMaxDepth = 50;
export function scanNetwork(ns: NS, maxDepth = defaultMaxDepth): NetworkNode[] {

  if(maxDepth > defaultMaxDepth) maxDepth = defaultMaxDepth; 
  log.TRACE.print(ns, "ScanNetwork(maxDepth=" + maxDepth + ")") ;

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
  ns.disableLog("disableLog");
  ns.disableLog("scan");

  while (stack.length > 0) {
    // Get the last node added to the stack (depth-first behaviour)
    const stackNode = stack.pop() as NetworkNode;
    log.TRACE.print(ns, `pop off stack   ${stackNode.hostname}`);

    // push the node to the networkNodes array if there are no networkNodes with the hostname
    if (!networkNodes.some((networkNode) => networkNode.hostname === stackNode.hostname)) {      
      log.TRACE.print(ns, `push on network ${stackNode.hostname}`);
      networkNodes.push(stackNode);
    }

    /* If current node is NOT at max depth, scan the node to find deeper connections */    
    if (stackNode.depth < maxDepth) {
      // neighbors will be an array of hostnames connected to the node including home, parent node, and purchased servers.
      const neighbors = ns.scan(stackNode.hostname);
      if (neighbors.length > 1) { // every node has at least 1 (parent) neighbor
        log.INFO.print(ns, `scan result for ${stackNode.hostname}: ${neighbors.length} nodes`);
      }

      // Iterate in reverse order to maintain depth-first behavior
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];

        if (!networkNodes.some((networkNode) => networkNode.hostname === neighbor)) {  
          // if neighbor is not in the network, push it on to the stack!
          const childNode: NetworkNode = {
            depth: stackNode.depth + 1,
            hostname: neighbor,
            parent: stackNode.hostname,
          };
          log.TRACE.print(ns, `push on stack   ${neighbor}`);
          stack.push(childNode);
        }
      }
    }
  } 

  log.TIME.performance(ns, `scanNetwork(maxDepth=${maxDepth})`, startPerformance);
  return networkNodes; 
  
}

/**
 * Get the latest network node data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns The latest player info.
 * @remarks RAM cost: 0.2 GB
 */
export function refreshNetworkServers(ns: NS, force = false): NetworkServer[] {
  const networkServers = getNetworkServers(ns);
  refreshData(ns, "network", networkServers, force);
  return networkServers;
}


/**
 * Checks if a given key is a property of a given object.
 * @param key - The key to check.
 * @param obj - The object to check against.
 * @returns A boolean indicating whether the key is a property of the object.
 */
export function isKeyOfObject<T extends Object>(
  key: string | number | symbol,
  obj: T,
  ): key is keyof T {
  return key in obj;
}

export type FilterCriteria = Partial<NetworkServer>;
/**
 * Filters an array of NetworkServer objects based on the provided filters.
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of NetworkServer objects to filter.
 * @param filters - An object containing key-value pairs to filter the network array by.
 * @returns An array of NetworkServer objects that match the provided filters.
 * @throws An error if the home server is not found in the network or if invalid property names are provided in the filters object.
 */
export function filterServerProperties(ns: NS, network: NetworkServer[], filters: Partial<NetworkServer>): NetworkServer[] {
  // get first server to check filter properties
  const home = network[0];

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
      if(property === "requiredHackingSkill") {
        if (Number(server[property]) <= Number(filters[property])) {
          log.TRACE.print(ns, `${server.hostname}: ${property} <= ${filters[property]} = continue checking other properties`);
          continue; 
        } else {
          log.TRACE.print(ns, `${server.hostname}: ${property} > ${filters[property]} = reject`);
          allFiltersMatch = false;
          break; // dont bother checking other filter properties for this server
        }
      } 
      if (server[property] !== filters[property]) {
        log.TRACE.print(ns, `${server.hostname} did not match filter: ${property} !== ${filters[property]}`);
        allFiltersMatch = false;
        break; // dont bother checking other filter properties for this server
      }
    }
    if (allFiltersMatch) {
      log.TRACE.print(ns,`${server.hostname} matched filters: ${Object.keys(filters)}`);
      filteredNetwork.push(server);
    }
  }
  log.INFO.print(ns,`${filteredNetwork.length} servers matched filters: ${Object.keys(filters)}`);
  log.SUCCESS.print(ns, `filterServerProperties() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`);
  return filteredNetwork;
}

/**
 * Filters an array of NetworkServers to only include those that are vulnerable.
 * A server is considered vulnerable if it has no required ports to open.
 * @param ns - The netscript interface to bitburner functions.
 * @param servers - An array of NetworkServers to filter.
 * @returns An array of NetworkServers that are vulnerable.
 */
export function filterVulnerableServers(ns: NS, servers: NetworkServer[]): NetworkServer[] {
  const filterCriteria: FilterCriteria = {
    numOpenPortsRequired: 0,
    hasAdminRights: false,
  };
  return filterServerProperties(ns, servers, filterCriteria);
}

/**
 * Filters an array of 'hack' servers - any server that I can hack.
 * @param ns - The netscript interface to bitburner functions.
 * @param servers - An array of NetworkServers to filter.
 * @returns An array of NetworkServers that have admin rights.
 */
export function filterHackServers(ns: NS, servers: NetworkServer[]): NetworkServer[] {
  const PLAYER = readPlayerData(ns)
  const filterCriteria: FilterCriteria = {
    hasAdminRights: true,
    purchasedByPlayer: false,
    requiredHackingSkill: Math.floor(PLAYER.skills.hacking)
  };
  return filterServerProperties(ns, servers, filterCriteria);
}

/**
 * Filters an array of 'hackable' servers - any server that I have have admin rights not purchased by me.
 * Defined in https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.ns.grow.md
 * @param ns - The netscript interface to bitburner functions.
 * @param servers - An array of NetworkServers to filter.
 * @returns An array of NetworkServers that have admin rights and that I have not purchased.
 */
export function filterHackableServers(ns: NS, servers: NetworkServer[]): NetworkServer[] {
  const filterCriteria: FilterCriteria = {
    hasAdminRights: true,
    purchasedByPlayer: false,
  };
  return filterServerProperties(ns, servers, filterCriteria);
}

/**
 * Filters an array of servers with root access - all servers that I can run scripts on.
 * Defined in https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.ns.grow.md
 * @param ns - The netscript interface to bitburner functions.
 * @param servers - An array of NetworkServers to filter.
 * @returns An array of NetworkServers that have admin rights.
 */
export function filterRootAccessServers(ns: NS, servers?: NetworkServer[]): NetworkServer[] {
  const filterCriteria: FilterCriteria = {
    hasAdminRights: true,
  };
  if (undefined === servers) {
    servers = readNetworkData(ns);
  }
  return filterServerProperties(ns, servers, filterCriteria);
}
