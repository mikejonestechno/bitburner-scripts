# 01 - Weaken Experiment

## Objective

Test the effect of weakening a server before hacking it.

## Try

Run as many weaken threads as possible against _foodnstuff_ server to weaken it from security level 10.00 to minimum security level 3.00. 

Observe the effect on hack/grow/weaken statistics.

## Expect

Given the security level is already low, weakening the server to minimum security will have minimal affect on statistics.

## Actual

The weaken did make significant difference to the hack and grow stats. The _foodnstuff_ hack chance increased from 38.57% to 95.42% and the hack rate increased from $56.20 / second to $258.36 / second.

The experiment took three iterations; 206 + 157 + 133 seconds = 496 seconds (8.27 minutes).

## Learn

I learnt that weaken does provide hacking skill. I believe the increased hacking skill is the primary reason for improved h/g/w stats because there were significant improvement for h/g/w stats for ALL servers, not just _foodnstuff_ the server being weakened.

## Result Summary

BEFORE weakening _foodnstuff_ (hacking skill level 1):

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

Weaken Iterations show the security level decrease from 10.00 to 3.00:

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    51s  38.57%   $56.20   $1.41k  10.00👮   3.00👮   165s   $13.56   206s ✔️ ✔️ ❌ hack skill 1
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    39s  89.49%  $176.35   $4.41k   7.20👮   3.00👮   126s   $20.74   157s ✔️ ✔️ ❌ hack skill 16
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    33s  93.67%  $225.25   $5.63k   4.30👮   3.00👮   106s   $24.55   133s ✔️ ✔️ ❌ hack skill 27
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    30s  95.42%  $258.36   $6.46k   3.00👮   3.00👮    96s   $27.27   119s ✔️ ✔️ ❌ hack skill 35
```

AFTER weakening _foodnstuff_ (hacking skill level 35):

```
[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    30s  97.38%    $9.51  $237.83   1.00👮   1.00👮    95s  $578.36   118s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $2.00m  $50.00m   4.00%    30s  95.42%  $258.36   $6.46k   3.00👮   3.00👮    96s   $27.27   119s ✔️ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $2.30m  $57.50m   4.00%    37s  82.65%  $171.74   $4.29k  10.00👮   3.00👮   118s   $43.66   147s ❌ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    51s  71.12%   $90.89   $2.27k  15.00👮   5.00👮   165s   $45.22   206s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%    88s  53.88%   $25.59  $639.69  20.00👮   7.00👮   282s   $27.21   353s ❌ ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%    96s  43.37%    $8.26  $206.59  15.00👮   5.00👮   306s   $29.22   382s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   118s  29.49%    $0.00    $0.00  15.00👮   5.00👮   376s   $63.31   471s ❌ ❌ ✔️
```


BEFORE weakening servers (hacking skill level 1):

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  42.43%   0.41%  $70.00k  $288.75    49s    $2.49   $1.75m   $7.22k   $62.17 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  38.57%   0.38%   $2.00m   $7.50k    51s   $56.20  $50.00m $187.50k   $1.41k ✔️ ✔️
```

After weakening _foodnstuff_ (hacking skill level 35):

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  97.38%   0.41%  $70.00k  $288.75    30s    $9.51   $1.75m   $7.22k  $237.83 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  95.42%   0.40%   $2.00m   $8.08k    30s  $258.36  $50.00m $202.08k   $6.46k ✔️ ✔️ 
sigma-cosmetics     16GB       5👨‍💻  82.65%   0.33%   $2.30m   $7.64k    37s  $171.74  $57.50m $190.98k   $4.29k ❌ ❌ 
joesguns            16GB      10👨‍💻  71.12%   0.26%   $2.50m   $6.58k    51s   $90.89  $62.50m $164.43k   $2.27k ❌ ❌ 
nectar-net          16GB      20👨‍💻  53.88%   0.15%   $2.75m   $4.19k    88s   $25.59  $68.75m $104.76k  $639.69 ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻  43.37%   0.06%   $3.00m   $1.82k    96s    $8.26  $75.00m  $45.54k  $206.59 ❌ ❌ 
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

After weakening _foodnstuff_ (hacking skill level 35):

```
[home /]> run util/dashboard --show grow
hostname               RAM grow  $ avail    $ max     diff  factor threads   $/grow   time    g $/s       👮   min 👮 weak s threads 📈 
n00dles                4GB   3k  $70.00k   $1.75m   $1.68m   25.00   30.71  $54.71k    95s  $578.36   1.00👮   1.00👮   118s    0.00 ❌ 
foodnstuff            16GB    5   $2.00m  $50.00m  $48.00m   25.00  18.43k   $2.61k    96s   $27.27   3.00👮   3.00👮   119s    0.00 ❌ 
sigma-cosmetics       16GB   10   $2.30m  $57.50m  $55.20m   25.00  10.75k   $5.14k   118s   $43.66  10.00👮   3.00👮   147s  140.00 ❌ 
joesguns              16GB   20   $2.50m  $62.50m  $60.00m   25.00   8.06k   $7.45k   165s   $45.22  15.00👮   5.00👮   206s  200.00 ❌ 
nectar-net            16GB   25   $2.75m  $68.75m  $66.00m   25.00   8.59k   $7.68k   282s   $27.21  20.00👮   7.00👮   353s  260.00 ❌ 
hong-fang-tea         16GB   20   $3.00m  $75.00m  $72.00m   25.00   8.06k   $8.94k   306s   $29.22  15.00👮   5.00👮   382s  200.00 ❌ 
harakiri-sushi        16GB   40   $4.00m $100.00m  $96.00m   25.00   4.03k  $23.84k   376s   $63.31  15.00👮   5.00👮   471s  200.00 ✔️
```
