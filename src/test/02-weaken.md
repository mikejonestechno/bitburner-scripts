# 01 - Weaken Experiment

## Objective

Validate the effect of weakening a server before hacking it.

## Try

Perform a soft reset so that _foodnstuff_ is back to initial security level 10.

Run three weaken iterations against _harakiri-sushi_ server.

Observe the effect on hack/grow/weaken statistics on _foodnstuff_ and compare with previous results.

## Expect

I expect that the h/g/w stats for _foodnstuff_ to be reasonably similar to previous results, validating hypothesis that the improved stats are primarily due to the increased hacking skill, and weakening the server has minimal effect at low levels.

## Actual

### Increasing Hacking Skill

Comparing the results of increasing hacking skill from level 1 to 35 or 40 (without weakening the server):

The _foodnstuff_ hack chance increased from 38.57% at level 1 to 88.71% at level 40. The hack rate quadrupled from $56.20/s to $228.12/s and the grow rate doubled from $13.56/s to $23.93/s.

The _harakiri-sushi_ hack chance increased from 0.00% at level 1 to 29.49% at level 35. The grow rate almost doubled from $37.99/s to $63.31/s.

### Weakening Security

In **addition** to the increased hacking skill, weakening security did result in improved stats compared to the non-weakened server:

The _foodnstuff_ hack chance increased by 10% from 88.71% to 95.42% and the hack rate increased approx 13% from $228.12/s to $258.36/s when security weakened from 10.00 to 3.00. The grow rate slightly increased from $23.93 to $27.27.

The _harakiri-sushi_ hack chance increased by 50% from 29.49% to 40.11% when security weakened from 15.00 to 6.40. The grow rate tripled from $63.31/s to $205.66.

The experiment took 784 + 499 + 353 seconds = 1,636 seconds (27.27 minutes).

## Learn

The experiment validated the hypothesis that at the start of the game, the hacking skill level has the greatest impact to h/g/w stats, particulary for low level servers. Increasing hacking skill level can quadrupal the hack rate and double the grow rate. 

Weakening the server did have a 10%+ buff affect to _foodnstuff_ but not worth the thread time at the start of the game. 

When _harakiri-sushi_ is weakened to minimum security at hacking skill level 40, each hack thread can only steal 0.01% of available money, and it has a hack chance of 40.11% resulting in an extremely low hack rate of $2.47/s.

A higher hacking skill with increased hack chance could lead to higher max money rate and make _harakiri-sushi_ worth growing (it has the fastest growth rate) but at the start of the game at hacking skill level 40 even at minimum security, the max hack rate of $386.03/s is far below the $5.96k/s max hack rate available on _foodnstuff_. 

To rapidly improve stats at the start of the game, focus on rapid increase of hacking skill level, and the fastest time to run a h/g/w thread.

## Result Summary

BEFORE weakening _harakiri-sushi_ (hacking skill level 1):

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

Weaken Iterations show the security level decrease from 15.00:

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   196s   0.00%    $0.00    $0.00  15.00👮   5.00👮   627s   $37.99   784s ❌ ❌ ✔️ hack skill 1
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   125s   0.00%    $0.00    $0.00  12.20👮   5.00👮   399s   $73.46   499s ❌ ❌ ✔️ hack skill 19
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%    88s  23.82%    $0.00    $0.00   9.30👮   5.00👮   282s  $136.02   353s ❌ ❌ ✔️ hack skill 31
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%    63s  40.11%    $2.47   $61.75   6.40👮   5.00👮   203s  $205.66   253s ❌ ❌ ✔️ hack skill 40
```

AFTER weakening _harakiri-sushi_ for three iterations (hacking skill level 40):

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

BEFORE weakening servers (hacking skill level 1):

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  42.43%   0.41%  $70.00k  $288.75    49s    $2.49   $1.75m   $7.22k   $62.17 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  38.57%   0.38%   $2.00m   $7.50k    51s   $56.20  $50.00m $187.50k   $1.41k ✔️ ✔️
```

