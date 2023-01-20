/** @param {NS} ns **/
import { log } from "log.js";
//import {getCracksAvailable} from "cracks.js";
// Script RAM cost is 8.10 GB but main doesnt use all of that.

export async function main(ns) {
}

export function saveMapData(ns, mapData, fileBaseName = "data") {
  const filepath = `/data/${fileBaseName}.txt`;
  // convert the map to an array of key-value pairs
  const arrayData = Array.from(mapData.entries());
  // stringify the array
  log(ns, `stringyfy JSON`);
  const jsonData = JSON.stringify(arrayData);
  // write the string to a file
  ns.write(filepath, jsonData,"w");
  log(ns, `Saved ${filepath} with ${jsonData.length} chars`, "INFO");
  ns.toast(`Saved ${filepath}`); 
}
export function readMapData(ns, filePath) {
  // read the file as a JSON string
  log(ns, `read ${filePath}`);
  const jsonData = ns.read(filePath);
  // parse the string to an array
  log(ns, `parse JSON of ${jsonData.length} chars`);
  const arrayData = JSON.parse(jsonData);
  // convert the array to a map
  log(ns, `convert to Map`);
  const mapData = new Map(arrayData);
  return mapData;
}

export function saveData(ns, dataObject, name = "data") {
  const filename = `/data/${name}.txt`;
  ns.write(filename, JSON.stringify(Object.entries(dataObject)),"w");
  log(ns, `Saved ${filename}`, "INFO");
  ns.toast(`Saved ${filename}`); 
}

export function getBotNetServers(ns, networkMap, cracksAvailable=[]) {
  // all botNet servers that I have root admin rights (servers I can run scripts on)

  const startPerformance = performance.now();
  const numCracksAvailable = cracksAvailable.length; 

  // Could convert the Map to array and then array.filter() and then convert filtered array back to a Map
  // or just map.forEach() and if matching entry add to a new filteredSevers Map.
  const filteredServers = new Map();
  networkMap.forEach((server, hostname) => {
    if (
      server.hasAdminRights == true
    ) {
      log(ns, `have admin right on ${hostname}`); 
      filteredServers.set(hostname, server);
    }
  });

  log(ns, `getBotNetServers() found ${filteredServers.size} servers in ${(performance.now() - startPerformance).toFixed(2)} ms`, "SUCCESS");   
  return filteredServers;
}

export function getVulnerableServers(ns, networkMap, cracksAvailable=[]) {
  // vulnerable servers with open ports that I can crack and NUKE to run scripts on

  const startPerformance = performance.now();
  const numCracksAvailable = cracksAvailable.length; 

  // Could convert the Map to array and then array.filter() and then convert filtered array back to a Map
  // or just map.forEach() and if matching entry add to a new filteredSevers Map.
  const filteredServers = new Map();
  networkMap.forEach((server, hostname) => {
    if (
      server.hasAdminRights == false && 
      server.purchasedByPlayer == false &&
      server.numOpenPortsRequired <= numCracksAvailable
    ) {
      log(ns, `got vulnerable host ${hostname}`); 
      filteredServers.set(hostname, server);
    }
  });

  log(ns, `getVulnerableServers() found ${filteredServers.size} servers in ${(performance.now() - startPerformance).toFixed(2)} ms`, "SUCCESS");   
  return filteredServers;
}

export function getHackTargetMap(ns, networkMap, currentHackingLevel) {
  // get target servers that I can hack
  if (currentHackingLevel == undefined) {
    log(ns, `hacking level is ${currentHackingLevel}`, "ERROR"); 
  }

  const startPerformance = performance.now();
  const filteredServers = new Map();

  networkMap.forEach((server, hostname) => {
    if (
      server.hasAdminRights == true && 
      server.purchasedByPlayer == false &&
      server.requiredHackingSkill <= currentHackingLevel
    ) {
      log(ns, `possible hack target ${hostname}`); 
      filteredServers.set(hostname, server);
    }
  });
  
  log(ns, `getHackTargets() found ${filteredServers.size} servers in ${(performance.now() - startPerformance).toFixed(2)} ms`, "SUCCESS");   
  return filteredServers;
}

export function sortMapByProperty(ns, map, property) {
  // Usage: const sortedMap = sortMapByProperty(networkMap, "hackMoneyPerSecond");
  // convert the map to an array of entries, use array.sort() then convert back to a Map
  const sortedArray = Array.from(map.entries()).sort((a, b) => b[1][property] - a[1][property]);
  log(ns, `sortMapByProperty() found ${sortedArray[0][1].hostname} has highest ${property} of ${sortedArray[0][1][property]}`, "INFO" );   
  return new Map(sortedArray);
}

  /*
    // RAM cost: 0.05 GB each
    network[hostname].timeGrow = ns.getGrowTime(hostname);
    network[hostname].timeWeaken = ns.getWeakenTime(hostname);
    // How much is 10x money?
    const money10x = network[hostname].moneyAvailable * 10;
    // Threads required to grow 10x money
    const growThreads10x = ns.growthAnalyze(hostname,10,1);
    // How much money will each thread grow? and grow/sec
    network[hostname].growMoney = money10x / growThreads10x;
    network[hostname].growMoneyPerSecond = network[hostname].growMoney / (network[hostname].timeGrow/1000); 
  };
  */


