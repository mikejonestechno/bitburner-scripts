import { NS } from "@ns";
import { log, icon, color } from "util/log";
import { NetworkServer, getNetworkServers, filterServerProperties, scanNetwork} from "util/network";

export function main(ns: NS) {
    let depth = Number(ns.args[0]);
    if(undefined === depth || Number.isNaN(depth)) depth = 1;
    ns.tprintf("showDashboard(depth=%d)", depth);

    const networkNodes = scanNetwork(ns, depth);
    const network = getNetworkServers(ns, networkNodes);
    const filterCriteria = {
        purchasedByPlayer: false,
        hasAdminRights: true
    };
    const vulnerableServers = filterServerProperties(ns, network, filterCriteria);
    showDashboard(ns, vulnerableServers, dashboardColumns, false);
}

// Define common string formats for printing numbers in fixed width columns
type PrintFormat = {
    padding: number, 
    fractionalDigits?: number, 
    isInteger?: boolean, 
    prefix?: string, 
    suffix?: string
};
const format: {[key: string]: PrintFormat} = {
    int: {padding: 4, fractionalDigits: 0, isInteger: true},
    decimal: {padding: 7, fractionalDigits: 2},
    money: {padding: 8, fractionalDigits: 2, isInteger: false, prefix: "$"},
    percent: {padding: 7, fractionalDigits: 2, isInteger: false, suffix: "%"},
    boolean: {padding: 1, isInteger: false},
    ram: {padding: 5, fractionalDigits: 0, isInteger: true},
};

type Column = {heading: string, property: keyof NetworkServer, format: PrintFormat };

const scanAnalyzeColumns: Column[] = [
    {heading: "network", property: "hostname", format: {padding: -16, isInteger: false}},
    {heading: icon.key, property: "hasAdminRights", format: format.boolean},
    {heading: "RAM", property: "maxRam", format: format.ram},
    {heading: "hack" + icon.techno, property: "requiredHackingSkill", format: {padding: 6, fractionalDigits: 0, isInteger: true, suffix: icon.techno}}, 
    {heading: "ports", property: "numOpenPortsRequired", format: {padding: -10}},   
];

const dashboardColumns: Column[] = [
    {heading: "hostname", property: "hostname", format: {padding: -20, isInteger: false}},
    // all vulnerable servers will have admin rights, so hide this column
    //{heading: icon.key, property: "hasAdminRights", format: format.boolean},
    {heading: "RAM", property: "maxRam", format: format.ram},
    {heading: "hack" + icon.techno, property: "requiredHackingSkill", format: {padding: 6, fractionalDigits: 0, isInteger: true, suffix: icon.techno}}, 
    {heading: "$ avail", property: "moneyAvailable", format: format.money},
    {heading: "$ max", property: "moneyMax", format: format.money},
    //{heading: "chance", property: "hackChance", format: format.percent},
    {heading: icon.police, property: "hackDifficulty", format: format.decimal}, // securityLevel
    {heading: "min " + icon.police, property: "minDifficulty", format: format.decimal}, // securityLevel
    {heading: "grow", property: "serverGrowth", format: format.int},
];

/**
 * Prints the scan-analyze dashboard for the specified network servers.
 * @param ns - The NetScriptAPI object.
 * @param network - An array of network servers to display in the terminal.
 */
export function showScanAnalyze(ns: NS, network: NetworkServer[]) {
    const dashboardPerformance = performance.now();
    showDashboard(ns, network, scanAnalyzeColumns, true);
    log(ns, `showScanAnalyze() completed in ${(performance.now() - dashboardPerformance).toFixed(2)}ms`, "SUCCESS");
}    

/**
 * Displays a dashboard of network servers with customizable columns.
 * @param ns - The NetScriptAPI object.
 * @param network - An array of network servers to display.
 * @param columns - An optional array of columns to display. Defaults to dashboardColumns.
 * @param terminal - An optional boolean indicating whether to display the dashboard in the terminal. Defaults to false.
 */
