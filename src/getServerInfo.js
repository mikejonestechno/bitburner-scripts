// import { functionName, functionName2 } from "./utils.js"

/** @param {NS} ns **/
export async function main(ns) {
    
    // initalize arguments
    var hostname = ns.args[0];
    if (hostname === undefined) {
        hostname = "home";
    }

	const color = {
		black: "\u001b[30m",
		red: "\u001b[31m",
		green: "\u001b[32m",
		yellow: "\u001b[33m",
		blue: "\u001b[34m",
		magenta: "\u001b[35m",
		cyan: "\u001b[36m",
		white: "\u001b[37m",
		brightBlack: "\u001b[30;1m",
		brightRed: "\u001b[31;1m",
		brightGreen: "\u001b[32;1m",
		brightYellow: "\u001b[33;1m",
		brightBlue: "\u001b[34;1m",
		brightMagenta: "\u001b[35;1m",
		brightCyan: "\u001b[36;1m",
		brightWhite: "\u001b[37;1m",
		reset: "\u001b[0m"
	};
    /*
	for(const key of Object.keys(colors)) {
		ns.printf(`${color[key]}${key}`);
	} 
    */ 

    const icon = {
        true: "✔️",
        false: "❌"
    };

    // getServer costs 2 GB and returns a server object
    // https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.server.md
    // may be more memory efficient to just call the bits we want e.g. getServerMaxMoney costs 100 MB
    var server = ns.getServer(hostname);

    ns.printf(`${color.cyan}Hostname: \t%s`, server.hostname);
    ns.printf(`${color.white}Organization: \t%s`, server.organizationName);

    // Networking
    ns.printf(`${color.white}Backdoor: %s \tip: %s`, icon[server.backdoorInstalled], server.ip); //server.backdoorInstalled);

    // Specification 
    ns.printf(`${color.cyan}Specification`);
    ns.printf(`${color.white}CPU Cores: \t%d \tMax: 8`, server.cpuCores);
    ns.printf(`${color.white}RAM: \t\t%d GB \t${color.green}Max: %d GB`, server.ramUsed, server.maxRam);
    // ns.printf(`${color.white}Purchased By Player: \t%s`, server.purchasedByPlayer);

    // Security
    ns.printf(`${color.cyan}Security`);
    ns.printf(`${color.white}Hack required: \t%d \tRoot: %s`, server.requiredHackingSkill, icon[server.hasAdminRights]);
    ns.printf(`${color.white}Security level:\t%f \t${color.green}Min: %f`, server.hackDifficulty, server.minDifficulty);

    // Ports
    if(server.openPortCount >= server.numOpenPortsRequired) {
        var portColor = color.green;
    } else {
        var portColor = color.red;
    }
    ns.printf(`${color.white}Open Ports: ${portColor}%d of %d required.`, server.openPortCount, server.numOpenPortsRequired);
    ns.printf(`${color.white}ftp:%s http:%s smtp:%s sql:%s ssh:%s`, icon[server.ftpPortOpen], icon[server.httpPortOpen], icon[server.smtpPortOpen], icon[server.sqlPortOpen], icon[server.sshPortOpen]);
    
    // Funds
    ns.printf(`${color.cyan}Funds`);
    ns.printf(`${color.white}Available:\t\$ %f m`, server.moneyAvailable / 1000000);
    ns.printf(`${color.green}Max:\t\t\$ %f m`, server.moneyMax / 1000000);
    ns.printf(`${color.white}Grow factor: \t%f`, server.serverGrowth);

    // server object also has 'contracts' 'programs' 'scripts' 'runningScripts' 'serversOnNetwork' 'textfiles' and 'messages' properties

    ns.tail(); // display the log (stays visible after script terminates)
}