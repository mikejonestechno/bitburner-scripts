# 03 - Hack Experiment

## Objective

Test the effect of hacking servers without weaken or growing first.

## Try

Perform a soft reset so that _foodnstuff_ is back to initial security level 10.

Hack the target server with highest hack rate per second for maximum 500 seconds (approx 8.25 minutes).

Observe the effect on hack/grow/weaken statistics on _foodnstuff_ and compare with previous results.

## Expect

I expect that that hacking servers without weakening or growing quickly gains hacking skill experience, unlocking higher level servers for hacking and earning enough money to purchase Tor router and port cracks.

## Actual

After 3 hack Iterations taking 2+ mintues (135 seconds) I reached hacking level 31 and had over $800 k, enough to purchase Tor router and BruteSSH.exe.

After 5 hack iterations taking 3+ minutes (203 seconds) I reached hacking level 42 and had $1.3 m.

## Learn

I learnt that the hypothesis is correct, at the start of the game there is little value in weakening servers; hacking is the fastest way to gain hacking experience and money to unlock additional servers.

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

[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  42.43%   0.41%  $70.00k  $288.75    49s    $2.49   $1.75m   $7.22k   $62.17 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  38.57%   0.38%   $2.00m   $7.50k    51s   $56.20  $50.00m $187.50k   $1.41k ✔️ ✔️
```

AFTER 1 Iteration hack level 13 $270.741k 51 seconds

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  94.65%   0.41%  $70.00k  $288.75    40s    $6.85   $1.75m   $7.22k  $171.32 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  85.97%   0.37%   $1.73m   $6.48k    42s  $133.72  $50.00m $187.34k   $3.86k ✔️ ✔️ 
sigma-cosmetics     16GB       5👨‍💻  70.22%   0.26%   $2.30m   $5.97k    50s   $84.53  $57.50m $149.28k   $2.11k ❌ ❌ 
joesguns            16GB      10👨‍💻  47.64%   0.11%   $2.50m   $2.72k    69s   $18.69  $62.50m  $68.11k  $467.21 ❌ ❌ 
```

AFTER 2 Iteration hack level 24 $565.112k 51+42 seconds
Note _foodnstuff_ available money now below 3% and hack rate has DECREASED. But _foodnstuff_ still has highest max hack rate and should be grow/weakened?

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  96.64%   0.41%  $70.00k  $288.75    34s    $8.22   $1.75m   $7.22k  $205.47 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  87.69%   0.37%   $1.44m   $5.37k    36s  $132.75  $50.00m $187.14k   $4.62k ❌ ✔️ 
sigma-cosmetics     16GB       5👨‍💻  79.29%   0.31%   $2.30m   $7.19k    42s  $134.94  $57.50m $179.69k   $3.37k ✔️ ❌ 
joesguns            16GB      10👨‍💻  64.76%   0.22%   $2.50m   $5.53k    59s   $60.62  $62.50m $138.35k   $1.52k ❌ ❌ 
nectar-net          16GB      20👨‍💻  41.90%   0.07%   $2.75m   $1.91k   101s    $7.90  $68.75m  $47.74k  $197.40 ❌ ❌ 
```

AFTER 3 Iteration hack level 31 $843.221k 51+42+42 seconds
Note UNEXPECTED the increased hacking skill has improved hack times and _foodnstuff_ hack rate has INCREASED a little.
At this point I can afford Tor router and BruteSSH.exe crack.

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  97.18%   0.41%  $70.00k  $288.75    31s    $9.05   $1.75m   $7.22k  $226.15 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  88.17%   0.37%   $1.44m   $5.37k    32s  $146.10  $50.00m $187.14k   $5.09k ✔️ ✔️ 
sigma-cosmetics     16GB       5👨‍💻  81.63%   0.33%   $2.02m   $6.60k    39s  $139.38  $57.50m $187.64k   $3.96k ❌ ❌ 
joesguns            16GB      10👨‍💻  69.33%   0.25%   $2.50m   $6.28k    54s   $80.66  $62.50m $157.09k   $2.02k ❌ ❌ 
nectar-net          16GB      20👨‍💻  50.51%   0.13%   $2.75m   $3.55k    93s   $19.36  $68.75m  $88.71k  $483.89 ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻  38.00%   0.02%   $3.00m  $685.48   100s    $2.60  $75.00m  $17.14k   $64.91 ❌ ❌
```

AFTER 4 Iteration hack level 38 $1.127m 51+42+42+32 seconds

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  97.51%   0.41%  $70.00k  $288.75    29s    $9.86   $1.75m   $7.22k  $246.54 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  88.36%   0.37%   $1.15m   $4.31k    30s  $127.36  $50.00m $186.90k   $5.53k ❌ ✔️ 
sigma-cosmetics     16GB       5👨‍💻  83.16%   0.34%   $2.02m   $6.78k    36s  $158.47  $57.50m $192.76k   $4.51k ✔️ ❌ 
joesguns            16GB      10👨‍💻  72.22%   0.27%   $2.50m   $6.76k    50s   $98.16  $62.50m $168.93k   $2.45k ❌ ❌ 
nectar-net          16GB      20👨‍💻  55.94%   0.17%   $2.75m   $4.58k    85s   $30.08  $68.75m $114.58k  $752.08 ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻  46.65%   0.08%   $3.00m   $2.52k    92s   $12.72  $75.00m  $62.91k  $317.89 ❌ ❌ 
```

AFTER 5 Iteration hack level 42 $1.318m 51+42+42+32+36=203 seconds
Note decrease in hacking rate, we are in diminishing returns

```
[home /]> run util/dashboard --show hack
hostname             RAM    hack👨‍💻  chance steal %  $ avail   $/hack   time hack $/s    $ max   $/hack  max $/s 🎯 💰 
n00dles              4GB       1👨‍💻  97.65%   0.41%  $70.00k  $288.75    27s   $10.32   $1.75m   $7.22k  $258.12 ❌ ❌ 
foodnstuff          16GB       1👨‍💻  88.49%   0.37%   $1.15m   $4.31k    29s  $133.34  $50.00m $186.90k   $5.79k ❌ ✔️ 
sigma-cosmetics     16GB       5👨‍💻  83.75%   0.34%   $1.83m   $6.20k    34s  $152.54  $57.50m $194.79k   $4.79k ✔️ ❌ 
joesguns            16GB      10👨‍💻  73.44%   0.28%   $2.50m   $6.96k    48s  $107.43  $62.50m $173.92k   $2.69k ❌ ❌ 
nectar-net          16GB      20👨‍💻  58.23%   0.18%   $2.75m   $5.02k    82s   $35.86  $68.75m $125.50k  $896.42 ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻  50.31%   0.11%   $3.00m   $3.29k    88s   $18.73  $75.00m  $82.22k  $468.33 ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻  38.74%   0.03%   $4.00m   $1.01k   109s    $3.61 $100.00m  $25.30k   $90.17 ❌ ❌

[home /]> run util/dashboard
hostname             RAM    hack👨‍💻  $ avail    $ max % avail hack s  chance    h $/s  max $/s       👮   min 👮 grow s    g $/s weak s 🎯 💰 📈 
n00dles              4GB       1👨‍💻  $70.00k   $1.75m   4.00%    27s  97.65%   $10.32  $258.12   1.00👮   1.00👮    87s  $625.99   109s ❌ ❌ ❌ 
foodnstuff          16GB       1👨‍💻   $1.15m  $50.00m   2.30%    29s  88.49%  $133.34   $5.79k  10.29👮   3.00👮    91s   $20.62   114s ❌ ✔️ ❌ 
sigma-cosmetics     16GB       5👨‍💻   $1.83m  $57.50m   3.18%    34s  83.75%  $152.54   $4.79k  10.14👮   3.00👮   109s   $43.78   136s ✔️ ❌ ❌ 
joesguns            16GB      10👨‍💻   $2.50m  $62.50m   4.00%    48s  73.44%  $107.43   $2.69k  15.00👮   5.00👮   152s   $48.95   190s ❌ ❌ ❌ 
nectar-net          16GB      20👨‍💻   $2.75m  $68.75m   4.00%    82s  58.23%   $35.86  $896.42  20.00👮   7.00👮   261s   $29.45   326s ❌ ❌ ❌ 
hong-fang-tea       16GB      30👨‍💻   $3.00m  $75.00m   4.00%    88s  50.31%   $18.73  $468.33  15.00👮   5.00👮   283s   $31.63   353s ❌ ❌ ❌ 
harakiri-sushi      16GB      40👨‍💻   $4.00m $100.00m   4.00%   109s  38.74%    $3.61   $90.17  15.00👮   5.00👮   348s   $68.53   435s ❌ ❌ ✔️
```

