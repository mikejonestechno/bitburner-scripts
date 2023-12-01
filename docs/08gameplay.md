# 08: Analyze, Really Analyze

I want to to select a target server to attack.

###  Contents

- [Attack](#attack)
- [Weaken Experiments](#weaken-experiments)
- [Hack Experiments](#hack-experiments)
- [Grow Experiments](#grow-experiments)
- [Available Ram](#available-ram)
- [Starting Strategy](#starting-strategy)
- [Conclusion](#conclusion)
- [Hack, Grow, Weaken Security](#hack-grow-weaken-security)
- [About The Code](#about-the-code)


# Attack 

I created an attack script that would execute attacks on all available servers with all available RAM.

The script takes an action parameter "h, "g" or "w" and automatically selects the target server based on the analyze stats.

To weaken _foodnstuff_:

```
run malware/attack.js w foodnstuff
```

To grow _foodnstuff_:

```
run malware/attack.js g foodnstuff
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

Effect of three iterations of weaken attacks:

```
[home /]> run util/dashboard
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

## Hack Experiments

> [TEST 03](08gameplay03test.md): Test the effect of hacking servers without weaken or growing first.

Effect of three iterations of hack attacks (targeting whichever server has the highest hack rate):

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    31s  97.23%    $9.16  $229.08   1.00👮   1.00👮    98s  $557.95   123s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $1.43m  $50.00m   2.85%    32s  88.22%  $146.87   $5.15k  10.18👮   3.00👮   103s   $19.60   128s ✔️ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $1.96m  $57.50m   3.41%    38s  81.88%  $137.94   $4.04k  10.10👮   3.00👮   122s   $39.92   153s ❌ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    53s  69.82%   $83.28   $2.08k  15.00👮   5.00👮   171s   $43.63   213s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%    91s  51.43%   $20.94  $523.48  20.00👮   7.00👮   293s   $26.25   366s ❌ ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%    99s  39.46%    $3.97   $99.18  15.00👮   5.00👮   317s   $28.19   396s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   122s  24.29%    $0.00    $0.00  15.00👮   5.00👮   390s   $61.08   488s ❌ ❌ ✔️ 
```

[Test results](08gameplay03test.md) show that hacking servers at the start of the game quickly reaches hacking level 30+ and $800+k in around two minutes, enough to puchase the BruteSSH.exe and crack additional servers for additional RAM. However the hack rates significantly drop due to the low money available and increased security.

## Grow Experiments

> [TEST 04](08gameplay04test.md): Test the effect of growing a server before hacking it.

Effect of three iterations of grow attacks (hack skill level 33):

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    30s  97.29%    $9.28  $232.00   1.00👮   1.00👮    97s  $564.75   121s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $2.05m  $50.00m   4.09%    32s  87.83%  $210.97   $5.16k  10.62👮   3.00👮   102s   $20.84   127s ✔️ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $2.30m  $57.50m   4.00%    38s  82.21%  $165.49   $4.14k  10.00👮   3.00👮   120s   $42.64   151s ❌ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    53s  70.28%   $85.86   $2.15k  15.00👮   5.00👮   169s   $44.16   211s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%    90s  52.29%   $22.51  $562.65  20.00👮   7.00👮   289s   $26.57   361s ❌ ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%    98s  40.84%    $5.37  $134.34  15.00👮   5.00👮   313s   $28.53   392s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   120s  26.13%    $0.00    $0.00  15.00👮   5.00👮   386s   $61.82   482s ❌ ❌ ✔️ 
```

[Test results](08gameplay04test.md) show that growing servers at the start of the game have minimal effect as the percentage increase in available money is small. However grow will soon be required to counteract the significant drop in hack rates if servers are constantly hacked at the start of the game.

## Available RAM 

Available RAM is a critical resource particularly for growing servers to max money for significantly better hack rates.

At the start of the game I only have access to 6 servers with 16 GB RAM, a total 108 GB RAM (including the _home_ server).

### Home Server RAM

I could puchase additional RAM for my 'home'server. The first upgrade from 8 GB to 16 GB cost $1.01m.

Home server RAM is $1.01m / 8 GB = $126.25k per GB.

### Additional Servers

I could purchase additional servers @ $110k per 2 GB.

Additional server RAM is $110k / 2 GB = $55.00k per GB.

### Cracked Network Servers

I could purchase Tor router and BruteSSH.exe that costs $700k. This allows port cracking and gaining root access to some 32 GB and 64 GB servers, a total 
136 GB of additional server RAM (doubling the 108 GB RAM available at the start of the game).

First crack network server RAM $700k / 136 GB = $5.147k per GB.

Later purchasing of FTPCrack.exe will cost $1.5m. This allows port cracking to gain root access to another 264 GB of server RAM.

Second crack network server RAM $1.5m / 264 GB = $5.681k per GB.

The cheapest way to get additional RAM to improve hack, grow weaken threads is to crack network servers.

[Test results](08gameplay03test.md) show that hacking servers at the start of the game quickly reaches hacking level 30+ and $800+k in around two minutes, enough to puchase the BruteSSH.exe and crack additional servers.

## Starting Strategy

My hypothesis is that I should gain additional RAM as fast as possible, the additional threads will allow me to quickly regrow and weaken servers to maintain more effective hack rates. 

> [TEST 05](08gameplay05test.md): Validate the additional RAM will enable me to quickly recover the stolen money.

After three hack iterations (hack skill level 31, $800k) _foodnstuff_ was reduced by $800k to $1.20m. At this hack skill and security level each grow thread can grow at $18.38/s. 

```
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
foodnstuff          16GB       1👨‍💻   $1.20m  $50.00m   2.40%    32s  88.08%  $121.88   $5.07k  10.27👮   3.00👮   104s   $18.38   130s ❌ ✔️ ❌ 
```

With a total 244 GB available RAM (108 GB + 136 GB cracked servers) I can run 244 GB / 1.75 GB per grow.js thread = maximum 139.43 threads.

Grow 139 threads x $18.38/s = $2.555k/s 

To grow $800k = $800k / $2.555 = 313 seconds = approx 5.2 minutes.

## Conclusion

The greatest challenge to designing a hack, grow weaken strategy is that the basic analyze functions available at start of the game assume static player and server stats. For example, they dont take increased hacking experience into account, and that makes a significant difference at the start.

Although _foodnstuff_ has highest hack rates at the start it also has the lowest grow factor and lowest max money (excluding n00dles) that I expect other servers will quickly become more profitable taking grow and weaken into consideration.

My start strategy will be to optimze RAM and maximize hack speed towards $700k, but change strategy and devise a function to evaluate grow and weaken targets from $701k.

## 👮 Hack, Grow, Weaken Security

Weaken attacks take four times longer than hacks.

Grow attacks take three times longer than hacks.

The fastest way to earn hacking experience is by hacking.

> each successful hack increases security by 0.002.
>
> each successful grow increases security by 0.004.
>
> each successful weaken lowers security by 0.05.

It takes 500 hacks to increase security by 1.

It takes 250 grows to increase security by 1.

It takes 20 weakens to reduce security by 1.
