/** @param {NS} ns **/
import { log, color, icon } from "log.js";
import { readMapData } from "network.js";
/* RAM 1.60 GB (this script just renders dashboard and relies on other scripts to refresh server stats eg in /data/target.txt file)

Sample output shows $ per sec based on hack chance, % stolen per hack, $ stolen per hack and the hack time in seconds.

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max       %
sigma-cosmetics       $197.98  85.17%   0.35%   $7.00k   30.1   $2.02m  $57.50m   3.51%
foodnstuff            $156.88  88.78%   0.37%   $4.47k   25.3   $1.19m  $50.00m   2.39%
joesguns              $133.31  76.01%   0.30%   $7.38k   42.1   $2.50m  $62.50m   4.00%
nectar-net             $51.96  63.07%   0.22%   $5.94k   72.1   $2.75m  $68.75m   4.00%
hong-fang-tea          $36.53  58.02%   0.16%   $4.92k   78.1   $3.00m  $75.00m   4.00%
harakiri-sushi         $20.06  49.02%   0.10%   $3.94k   96.2   $4.00m $100.00m   4.00%
n00dles                $11.71  97.95%   0.41%  $288.75   24.2  $70.00k   $1.75m   4.00%

*/

export async function main(ns, dataFilePath) {
    dataFilePath = ns.args[0];
    showDashboard(ns, dataFilePath);
}

export async function showDashboard(ns, dataFilePath) {

    ns.disableLog('ALL');
    ns.resizeTail(1240, 250);
    ns.clearLog();
    ns.tail();


    log(ns, `show dashboard for ${dataFilePath}`); // if errors check path has leading "/" if in a subdir
    const networkMap = readMapData(ns, dataFilePath);

    ns.resizeTail(1240, 250);

    const format = {
        money: ["$0.00a", 8],
        percent: ["0.00%", 7],
        decimal: ["0.00", 7],
        seconds: ["0.0", 6],
    }

    const data = [];
    networkMap.forEach((server, hostname) => {
        data[server.hostname] =[
            ["hostname", server.hostname],
            ["$/sec", server.hackMoneyPerSecond, format["money"]],
            ["chance", server.hackChance, format["percent"]],
            ["%/hack", server.hackMoneyPercent, format["percent"]],
            ["$/hack", server.hackMoney, format["money"]],
            ["h sec", server.hackTime/1000, format["seconds"]],
            ["$ avail", server.moneyAvailable, format["money"]],
            ["$ max", server.moneyMax, format["money"]],
            ["%", server.moneyAvailable/server.moneyMax, format["percent"]],
        ];
    });

    // print headings using padding formats from row 0
    const row = Object.values(data)[0];
    const headings = [];
    headings[0] = row[0][0].padEnd(20);
    for(let i = 1; i < row.length; i++) { 
        headings[i] = row[i][0].padStart(row[i][2][1]);
    }
    ns.printf(`${color.yellow}%s`, headings.join(" "));

    for(const row of Object.values(data)) {
        const fields = [];
        // custom format for first field
        fields[0] = row[0][1].padEnd(20);
        // apply format to remaining fields
        for(let i = 1; i < row.length; i++) { 
            if (row[i][1] === NaN) {
                fields[i] = (row[i][1]).padStart(row[i][2][1]);
            } else {
                fields[i] = ns.nFormat(row[i][1], row[i][2][0]).padStart(row[i][2][1]);
            }
        }
        // print first field and remaining fields
        ns.printf(`${color.cyan}%s${color.white} %s`, fields[0], fields.slice(1).join(" "));
    }

}

