# 08: Analyze, Really Analyze

I want to to select a target server to attack.

// Add TL/DR; links to section headers here

# Attack 

I created an attack script that would execute attacks on all available servers with all available RAM.

The script takes an action parameter "h, "g" or "w" and automatically selects the target server based on the analyze stats.

To weaken _foodnstuff_:

```
run malware/attack.js w foodnstuff
```

To hack the server that has the highest hack rate money per second

```
run malware/attack.js h
```

The attack script is minimized to reduce RAM cost so after each iteration of the attack, I need to run the network.js and analyze.js scripts to refresh the server stats.

Now I need to analyze the stats and repeat experiments to determine the target server and best strategy to take at the start of the game.

# Weaken Experiments

At the start of the game _foodnstuff_ has the highest hack $ per second and also the highest max money per second, so appears the best target to hack.

The official bitburner help and tutorials recommend weakening servers and then growing them _before_ hacking.

The _foodnstuff_ server starts at security level 10.00 with minimum security level 3.00.

How much difference does weaken make, how much weaken is 'good enough' for me to level up and unlock more RAM?

> [TEST 01](08gameplay01test.md): Test the effect of weakening a server before hacking it.

```
Effect of three iterations of weaken attacks
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    51s  38.57%   $56.20   $1.41k  10.00👮   3.00👮   165s   $13.56   206s ✔️ ✔️ ❌ hack skill 1
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    39s  89.49%  $176.35   $4.41k   7.20👮   3.00👮   126s   $20.74   157s ✔️ ✔️ ❌ hack skill 16
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    33s  93.67%  $225.25   $5.63k   4.30👮   3.00👮   106s   $24.55   133s ✔️ ✔️ ❌ hack skill 27
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    30s  95.42%  $258.36   $6.46k   3.00👮   3.00👮    96s   $27.27   119s ✔️ ✔️ ❌ hack skill 35
```

[Test results](08gameplay01test.md) show that weaken provides hacking skill experience, and that improves stats for ALL servers.

So how much benefit is gained by weakening a server vs just increasing hacking skill level.

> [TEST 02](08gameplay02test.md): Validate the effect of weakening a server before hacking it.

After weakening _harakiri-sushi_ for three iterations (hacking skill level 40):

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    28s  97.59%   $10.09  $252.34   1.00👮   1.00👮    89s  $612.38   112s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    29s  88.71%  $228.12   $5.70k  10.00👮   3.00👮    93s   $23.93   117s ✔️ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $2.30m  $57.50m   4.00%    35s  83.57%  $186.83   $4.67k  10.00👮   3.00👮   111s   $46.23   139s ❌ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    49s  72.86%  $102.85   $2.57k  15.00👮   5.00👮   156s   $47.88   194s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%    83s  57.14%   $33.00  $825.00  20.00👮   7.00👮   267s   $28.81   333s ❌ ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%    90s  48.57%   $15.72  $393.01  15.00👮   5.00👮   289s   $30.94   361s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%    63s  40.11%    $2.47   $61.75   6.40👮   5.00👮   203s  $205.66   253s ❌ ❌ ✔️
```

[Test results](08gameplay02test.md) show that at the start of the game, the hacking skill level has the greatest impact to h/g/w stats, particulary for low level servers. Increasing hacking skill level can quadruple the hack rate and double the grow rate.

Weakening the server did have a 10%+ buff affect to _foodnstuff_. Given the weaken takes significant time, rapid increase of hacking skill level will rapidly improve stats at the start of the game.



---

## Hack Experiments

Weaken attacks take four times longer than hacks.
Grow attacks take three times longer than hacks.
The fastest way to earn hacking experience is by hacking.

... define next test here ...

The _harakiri-sushi_ server has the fastest growth per second, so appears the best target to grow so I can gain more money much faster.

> TEST: If I continuously hack to gain hack XP, how quickly can I gain hacking experience level 40 and unlock _harakiri-sushi_? 


// sumarize the dashboards and generate hypothesis for experiments...


// which to grow first?
// hack time is increased by security level, and decreased by hacking skill.
// so improve hack $/s by increase hack skill or decrease security
// foodnstuff has higher $/s than noodles, but noodles has max $/s higher than current foodnstuff and can grow noodles really fast
// so should I grow noodles or should I grow foodnstuff?

## 👮 Hack, Grow, Weaken Security

> each successful hack increases security by 0.002.
>
> each successful grow increases security by 0.004.
>
> each successful weaken lowers security by 0.05.

It takes 500 successful hacks to increase security by 1.

It takes 250 successful grows to increase security by 1.

It takes 20 successful weakens to reduce security by 1.

> What is the actual impact of the increased security? Official docs say that security and hacking skill affect the hack chance. ... i think previously i read that it also affected time to hack, grow, weaken? 
>
> TEST: Weaken foodnstuff from 10 to 3. What do I observe in the other stats? This will help answer the question is it really worth weakening first?

## About The Code

// summarize the attack.ts scripts and the progress to date 
// what does run start.js do?
// explain the file structure so far.