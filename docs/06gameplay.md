# 06: Basic Dashboard

I want to to select a target server to attack.

## Show Me The Money

At the start of the game at hacking skill level 1 the `scanAnalyze()` function shows that I can only hack _n00dles_ or _foodnstuff_. 

I need more information to evaluate these hack targets, indluding the `maxMoney` and `moneyAvilable` properties. 

I created a `showDashboard()` function to display a dashboard of network servers with customizable columns. The columns use predefined formats for consistency and padding alignment, for example money fields should be formatted to two decimal places and have a '$' prefix.

```
[home /]> run /util/dashboard.js
hostname               RAM hack👨‍💻  $ avail    $ max      👮  min 👮 grow 
n00dles                4GB    1👨‍💻  $69.71k   $1.75m    1.00    1.00   3k 
foodnstuff            16GB    1👨‍💻   $2.00m  $50.00m   10.00    3.00    5 
sigma-cosmetics       16GB    5👨‍💻   $2.30m  $57.50m   10.00    3.00   10 
joesguns              16GB   10👨‍💻   $2.50m  $62.50m   15.00    5.00   20 
hong-fang-tea         16GB   30👨‍💻   $3.00m  $75.00m   15.00    5.00   20 
harakiri-sushi        16GB   40👨‍💻   $4.00m $100.00m   15.00    5.00   40 
nectar-net            16GB   20👨‍💻   $2.75m  $68.75m   20.00    7.00   25
```

I can see _foodnstuff_ has $2.00m available. The next step is to estimate the success of hack, grow and weaken commands so I can choose the best action and target server. 

## About The Code

I want a dashboard to display a list of servers and server properties. I want to ensure the columns have consistent formatting for example money fields should be formatted to two decimal places and have a '$' prefix. 

The `PrintFormat` type is based on the parameters to the `ns.numberFormat()` method with additional padding property for column alignment.

I can then define common formats for money, percentages and decimals.

``` typescript
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
```

I created a list of column names, server properties and print formats for the scan-analyze data:

``` typescript
type Column = {heading: string, property: keyof NetworkServer, format: PrintFormat };

const scanAnalyzeColumns: Column[] = [
    {heading: "network", property: "hostname", format: {padding: -16, isInteger: false}},
    {heading: icon.key, property: "hasAdminRights", format: format.boolean},
    {heading: "RAM", property: "maxRam", format: format.ram},
    {heading: "hack" + icon.techno, property: "requiredHackingSkill", format: {padding: 6, fractionalDigits: 0, isInteger: true, suffix: icon.techno}}, 
    {heading: "ports", property: "numOpenPortsRequired", format: {padding: -10}},   
];
```

The `showDashboard()` function uses the columns in a two step process:
1. iterate the columns and print the column headings, then 
2. iterate over the servers and print the data in the desired format.

### Column Headings

Step 1 iterates over the columns array and prints the headings, adjusting the padding for each column heading. 


``` typescript
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
```

### Row Data

Step 2 iterates over each server and creates an array of formatted data. 

The `ns.formatNumber` method is called to format numbers with the 'k', 'm' suffix for thousands and millions.

The `ns.formatRam` method is called to format memory in GB.


Additional code was added to support the `scanAnalyze()` formatting of `hostname` with indented branches.

``` typescript
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
```

### Scan Analyze

The `scanAnalye()` function was refactored to reuse the `showDashboard()` function and moved to a separate `scanAnalyze.ts` file in order to avoid circular dependency and a runtime error 'Maximum call stack size exceeded'.

The scananalyze.js outputs the network similar to before, but now has consistent formatting with the dashboard output.

```
[home /]> run /util/scanAnalyze.js 3
network                  🔑   RAM    hack👨‍💻 ports      
home                     ✔️   8GB       1👨‍💻 🔒🔒🔒🔒🔒 
 ├ n00dles               ✔️   4GB       1👨‍💻            
 │ ├ zer0                ❌  32GB      75👨‍💻 🔒      
 │ │ ├ silver-helix      ❌  64GB     150👨‍💻 🔒🔒 
 │ ├ nectar-net          ✔️  16GB      20👨‍💻            
 │ │ ├ phantasy          ❌  32GB     100👨‍💻 🔒🔒 
 ├ foodnstuff            ✔️  16GB       1👨‍💻            
 ├ sigma-cosmetics       ✔️  16GB       5👨‍💻            
 │ ├ CSEC                ❌   8GB      51👨‍💻 🔒      
 │ │ ├ neo-net           ❌  32GB      50👨‍💻 🔒      
 │ │ ├ omega-net         ❌  32GB     181👨‍💻 🔒🔒 
 ├ joesguns              ✔️  16GB      10👨‍💻            
 ├ hong-fang-tea         ✔️  16GB      30👨‍💻            
 │ ├ max-hardware        ❌  32GB      80👨‍💻 🔒      
 ├ harakiri-sushi        ✔️  16GB      40👨‍💻            
 ├ iron-gym              ❌  32GB     100👨‍💻 🔒 
```