export function analyzeHackTargetMap(ns, networkMap) {
  /*
   *  Analyze servers
   *  Pass in a networks object to only fetch properties for those servers.
   *  RAM cost: 0.25 GB
   */

  const startPerformance = performance.now();

  networkMap.forEach((server, hostname) => {
    log(ns, `analyzing server ${hostname}`); 

    const moneyAvailable = ns.getServerMoneyAvailable(hostname);
    const moneyMax = ns.getServerMaxMoney(hostname);
    const hackMoneyPercent = ns.hackAnalyze(hostname);
    const hackMoney = hackMoneyPercent * moneyAvailable;
    const hackChance = ns.hackAnalyzeChance(hostname);
    const hackTime = ns.getHackTime(hostname);
    const properties = {
      hackTime: hackTime,
      hackChance: hackChance,
      hackMoneyPercent: hackMoneyPercent,
      hackMoney: hackMoney,
      hackMoneyPerSecond: (hackChance * hackMoney)/(hackTime/1000),
      moneyAvailable: moneyAvailable,
      moneyMax: moneyMax,
    };
    Object.assign(server, properties);
  });

  log(ns, `analyzeNetworkMap() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   
  return networkMap;
}


export function getNetworkMap(ns, networkMap) {
  /*
   *  Add minimal server properties avoiding use of ns.getServer() that has RAM cost: 2 GB
   *  Pass in a networks object to only fetch properties for those servers.
   *  RAM cost: 0.25 GB
   */
  const startPerformance = performance.now();

  networkMap.forEach((server, hostname) => {
    log(ns, `get nmap networkMap ${hostname}`); 
    const level1Targets = ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym"];
    const properties = {
      hasAdminRights: ns.hasRootAccess(hostname), // RAM cost: 0.05 GB
      numOpenPortsRequired: ns.getServerNumPortsRequired(hostname), // RAM cost: 0.10 GB
      requiredHackingSkill: ns.getServerRequiredHackingLevel(hostname), // RAM cost: 0.10 GB
      maxRam: ns.getServerMaxRam(hostname), // RAM cost: 0.05 GB
      purchasedByPlayer: (server.depth < 2 && !level1Targets.includes(hostname)) ? true : false,
    };
    Object.assign(server, properties);
  });

  log(ns, `getNetworkMap() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   

  return networkMap;
}


export function getNetworkMapServers(ns, networkMap) {
  /*
   *  Add server properties using ns.getServer()
   *  Pass in a networks object to only fetch properties for those servers.
   *  RAM cost: 2 GB
   */

  networkMap.forEach((server, hostname) => {
    log(ns, `get nmap for server ${hostname}`); 
    Object.assign(server, ns.getServer(hostname));
  });
  
  return networkMap;
}


export function scanNetworkMap(ns, maxDepth = 50) {
  /*
   *  Scans the network using breadth-first search traversal. Scan takes approx 1 to 4 milliseconds.
   *  Simulates a trace route tool using ICMP messages to discover information about the network topology and the location of servers.
   *  Returns a map of node objects, with their parent and tree depth.
   *  hostname: { hostname, parent, depth }
   *  RAM cost: 200 MB
   */

  // Sector12 actually has depth = 15 but function needs to go 16 maxDeep to ensure the 15th nodes only return 1 connection (their parent).

  // Create Map for storing the network tree
  const networkMap = new Map();
    
  // Create a queue for storing the nodes to be scanned
  const queue = [{
    depth: 0,
    hostname: "home",
    parent: undefined,
  }];

  const startPerformance = performance.now();

  ns.disableLog('ALL');

  while (queue.length > 0) {

    // Get the first node from the queue
    const node = queue.shift();

    if (!networkMap.has(node.hostname)) {
      networkMap.set(node.hostname, node);
      log(ns, `added to networkMap ${node.hostname}`);
    }

    /* If node is NOT at max depth, run a scan to find deeper connections */
    if (node.depth < maxDepth) {

      log(ns, `scanning ${node.hostname}`, "INFO");

      // ns.scan() returns hostnames of ALL neighbors including home, parent node, and purchased servers.
      const neighbors = ns.scan(node.hostname);

      // delete the parent from the neighbors array (everything else will be a peer or a child).
      delete neighbors[node.parent];

      neighbors.forEach(neighbor => {
        // if the neighbor is already in the network, its a peer to another neighbor
        if (!networkMap.has(neighbor)) {
          // if its not already in the network, its a new child!
          networkMap.set(neighbor, {
            depth: node.depth + 1,
            hostname: neighbor,
            parent: node.hostname,
          });
          log(ns, `added to networkMap ${neighbor}`);

          if (node.depth + 1 < maxDepth) {
            log(ns, `added to scan queue ${neighbor}`);
            queue.push(networkMap.get(neighbor));
          }
        }  
      });
      
    }

  }

  log(ns, "scan queue is empty", "INFO");

  log(ns, `scanNetworkMap() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   

  return networkMap;
}
