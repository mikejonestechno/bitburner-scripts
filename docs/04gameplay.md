# 04: Filter Network

I want to filter the network server list and create a script to NUKE those open servers.

## Filter Vulnerable Servers

The `getNetworkServers()` function will loop through every node in the network and get the server properties.

I created reusable `filterServerProperties()` function that takes a partial array of server property values, and filters out any servers that do not match the desired values. 

To filter a list of vulnerable servers (with no furher open ports required) I need to filter on the `numOpenPortsRequired` property. 

Here is the output of `filterServerProperties()` at the start of the game:

`VulnerableServers: n00dles, foodnstuff, sigma-cosmetics, nectar-net, joesguns, hong-fang-tea, harakiri-sushi`

The next step is to NUKE these servers.

## About the Code

I created a `start.ts` script to create the Network map and then apply the filter for vulnerable servers. 

``` Typescript
export function main(ns: NS) {
    
    const networkNodes = scanNetwork(ns);
    const network = getNetworkServers(ns, networkNodes);
    
    const vulnerableServers = filterServerProperties(ns, network, {numOpenPortsRequired: 0});
    ns.tprint("VulnerableServers: " + Array.from(vulnerableServers.keys()).join(", "));

}
```
For each server in the network, the `filterServerProperties()` function iterates through each filter condition property, and checks if the server does not match the desired value specified in the filter.

Servers that do not match one of the desired filter values are discarded, servers that matched all filter values are added to a new `filteredNetwork` Map.


``` typescript
type FilterCriteria = Partial<NetworkServer>;
export function filterServerProperties(ns: NS, network: Network, filters: Partial<NetworkServer>): Network {

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
```

### Filter Errors

After several hours of google and chatGPT I created additional error handling for checking that the desired filter properties are valid filter properties for the NetworkServer interface. 

Otherwise unexpected behaviours may result from unnoticed typos in property names, for example the following function returns a Network Map of vulnerable servers as expected:

``` typescript
filterServerProperties(ns, network, {numOpenPortsRequired: 0}); 
```

while the following function returns an empty Network Map which may or may not be expected depending on the server values:

``` typescript
filterServerProperties(ns, network, {numberOpenPortsRequired: 0}); 
```

The debug log could help identify which filter was causing the issue if multiple filter properties were being applied at the same time:

```
DEBUG n00dles did not match filter: numberOpenPortsRequired !== 0
```

However this relies on looking at the log and depending upon the filter criteria it may not not even be obvious that the filtered result was incorrect in the first place. Perhaps the results appear correct the first time I run the filter and I don't realise there is a mistake in the code till very much later.

Typescript interfaces can be extended with new properties making it difficult to determine whether a named property does or does not exist on the interface. Maybe it does, maybe it will in the future...!

Many hours of chatGPT, trial and error and brute determination I found a resolution.

A helper function `isKeyOfObject()` checks if a given string, number or symbol is a key of the given object type.

```
export function isKeyOfObject<T extends Object>(
  key: string | number | symbol,
  obj: T,
  ): key is keyof T {
  return key in obj;
}
```

An error handling check at the start of the `filterServerProperties()` function gets the home server `as NetworkServer` (in case a server named 'home' is undefined) and then checks every key in the filter properties is a valid key of the home NetworkServer object.

```
  const home = network.get("home") as NetworkServer;
  const validKeys = Object.keys(filters).every((key) => isKeyOfObject(key, home));
  if (!validKeys) {
    throw new Error('Invalid property names in filter: ' + Object.keys(filters) );
  }
```

Calling `filterServerProperties(ns, network, {numberOpenPortsRequired: 0});` now results in a runtime error at compile time instead of returning a valid but unexpected Network Map. 

```
RUNTIME ERROR
Error: Invalid property names in filter: numberOpenPortsRequired
    at filterServerProperties (home/util/network.js:131:15)
```

I'm sure this could be improved much further but its already much better than no error handling at all.