export function showDashboard(ns: NS, network: NetworkServer[], columns: Column[] = dashboardColumns, terminal: boolean = false) {

    let columnSeparator = " "; // can be useful setting to "|" for debugging alignment issues
    const fontHeight = 24; // font height in pixels (tail window title bar is 28px high)
    if (!terminal) { 
        //ns.clearLog();
        ns.disableLog('ALL');
        ns.tail();
        ns.resizeTail(1600, 32 + (fontHeight * 2) + (fontHeight * network.length));
    }

    let maxDepth = 0; // used to calculate padding for network tree heading

    // Step 1: Output the column names
    const columnNames = columns.map(column => {

        let padding = column.format.padding; 
        
        switch (column.heading) {
            case "network": // increase padding for network tree heading
                maxDepth = network.reduce((max, server) => {
                    return (server.depth > max) ? server.depth : max;
                }, 0);
                log(ns, `Maximum depth: ${maxDepth}`);
                padding -= (maxDepth*2); break;
        }
        // Some (not all) emoji characters comprise of multiple unicode-16 glyphs.
        // Some emoji characters are rendered in bitburner at non-fixed pixel width font. :-(
        // Hardcoded increase padding for now
        if (column.heading.includes(icon.techno)) { padding += 3; } // hack for techno icon (3 chars)

        // use padStart to right align column, use padEnd to left align column with Math.abs to convert to positive number
        return (padding >= 0) ? column.heading.padStart(padding) : column.heading.padEnd(Math.abs(padding));
    });
    ns.printf(`${color.yellow}%s%s`, columnNames.join(columnSeparator), columnSeparator);
    if (terminal) { ns.tprintf(`${color.yellow}%s`, columnNames.join(columnSeparator)); }

    // Step 2: Output the formatted data with padding alignment
    for (let server of network) {
        // Create an array to store the formatted data for the current server
        const rowData = [];

        for (let column of columns) {

            // Get the value of the server property
            const value = (server[column.property] !== undefined) ? server[column.property] : "--";

            // Format the value
            let padding = column.format.padding;
            let formattedValue = value;
            switch (column.heading) { // special formatting
                case "network": // additional formating to indent network tree branches
                    formattedValue = server.depth == 0 ? formattedValue : " │".repeat(server.depth-1) + " ├ " + formattedValue;
                    padding -= (maxDepth*2);
                case "hostname":
                    let hostnameColor = color.yellow; 
                    if (server.numOpenPortsRequired !== undefined && server.numOpenPortsRequired > 0) {
                        hostnameColor = server.numOpenPortsRequired == 1 ? color.orange : color.red;
                    }
                    if (server.hasAdminRights) {
                        hostnameColor = color.green;
                    }
                    formattedValue = hostnameColor + formattedValue;
                    padding -= hostnameColor.length;
                    break;
                case "ports":
                    formattedValue = formattedValue = icon.lock.repeat(value); break;
                default: // regular formatting
                    switch (column.format) {
                        case format.boolean: 
                            formattedValue = icon[value.toString()]; break;
                        case format.int:
                        case format.decimal:
                        case format.money:
                            formattedValue = ns.formatNumber(value, column.format.fractionalDigits); break;
                        case format.ram:
                            formattedValue = ns.formatRam(value, column.format.fractionalDigits); break;
                        default: 
                            formattedValue = value.toString(); break;
                    }    
            }

            if (column.format.prefix !== undefined) { formattedValue = column.format.prefix + formattedValue; }
            if (column.format.suffix !== undefined) { formattedValue = formattedValue + column.format.suffix; }

            // Pad the formatted value to the column width
            // use padStart to right align column, use padEnd to left align column with Math.abs to convert to positive number
            if (formattedValue.includes(icon.techno)) { padding += 3; } // hack for techno icon (3 chars)
            formattedValue = (padding >= 0) ? formattedValue.padStart(padding) : formattedValue.padEnd(Math.abs(padding));

            // Add the formatted value to the rowData array
            rowData.push(formattedValue);
        }

        // Print the rowData to log and/or terminal
        columnSeparator = color.white + columnSeparator
        //ns.printf(`${color.cyan}%s${columnSeparator}%s%s`, rowData[0], rowData.slice(1).join(columnSeparator), columnSeparator);
        ns.printf(`%s%s`, rowData.join(columnSeparator), columnSeparator);
        if(terminal) { 
            //ns.tprintf(`${color.cyan}%s${columnSeparator}%s%s`, rowData[0], rowData.slice(1).join(columnSeparator), columnSeparator); 
            ns.tprintf(`%s%s`, rowData.join(columnSeparator), columnSeparator);
        }
    }
}
