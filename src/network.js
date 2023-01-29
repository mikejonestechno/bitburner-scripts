/** @param {NS} ns **/
import { log } from "log.js";
//import {getCracksAvailable} from "cracks.js";
// Script RAM cost is 8.10 GB but main doesnt use all of that.

export async function main(ns) {
}

/*  Ports allow me to share data between scripts or servers without need to read/write files.
    They are intended as service bus 'queues' but could have a queue of one stringified data map.
    Only disadvantage is the ports are lost when game is offline/reset.
    
    Perhaps long term I see a port used for analysis queue, and iterate the queue focus more analysis on 
    servers I am actively attacking, less focus, less wasted analysis on servers with low value or servers
    with too high value that I cannot attack yet. Perhaps as an experiment. When functions take milliseconds
    there is likely to be little benefit unless there are millions of servers in the array.

    I could see a port with current botNet servers, a port with uncracked servers. As I crack a server then
    function will remove the server from the uncracked list and add to the botNet list, no need to continuously
    refresh or run a filter operation. 
    */
  export const portMap = {
    networkMap: 1,  // JSON.stringify NetworkMap
    targetMap: 2,   // subset of target servers I can hack, grow, weaken
    grow: 3,        // grow these targets to maxMoney {hostname, threads}
    sustain: 4      // hack these targets for sustainable income {hostname, threads}
  };

  export function saveMapData(ns, mapData, fileBaseName = "data", portNumber) {
  const filepath = `/data/${fileBaseName}.txt`;
  // convert the map to an array of key-value pairs
  const arrayData = Array.from(mapData.entries());
  // stringify the array
  log(ns, `stringyfy JSON`);
  const jsonData = JSON.stringify(arrayData);
  // write the string to a file
  ns.write(filepath, jsonData,"w");
  log(ns, `Saved ${filepath} with ${jsonData.length} chars`, "INFO");
  // write the string to port portNumber
  if (portNumber) {
    const writeSuccess = ns.tryWritePort(portNumber, jsonData);
    log(ns, `writePort ${portNumber} is ${writeSuccess}`, "INFO");    
  };
  ns.toast(`Saved ${filepath}`); 
}
export function readMapData(ns, filePath, portNumber = 1) {
  let jsonData = "";

  if (filePath) {
    // read the file as a JSON string
    log(ns, `read ${filePath}`);
    jsonData = ns.read(filePath);
  } else {
    // read the port as a JSON string
    log(ns, `read port ${portNumber}`);
    jsonData = ns.peek(portNumber);
  }

  if (jsonData.length == 0) {
    log(ns, `cannot parse data: jsonData.length == 0`, "ERROR")
  }
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

export function sumMaxRam(ns, networkMap) {
  let maxRam = 0;
  networkMap.forEach((server, hostname) => {
    maxRam += server.maxRam;
  });
  return maxRam;
}

export function filterBotNetMap(ns, networkMap) {
  // all servers I have admin rights (all servers I can run scripts on), includes 'home'
  const filters = new Array({hasAdminRights: true});
  return filterMapByProperties(ns, networkMap, filters); 
}

export function filterVulnerableMap(ns, networkMap, numCracksAvailable=0) {
  // all servers with open ports that I can crack and NUKE to run scripts on
  // cannot use the generic filterMapByProperties() because I want to filter using '<=' operator
  const startPerformance = performance.now();

  const filteredArray = Array.from(networkMap.entries()).filter(([hostname, server]) => 
    server.hasAdminRights == false && 
    server.purchasedByPlayer == false &&
    server.numOpenPortsRequired <= numCracksAvailable    
    );
  log(ns, `filterVulnerableMap() found ${filteredArray.length} servers in ${(performance.now() - startPerformance).toFixed(2)} ms`, "SUCCESS" );  
  return new Map(filteredArray);
}

export function filterTargetMap(ns, networkMap, currentHackingLevel) {
  // all target servers at or below my hacking level that I can hack, grow or weaken
  // For efficiency, if i have already filtered map of servers I have admin access to
  // then pass in botNetMap or previousTargetMap rather than full NetworkMap. 
  if (currentHackingLevel == undefined) {
    log(ns, `hacking level is ${currentHackingLevel}`, "ERROR"); 
  }

  const startPerformance = performance.now();
  const filteredArray = Array.from(networkMap.entries()).filter(([hostname, server]) => 
      server.hasAdminRights == true && 
      server.purchasedByPlayer == false &&
      server.requiredHackingSkill <= currentHackingLevel
      );
      log(ns, `filterTargetMap() found ${filteredArray.length} servers in ${(performance.now() - startPerformance).toFixed(2)} ms`, "SUCCESS" );  
      return new Map(filteredArray);
}

export function filterMapByProperties(ns, map, filters) {
  // Usage: const filteredMap = filterMapByProperties(networkMap, [{hasAdminRights: true, purchasedByPlayer: false}]);
  // convert the map to an array of entries, use array.filter() then convert back to a Map
  const filteredArray = Array.from(map.entries()).filter((entry) => {
      for (let i = 0; i < filters.length; i++) {
          const filter = filters[i];
          const keys = Object.keys(filter);
          for (let j = 0; j < keys.length; j++) {
              const key = keys[j];
              if (entry[1][key] !== filter[key]) {
                  return false;
              }
          }
      }
      return true;
  });
  //log(ns, `filterMapByProperties() found ${filteredArray.length} entries`, "INFO" );   
  return new Map(filteredArray);
}

export function sortMapByProperty(ns, map, properties) {
  // Usage: const sortedMap = sortMapByProperty(networkMap, ["hackMoneyPerSecond", "requiredHackingSkill"]);
  // convert the map to an array of entries, use array.sort() then convert back to a Map
  // To do: is there a method or property (like .length or .size) to just get max value without the need to iterate through values?
  // i am getting cannto read properties of length
  const sortedArray = Array.from(map.entries()).sort((a, b) => {
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (b[1][property] !== a[1][property]) {
        return b[1][property] - a[1][property];
      }
    }
  });
  log(ns, `sortMapByProperty() found ${sortedArray[0][1].hostname} has highest ${properties[0]} of ${sortedArray[0][1][properties[0]]}`, "INFO" );   
  return new Map(sortedArray);
}

