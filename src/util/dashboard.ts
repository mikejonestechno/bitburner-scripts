import { NS } from "@ns";
import { log, icon, color } from "util/log";
import { NetworkServer, filterHackServers, filterHackableServers, filterServerProperties } from "util/network";
import { readDataFile, readPlayerData } from "util/data";

export function main(ns: NS) {
    const flags = ns.flags([
        ['show', "dashboard"], // Columns to show. Valid values are "hack", "grow", "scanAnalyze", "dashboard"
    ]);

    let columns: Column[];
    switch (flags.show) {
        case "hack": columns = hackColumns; break;
        case "grow": columns = growColumns; break;
        case "scanAnalyze": columns = scanAnalyzeColumns; break;
        default: columns = dashboardColumns; break;
    }

    const PLAYER = readPlayerData(ns);
    const NETWORK_FILE = `data/${PLAYER.city}/network.txt`;
    let dashboardServers = readDataFile(ns, NETWORK_FILE) as NetworkServer[];

    if (flags.show === "hack") {
        dashboardServers = filterHackServers(ns, dashboardServers);        
    } else {
        dashboardServers = filterHackableServers(ns, dashboardServers);
    }
    if (dashboardServers.length === 0) {
        throw new Error(`No hackable servers found. Do you need to scan and crack some servers?`);
    }
    showDashboard(ns, dashboardServers, columns, false);
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
    percent: {padding: 7, fractionalDigits: 2, isInteger: false}, // ns.formatPercent() already has the "%" suffix
    seconds: {padding: 6, fractionalDigits: 0, isInteger: true, suffix: "s"},
    boolean: {padding: 1, isInteger: false},
    ram: {padding: 5, fractionalDigits: 0, isInteger: true},
    hostname: {padding: -18},
};

type Column = {heading: string, property: keyof NetworkServer, format: PrintFormat };

export const scanAnalyzeColumns: Column[] = [
    {heading: "network", property: "hostname", format: format.hostname},
    {heading: icon.key, property: "hasAdminRights", format: format.boolean},
    {heading: "RAM", property: "maxRam", format: format.ram},
    {heading: "hack" + icon.techno, property: "requiredHackingSkill", format: {padding: 6, fractionalDigits: 0, isInteger: true, suffix: icon.techno}}, 
    {heading: "ports", property: "numOpenPortsRequired", format: {padding: -10}},   
];

const dashboardColumns: Column[] = [
    {heading: "hostname", property: "hostname", format: format.hostname},
    // all vulnerable servers will have admin rights, so hide this column
    //{heading: icon.key, property: "hasAdminRights", format: format.boolean},
    {heading: "RAM", property: "maxRam", format: format.ram},
    {heading: "hack" + icon.techno, property: "requiredHackingSkill", format: {padding: 6, fractionalDigits: 0, isInteger: true, suffix: icon.techno}}, 
    {heading: "$ avail", property: "moneyAvailable", format: format.money},
    {heading: "$ max", property: "moneyMax", format: format.money},
    {heading: "% avail", property: "moneyAvailablePercent", format: format.percent},
    {heading: "hack s", property: "hackTime", format: format.seconds}, 
    {heading: "chance", property: "hackChance", format: format.percent},
    {heading: "h $/s", property: "hackMoneyPerSecond", format: format.money}, 
    {heading: "max $/s", property: "hackMaxMoneyPerSecond", format: format.money}, 
    {heading: icon.police, property: "hackDifficulty", format: {padding: 5, fractionalDigits: 2, suffix: icon.police}}, // securityLevel
    {heading: "min " + icon.police, property: "minDifficulty", format: {padding: 5, fractionalDigits: 2, suffix: icon.police}}, // minSecurityLevel
    {heading: "grow s", property: "growTime", format: format.seconds}, 
    {heading: "g $/s", property: "growMoneyPerSecond", format: format.money}, 
    {heading: icon.target, property: "targetHackMoneyPerSecond", format: format.boolean},
    {heading: icon.moneybag, property: "targetHackMaxMoneyPerSecond", format: format.boolean},
    {heading: icon.chart, property: "targetGrowMoneyPerSecond", format: format.boolean},
];

const hackColumns: Column[] = [
    {heading: "hostname", property: "hostname", format: format.hostname},
    {heading: "RAM", property: "maxRam", format: format.ram},
    {heading: "hack" + icon.techno, property: "requiredHackingSkill", format: {padding: 6, fractionalDigits: 0, isInteger: true, suffix: icon.techno}}, 
    {heading: "chance", property: "hackChance", format: format.percent},
    {heading: "steal %", property: "hackMoneyPercent", format: format.percent}, 
    {heading: "$ avail", property: "moneyAvailable", format: format.money},
    {heading: "$/hack", property: "hackMoney", format: format.money}, 
    {heading: "time", property: "hackTime", format: format.seconds}, 
    {heading: "hack $/s", property: "hackMoneyPerSecond", format: format.money}, 
    {heading: "$ max", property: "moneyMax", format: format.money},
    {heading: "$/hack", property: "hackMaxMoney", format: format.money}, 
    {heading: "max $/s", property: "hackMaxMoneyPerSecond", format: format.money}, 
    {heading: icon.target, property: "targetHackMoneyPerSecond", format: format.boolean},
    {heading: icon.moneybag, property: "targetHackMaxMoneyPerSecond", format: format.boolean},
];

