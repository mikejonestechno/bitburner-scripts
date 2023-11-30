# 03 - Grow Experiment

## Objective

Test the effect of growing servers before hacking.

## Try

The _harakiri-sushi_ server has the fastest growth per second, so appears the best target to grow so I can gain more money much faster. However the security and hacking rate are so significant that I cant take advantage of any additional growth in at the start of the game. Explore the effects of growing the _foodnstuff_ server.

Perform a soft reset so that all servers are back to initial values.

Grow the _foodnstuff_ server for maximum 500 seconds (approx 8.25 minutes).

Observe the effect on hack/grow/weaken statistics on the server and compare with previous results.

## Expect

I expect that that growing servers will initially be very minimal impact because it is percentage based; it will take many grows before the grow effect becomes signifant.

## Actual

The server grew from $2.00m to $2.08m which had marginal affect on hack rate $/s, the hack skill level has much greater effect at the start of the game.

Unexpectedly, the number of grow threads required to reach max money are increasing. I expected fewer grow threads as there is less money to grow. 

## Learn

I learnt that the 10% increase in security from 10.00 to 11.00 resulted in the increase in number of grow threads required from 21.49k to 23.45k. 

Growing threads have diminishing return at the start of the game as the increased security outweighs the increased hacking experience and increased the number of required grow threads above the original value.

## Result Summary

BEFORE hacking (hacking skill level 1):

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    49s  42.43%    $2.49   $62.17   1.00👮   1.00👮   158s  $347.02   197s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    51s  38.57%   $56.20   $1.41k  10.00👮   3.00👮   165s   $13.56   206s ✔️ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $2.30m  $57.50m   4.00%    61s   0.00%    $0.00    $0.00  10.00👮   3.00👮   196s   $26.20   245s ❌ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    86s   0.00%    $0.00    $0.00  15.00👮   5.00👮   275s   $27.13   343s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%   147s   0.00%    $0.00    $0.00  20.00👮   7.00👮   471s   $16.33   588s ❌ ❌ ❌
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%   159s   0.00%    $0.00    $0.00  15.00👮   5.00👮   510s   $17.53   637s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   196s   0.00%    $0.00    $0.00  15.00👮   5.00👮   627s   $37.99   784s ❌ ❌ ✔️ 
```

Grow iterations

```
[home /]> run util/dashboard --show grow
hostname               RAM grow  $ avail    $ max     diff  factor threads   $/grow   time    g $/s       👮   min 👮 weak s threads 📈 
foodnstuff            16GB    5   $2.00m  $50.00m  $48.00m   25.00  21.49k   $2.23k   165s   $13.56  10.00👮   3.00👮   206s  140.00 ❌ hack level 1
foodnstuff            16GB    5   $2.02m  $50.00m  $47.98m   24.81  21.88k   $2.19k   129s   $16.95  10.21👮   3.00👮   162s  144.16 ❌ hack level 15
foodnstuff            16GB    5   $2.03m  $50.00m  $47.97m   24.62  22.28k   $2.15k   112s   $19.19  10.42👮   3.00👮   140s  148.32 ❌ hack level 25
foodnstuff            16GB    5   $2.05m  $50.00m  $47.95m   24.44  22.67k   $2.12k   102s   $20.84  10.62👮   3.00👮   127s  152.48 ❌ hack level 33
foodnstuff            16GB    5   $2.06m  $50.00m  $47.94m   24.26  23.06k   $2.08k    95s   $21.94  10.83👮   3.00👮   118s  156.64 ❌ hack level 39
foodnstuff            16GB    5   $2.08m  $50.00m  $47.92m   24.09  23.45k   $2.04k    90s   $22.76  11.04👮   3.00👮   112s  160.80 ❌ hack level 44
```

AFTER 3 grow iterations (hack level 33)

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

AFTER 5 grow iterations (hack level 44)

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    27s  97.71%   $10.56  $263.90   1.00👮   1.00👮    86s  $639.60   107s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $2.08m  $50.00m   4.15%    28s  87.80%  $240.74   $5.80k  11.04👮   3.00👮    90s   $22.76   112s ✔️ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $2.30m  $57.50m   4.00%    33s  84.16%  $198.49   $4.96k  10.00👮   3.00👮   106s   $48.29   133s ❌ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    47s  73.96%  $111.92   $2.80k  15.00👮   5.00👮   149s   $50.01   186s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%    80s  59.22%   $38.66  $966.45  20.00👮   7.00👮   255s   $30.09   319s ❌ ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%    86s  51.88%   $21.74  $543.55  15.00👮   5.00👮   277s   $32.32   346s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   106s  40.84%    $6.18  $154.52  15.00👮   5.00👮   340s   $70.02   426s ❌ ❌ ✔️ 
```