export function analyzeHackNetworkMap(ns, networkMap) {
  /*
   *  Analyze servers for hacking
   *  Pass in a networks object to only fetch properties for those servers.
   *  RAM cost: 0.25 GB
   */

  const startPerformance = performance.now();

  networkMap.forEach((server, hostname) => {
    log(ns, `analyzing server ${hostname}`); 

    const moneyAvailable = ns.getServerMoneyAvailable(hostname);
    const hackMoneyPercent = ns.hackAnalyze(hostname);
    const hackMoney = hackMoneyPercent * moneyAvailable;
    const hackMaxMoney = hackMoneyPercent * server.moneyMax;
    const hackChance = ns.hackAnalyzeChance(hostname);
    const hackTime = ns.getHackTime(hostname);
    const properties = {
      moneyAvailable: moneyAvailable,
      hackTime: hackTime,
      hackChance: hackChance,
      hackMoneyPercent: hackMoneyPercent,
      hackMoney: hackMoney,
      hackMaxMoney: hackMaxMoney,
      hackMoneyPerSecond: (hackChance * hackMoney)/(hackTime/1000),
      hackMaxMoneyPerSecond: (hackChance * hackMaxMoney)/(hackTime/1000),      
    };
    Object.assign(server, properties);
  });

  log(ns, `analyzeNetworkMap() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   
  return networkMap;
}

export function analyzeNetworkMap(ns, networkMap) {
  /*
   *  Analyze servers for grow and weaken only - use hack analyze for hacking analysis
   *  Pass in a networks object to only fetch properties for those servers.
   *  RAM cost: 1.05 GB
   */

  const startPerformance = performance.now();

  networkMap.forEach((server, hostname) => {
    log(ns, `analyzing server ${hostname}`); 

    const moneyAvailable = server.moneyAvailable;
    const weakenTime = ns.getWeakenTime(hostname);
    const growThreads2x = ns.growthAnalyze(hostname, 2, 1);
    const growThreads10x = ns.growthAnalyze(hostname, 10, 1);
    const growTime = ns.getGrowTime(hostname);
    // How much is 10x money?
    const money2x = moneyAvailable * 2;
    const money10x = moneyAvailable * 10;
    // How much money will each thread grow? and grow/sec?
    const growMoney2x = money2x / growThreads2x; 
    const growMoney10x = money10x / growThreads10x; 
    const growMoney2xPerSecond = growMoney2x / (growTime/1000); 
    const properties = {
      growTime: growTime,
      growThreads2x: growThreads2x,
      growThreads10x: growThreads10x,
      growMoney2x: growMoney2x,
      growMoney10x: growMoney10x,
      growMoney2xPerSecond: growMoney2xPerSecond,
      weakenTime: weakenTime,
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
   *  RAM cost: 0.30 GB
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
  const startPerformance = performance.now();
  networkMap.forEach((server, hostname) => {
    log(ns, `get nmap for server ${hostname}`); 
    Object.assign(server, ns.getServer(hostname));
  });
  log(ns, `getNetworkMapServers() completed in ${(performance.now() - startPerformance).toFixed(2)} milliseconds`, "SUCCESS");   
  
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