After weakening _harakiri-sushi_ (hacking skill level 40):

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  97.59%   0.41%  $70.00k  $288.75    28s   $10.09   $1.75m   $7.22k  $252.34 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  88.71%   0.38%   $2.00m   $7.50k    29s  $228.12  $50.00m $187.50k   $5.70k ✔️ ✔️ 
sigma-cosmetics     16GB       5👨‍💻  83.57%   0.34%   $2.30m   $7.76k    35s  $186.83  $57.50m $194.06k   $4.67k ❌ ❌ 
joesguns            16GB      10👨‍💻  72.86%   0.27%   $2.50m   $6.86k    49s  $102.85  $62.50m $171.55k   $2.57k ❌ ❌ 
nectar-net          16GB      20👨‍💻  57.14%   0.18%   $2.75m   $4.81k    83s   $33.00  $68.75m $120.31k  $825.00 ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻  48.57%   0.10%   $3.00m   $2.92k    90s   $15.72  $75.00m  $73.05k  $393.01 ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻  40.11%   0.01%   $4.00m  $390.00    63s    $2.47 $100.00m   $9.75k   $61.75 ❌ ❌ 
```

BEFORE weakening servers (hacking skill level 1):

```
[home /]> run util/dashboard --show grow
hostname               RAM grow  $ avail    $ max     diff  factor threads   $/grow   time    g $/s       👮   min 👮 weak s threads 📈 
n00dles                4GB   3k  $70.00k   $1.75m   $1.68m   25.00   30.71  $54.71k   158s  $347.02   1.00👮   1.00👮   197s    0.00 ❌ 
foodnstuff            16GB    5   $2.00m  $50.00m  $48.00m   25.00  21.49k   $2.23k   165s   $13.56  10.00👮   3.00👮   206s  140.00 ❌ 
sigma-cosmetics       16GB   10   $2.30m  $57.50m  $55.20m   25.00  10.75k   $5.14k   196s   $26.20  10.00👮   3.00👮   245s  140.00 ❌ 
joesguns              16GB   20   $2.50m  $62.50m  $60.00m   25.00   8.06k   $7.45k   275s   $27.13  15.00👮   5.00👮   343s  200.00 ❌ 
nectar-net            16GB   25   $2.75m  $68.75m  $66.00m   25.00   8.59k   $7.68k   471s   $16.33  20.00👮   7.00👮   588s  260.00 ❌ 
hong-fang-tea         16GB   20   $3.00m  $75.00m  $72.00m   25.00   8.06k   $8.94k   510s   $17.53  15.00👮   5.00👮   637s  200.00 ❌ 
harakiri-sushi        16GB   40   $4.00m $100.00m  $96.00m   25.00   4.03k  $23.84k   627s   $37.99  15.00👮   5.00👮   784s  200.00 ✔️
```

After weakening _harakiri-sushi_ (hacking skill level 40):

```
[home /]> run util/dashboard --show grow
hostname               RAM grow  $ avail    $ max     diff  factor threads   $/grow   time    g $/s       👮   min 👮 weak s threads 📈 
n00dles                4GB   3k  $70.00k   $1.75m   $1.68m   25.00   30.71  $54.71k    89s  $612.38   1.00👮   1.00👮   112s    0.00 ❌ 
foodnstuff            16GB    5   $2.00m  $50.00m  $48.00m   25.00  21.49k   $2.23k    93s   $23.93  10.00👮   3.00👮   117s  140.00 ❌ 
sigma-cosmetics       16GB   10   $2.30m  $57.50m  $55.20m   25.00  10.75k   $5.14k   111s   $46.23  10.00👮   3.00👮   139s  140.00 ❌ 
joesguns              16GB   20   $2.50m  $62.50m  $60.00m   25.00   8.06k   $7.45k   156s   $47.88  15.00👮   5.00👮   194s  200.00 ❌ 
nectar-net            16GB   25   $2.75m  $68.75m  $66.00m   25.00   8.59k   $7.68k   267s   $28.81  20.00👮   7.00👮   333s  260.00 ❌ 
hong-fang-tea         16GB   20   $3.00m  $75.00m  $72.00m   25.00   8.06k   $8.94k   289s   $30.94  15.00👮   5.00👮   361s  200.00 ❌ 
harakiri-sushi        16GB   40   $4.00m $100.00m  $96.00m   25.00   2.30k  $41.68k   203s  $205.66   6.40👮   5.00👮   253s   28.00 ✔️
```

Final results after weakening _harakiri-sushi_ to minimum security (hacking level 44)

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    27s  97.71%   $10.56  $263.90   1.00👮   1.00👮    86s  $639.60   107s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    28s  88.83%  $238.58   $5.96k  10.00👮   3.00👮    89s   $24.99   112s ✔️ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $2.30m  $57.50m   4.00%    33s  84.16%  $198.49   $4.96k  10.00👮   3.00👮   106s   $48.29   133s ❌ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    47s  73.96%  $111.92   $2.80k  15.00👮   5.00👮   149s   $50.01   186s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%    80s  59.22%   $38.66  $966.45  20.00👮   7.00👮   255s   $30.09   319s ❌ ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%    86s  51.88%   $21.74  $543.55  15.00👮   5.00👮   277s   $32.32   346s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%    53s  45.65%   $15.44  $386.03   5.00👮   5.00👮   170s  $244.87   213s ❌ ❌ ✔️

[home /]> run util/dashboard --show grow
hostname               RAM grow  $ avail    $ max     diff  factor threads   $/grow   time    g $/s       👮   min 👮 weak s threads 📈 
n00dles                4GB   3k  $70.00k   $1.75m   $1.68m   25.00   30.71  $54.71k    86s  $639.60   1.00👮   1.00👮   107s    0.00 ❌ 
foodnstuff            16GB    5   $2.00m  $50.00m  $48.00m   25.00  21.49k   $2.23k    89s   $24.99  10.00👮   3.00👮   112s  140.00 ❌ 
sigma-cosmetics       16GB   10   $2.30m  $57.50m  $55.20m   25.00  10.75k   $5.14k   106s   $48.29  10.00👮   3.00👮   133s  140.00 ❌ 
joesguns              16GB   20   $2.50m  $62.50m  $60.00m   25.00   8.06k   $7.45k   149s   $50.01  15.00👮   5.00👮   186s  200.00 ❌ 
nectar-net            16GB   25   $2.75m  $68.75m  $66.00m   25.00   8.59k   $7.68k   255s   $30.09  20.00👮   7.00👮   319s  260.00 ❌ 
hong-fang-tea         16GB   20   $3.00m  $75.00m  $72.00m   25.00   8.06k   $8.94k   277s   $32.32  15.00👮   5.00👮   346s  200.00 ❌ 
harakiri-sushi        16GB   40   $4.00m $100.00m  $96.00m   25.00   2.30k  $41.68k   170s  $244.87   5.00👮   5.00👮   213s    0.00 ✔️
```