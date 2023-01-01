# Hacking algorithms

Summarized from https://bitburner.readthedocs.io/en/latest/advancedgameplay/hackingalgorithms.html

## Self-contained algorithms

A script with infinite loop to weaken, grow and hack a server.

Great at small initial setup but not efficient as parallel hacks may take server above or below the minimum money or security thresholds, wasting thread cycles. Script contains functions that cannot work concurrently.

A self-contained script needs to call weaken, grow and hack functions that make the script require more RAM.

## Loop algorithms

Split weaken, grow, hack into three separate scripts, with each script optimized with minimum functions it needs, and scripts do not have functions that cannot work concurrently, mimimizing RAM.

For example 1 thread to hack, 10 threads to grow, 2 threads to weaken.

Requires a script to handle deployment and management and the ratio is different for each server and changes with hacking level.

## Hacking managers (proto-batchers)

## Batch algorithms (HGW, HWGW or Cycles)

Maximum potential income but very difficult on a server with less than 1 TB RAM.

Uses a master script that calls `execute` on many scripts.

The effects of hack and grow depend on the server security level, a higher security level results in a reduced effect. You only want these effects to occur when the security level is minimized.
The time taken to execute hack, grow, or weaken is determined when the function is called and is based on the security level of the target server and your hacking level. You only want these effects to start when the security level is minimized.
The effects of hack, grow, and weaken, are determined when the time is completed, rather than at the beginning. Hack should finish when security is minimum and money is maximum. Grow should finish when security is minimum, shortly after a hack occurred. Weaken should occur when security is not at a minimum due to a hack or grow increasing i

A single batch consists of four actions:

A hack script removes a predefined, precalculated amount of money from the target server.
A weaken script counters the security increase of the hack script.
A grow script counters the money decrease caused by the hack script.
A weaken script counters the security increase caused by the grow script.

It is also important that these 4 scripts finish in the order specified above, and all of their effects be precalculated to optimize the ratios between them. This is the reason for the delay in the scripts.

Depending on your computer’s performance as well as a few other factors, the necessary delay between script execution times may range between 20ms and 200ms, you want to fine-tune this value to be as low as possible while also avoiding your scripts finishing out of order. Anything lower than 20ms will not work due to javascript limitations.

I