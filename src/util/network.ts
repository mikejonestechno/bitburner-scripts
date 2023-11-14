import { NS, Server } from "@ns";
import { log } from "util/log";
import { readDataFile, readPlayerData } from "util/data";

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
};

/**
 * Scans the network to a given depth and prints hostnames similar to the terminal scan-analyze command.
 * DEPRECATED: The scan function is superceeded by the scanAnalyze.ts function
 * but is retained here in case I want to revisit or maintain for historical reference.
 * @param ns - The netscript interface to bitburner functions.
 * @param depth - The depth to which the network should be scanned. Defaults to 1 if not provided or invalid.
 */
export function scan(ns: NS, depth: number) {
  if(undefined === depth || Number.isNaN(depth)) depth = 1;
  const networkNodes: NetworkNode[] = scanNetwork(ns, depth);
  networkNodes.forEach((networkNode) => {
    const prefix: string = networkNode.depth == 0 ? "" : " ┃".repeat(networkNode.depth-1) + " ┣";
    ns.tprintf('%s %s', prefix, networkNode.hostname);
  });
}

/**
 * Retrieves information about network servers by adding server properties to Network using ns.getServer().
 * Simulates an nmap request for information about a network server.
 * @param ns - The netscript interface to bitburner functions.
 * @param networkNodes - Optional array of network nodes to scan.
 * @returns An array of NetworkServer objects containing information about each server.
 */
export function getNetworkServers(ns: NS, networkNodes?: NetworkNode[], saveNetworkFile: boolean = false): NetworkServer[] {
  const CITY = readPlayerData(ns).city;
  const NETWORK_FILE = `data/${CITY}/network.txt`;
  const startPerformance = performance.now();
  const networkServers: NetworkServer[] = [];
  if (!networkNodes) { // refresh properties of all servers in network.txt
    networkNodes = readDataFile(ns, NETWORK_FILE) as NetworkNode[];
    saveNetworkFile = true; // save network file after updating properties
  }
  networkNodes.forEach((networkNode) => {
    log(ns, `getServer ${networkNode.hostname}`); 
    // create a new networkServer object and 'spread' (shallow copy) node and server properties
    const networkServer: NetworkServer = { ...networkNode, ...ns.getServer(networkNode.hostname)};
    // log message verifies a server and node property were copied
    if (networkServer.moneyMax !== undefined && networkServer.moneyMax > 0) {
      networkServer.moneyAvailablePercent = (networkServer.moneyAvailable ?? 0) / (networkServer.moneyMax ?? 1);
    }
    networkServers.push(networkServer);
  });
  log(ns, `getNetworkServers() ${networkServers.length} servers in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");    
  if (saveNetworkFile) {
    log(ns, `write ${NETWORK_FILE}`, "INFO");
    ns.write(NETWORK_FILE, JSON.stringify(networkServers), "w");
  }
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
export function scanNetwork(ns: NS, maxDepth: number = defaultMaxDepth): NetworkNode[] {

  const CITY = readPlayerData(ns).city;
  const NETWORK_NODES_FILE = `data/${CITY}/networkNodes.txt`;

  if(maxDepth > defaultMaxDepth) maxDepth = defaultMaxDepth; 
  log(ns, "ScanNetwork(maxDepth=" + maxDepth + ")") ;

  // If the networkNodes file exists, read it and return the contents
  log(ns, `reading networkNodes from ${NETWORK_NODES_FILE}`);

  const DATA = readDataFile(ns, NETWORK_NODES_FILE) as NetworkNode[];
  if (DATA) {
    return DATA.filter((networkNode) => networkNode.depth <= maxDepth);
  }
  
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
  log(ns, `scanNetwork(maxDepth=${maxDepth}) completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");
  
  // The networkNode hierarchy should not change until the game is reset.
  // If we performed a full maxDepth scan of the network, write data to cache file.
  // The cache will need to be cleared and refreshed if new servers are purchased. 
  if (maxDepth === defaultMaxDepth) {
    log(ns, `writing networkNodes to ${NETWORK_NODES_FILE}`);
    ns.write(NETWORK_NODES_FILE, JSON.stringify(networkNodes), "w");
  }
  return networkNodes;
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
        if (Number(server[property]) <= Number(filters[property])) continue; 
      } 
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
export function filterRootAccessServers(ns: NS, servers: NetworkServer[]): NetworkServer[] {
  const filterCriteria: FilterCriteria = {
    hasAdminRights: true,
  };
  return filterServerProperties(ns, servers, filterCriteria);
}