const growColumns: Column[] = [
    {heading: "hostname", property: "hostname", format: {padding: -20, isInteger: false}},
    {heading: "RAM", property: "maxRam", format: format.ram},
    {heading: "grow", property: "serverGrowth", format: format.int},
    {heading: "$ avail", property: "moneyAvailable", format: format.money},
    {heading: "$ max", property: "moneyMax", format: format.money},
    {heading: "diff", property: "growThreadsMoney", format: format.money}, 
    {heading: "factor", property: "growthAnalyzeFactor", format: format.decimal}, 
    {heading: "threads", property: "growThreads", format: format.decimal}, 
    {heading: "$/grow", property: "growMoney", format: format.money}, 
    {heading: "time", property: "growTime", format: format.seconds}, 
    {heading: "g $/s", property: "growMoneyPerSecond", format: format.money},
    {heading: icon.police, property: "hackDifficulty", format: {padding: 5, fractionalDigits: 2, suffix: icon.police}}, // securityLevel
    {heading: "min " + icon.police, property: "minDifficulty", format: {padding: 5, fractionalDigits: 2, suffix: icon.police}}, // minSecurityLevel
    {heading: "weak s", property: "weakenTime", format: format.seconds},
    {heading: "threads", property: "weakenThreads", format: format.decimal},
    {heading: icon.chart, property: "targetGrowMoneyPerSecond", format: format.boolean},
];

/**
 * Displays a dashboard of network servers with customizable columns.
 * @param ns - The netscript interface to bitburner functions.
 * @param network - An array of network servers to display.
 * @param columns - An optional array of columns to display. Defaults to dashboardColumns.
 * @param terminal - An optional boolean indicating whether to display the dashboard in the terminal. Defaults to false.
 */
export function showDashboard(ns: NS, network: NetworkServer[], columns: Column[] = dashboardColumns, terminal: boolean = false) {

    let columnSeparator = " "; // can be useful setting to "|" for debugging alignment issues
    const fontHeight = 24; // font height in pixels (note tail window title bar is 32px high)
    const fontWidth = 9; // font width in pixels
    let tailHeight = 32 + (fontHeight * 2) + (fontHeight * network.length); // 32px for tail window title bar
    let tailWidth = 1700;
    if (!terminal) { 
        //ns.clearLog();
        ns.disableLog('ALL');
        ns.tail();
        ns.resizeTail(tailWidth, tailHeight);
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
        // Some emoji glyphs are rendered in bitburner at non-fixed pixel width font. :-(
        if (column.format !== format.boolean) {
            padding += (emojiPadding(ns, column.heading) * 3); 
        }

        // use padStart to right align column, use padEnd to left align column with Math.abs to convert to positive number
        return (padding >= 0) ? column.heading.padStart(padding) : column.heading.padEnd(Math.abs(padding));
    });
    const heading = color.yellow + columnNames.join(columnSeparator) + columnSeparator;
    if (!terminal) {
        tailWidth = heading.length * fontWidth;
        ns.resizeTail(tailWidth, tailHeight);
    }
    ns.print(heading);
    if (terminal) { ns.tprintf(heading); }

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
                    formattedValue = icon.lock.repeat(value); break;
                default: // regular formatting
                    if (value === "--") { break; }
                    switch (column.format) {
                        case format.boolean: 
                            formattedValue = icon[value.toString()]; break;
                        case format.int:
                        case format.decimal:
                        case format.money:
                        case format.seconds:                            
                            formattedValue = ns.formatNumber(value, column.format.fractionalDigits); break;
                        case format.percent:
                            formattedValue = ns.formatPercent(value, column.format.fractionalDigits); break;
                        case format.ram:
                            formattedValue = ns.formatRam(value, column.format.fractionalDigits); break;
                        default: 
                            if (undefined !== column.format.fractionalDigits) {
                                formattedValue = ns.formatNumber(value, column.format.fractionalDigits); break;
                            }
                            formattedValue = value.toString(); break;
                    }    
            }

            if (column.format.prefix !== undefined) { formattedValue = column.format.prefix + formattedValue; }
            if (column.format.suffix !== undefined) { formattedValue = formattedValue + column.format.suffix; }

            // Pad the formatted value to the column width
            // use padStart to right align column, use padEnd to left align column with Math.abs to convert to positive number
            if (column.format !== format.boolean) {
                padding += (emojiPadding(ns, formattedValue) * 3); 
            }
            formattedValue = (padding >= 0) ? formattedValue.padStart(padding) : formattedValue.padEnd(Math.abs(padding));

            // Add the formatted value to the rowData array
            rowData.push(formattedValue);
        }

        // Print the rowData to log and/or terminal
        columnSeparator = color.white + columnSeparator
        ns.printf(`%s%s`, rowData.join(columnSeparator), columnSeparator);
        if(terminal) { 
            ns.tprintf(`%s%s`, rowData.join(columnSeparator), columnSeparator);
        }
    }
}


/**
 * Calculates the amount of padding needed to offset the width of any emojis in the input string.
 * @remark bitburner terminal does not render emoji glyphs in a fixed pixel width font.
 * This makes this aligning emoji glyphs unreliable unless every row (including heading) contain the emoji.
 * @param ns - The netscript interface to bitburner functions.
 * @param inputString - The string to check for emojis.
 * @returns The amount of padding needed to offset the width of any emojis in the input string.
 */
function emojiPadding(ns: NS, inputString: string): number {
    // note emojiRegex = /\p{Emoji}/u; is not 100% reliable as numeric digits and $ # chars are matched too
    const emojiRegex = /(?!\d)\p{Emoji}/ug; // negative lookahead to exclude numeric digits
    //const emojiChars = emojiRegex.exec(inputString)?.length ?? 0;
    const emojiChars = inputString.match(emojiRegex)?.length ?? 0;
    //if (emojiChars !== 0) { log(ns, `${inputString} has ${emojiChars} char`) }
    return emojiChars;
}

