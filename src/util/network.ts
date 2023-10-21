import { NS } from "@ns";
import { log } from "util/log";

export function main(ns: NS, depth: any) {
  depth = ns.args[0];
  scanAnalyze(ns, depth);
}

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
