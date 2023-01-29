# 02: Opening Gameplay Update

I have a `start.js` to scan and analyze all hackable targets at the current hacking level and target the server with highest hacking income per second.


## Try 

I will experiment to explore whether the impact of spending money to buy cracks rather than manually programming them.


### Iteration 0: Hacking Skill 1, $1k

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max avail %   $/grow    $/sec  g sec  grow/h      👮  min 👮  w sec  ram
foodnstuff             $56.20  38.57%   0.38%   $7.50k   51.5   $2.00m  $50.00m   4.00%   $1.30k    $7.90  164.7    7.12   10.00    3.00  205.9   16
n00dles                 $2.49  42.43%   0.41%  $288.75   49.3  $70.00k   $1.75m   4.00%  $31.86k  $202.13  157.6    0.01    1.00    1.00  197.1    4

### Iteration 1: Hacking Skill 14, $305k

After 1 hack cycle I have enough to buy Tor router ($200k) but BruteSSH.exe is extra $500k

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max avail %   $/grow    $/sec  g sec  grow/h      👮  min 👮  w sec  ram
foodnstuff            $135.03  86.25%   0.37%   $6.42k   41.0   $1.71m  $50.00m   3.43%   $1.29k    $9.83  131.3   13.74   10.00    3.00  164.1   16
sigma-cosmetics        $90.38  71.63%   0.27%   $6.16k   48.8   $2.30m  $57.50m   4.00%   $2.99k   $19.15  156.3    4.72   10.00    3.00  195.3   16
joesguns               $23.27  50.31%   0.13%   $3.16k   68.4   $2.50m  $62.50m   4.00%   $4.34k   $19.83  218.8    1.17   15.00    5.00  273.4   16
n00dles                 $6.98  94.96%   0.41%  $288.75   39.3  $70.00k   $1.75m   4.00%  $31.86k  $253.65  125.6    0.03    1.00    1.00  157.0    4

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max avail %   $/grow    $/sec  g sec  grow/h      👮  min 👮  w sec  ram
foodnstuff            $135.03  86.25%   0.37%   $6.42k   41.0   $1.71m  $50.00m   3.43%  $857.30    $6.53  131.3   20.68   10.00    3.00  164.1   16
sigma-cosmetics        $90.38  71.63%   0.27%   $6.16k   48.8   $2.30m  $57.50m   4.00%   $1.99k   $12.72  156.3    7.10   10.00    3.00  195.3   16
joesguns               $23.27  50.31%   0.13%   $3.16k   68.4   $2.50m  $62.50m   4.00%   $2.88k   $13.18  218.8    1.77   15.00    5.00  273.4   16
n00dles                 $6.98  94.96%   0.41%  $288.75   39.3  $70.00k   $1.75m   4.00%  $21.17k  $168.52  125.6    0.04    1.00    1.00  157.0    4



### Iteration 2: Hacking Skill 23, $534k

After iteration 2 foodnstuff is only marginal increase in $133/sec
Sometimes its slightly lower at $132/sec

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max       %
foodnstuff            $133.68  87.60%   0.37%   $5.49k   36.0   $1.47m  $50.00m   2.93%
sigma-cosmetics       $131.19  78.82%   0.31%   $7.13k   42.8   $2.30m  $57.50m   4.00%
joesguns               $57.45  63.88%   0.22%   $5.39k   59.9   $2.50m  $62.50m   4.00%
n00dles                 $8.10  96.54%   0.41%  $288.75   34.4  $70.00k   $1.75m   4.00%
nectar-net              $6.25  40.25%   0.06%   $1.59k  102.7   $2.75m  $68.75m   4.00%

### Iteration 3: Hacking Skill 30, $731k

After Iteration 3 target switched to sigma-cosmetics $155/sec
I can now afford to buy Tor router ($200k) and BruteSSH.exe ($500k)

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max       %
sigma-cosmetics       $155.82  81.43%   0.33%   $7.48k   39.1   $2.30m  $57.50m   4.00%
foodnstuff            $127.28  88.05%   0.37%   $4.75k   32.9   $1.27m  $50.00m   2.54%
joesguns               $77.98  68.81%   0.25%   $6.20k   54.7   $2.50m  $62.50m   4.00%
nectar-net             $17.76  49.52%   0.12%   $3.36k   93.8   $2.75m  $68.75m   4.00%
n00dles                 $8.93  97.11%   0.41%  $288.75   31.4  $70.00k   $1.75m   4.00%
hong-fang-tea           $1.27  36.43%   0.01%  $354.17  101.6   $3.00m  $75.00m   4.00%

### Iteration 4: Hacking Skill 37, $1.111m

Starting to LOSE income rate down to $147/sec

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max       %
sigma-cosmetics       $147.86  82.95%   0.33%   $6.42k   36.0   $1.92m  $57.50m   3.34%
foodnstuff            $138.92  88.37%   0.37%   $4.75k   30.2   $1.27m  $50.00m   2.54%
joesguns               $95.77  71.87%   0.27%   $6.70k   50.3   $2.50m  $62.50m   4.00%
nectar-net             $28.60  55.29%   0.16%   $4.46k   86.2   $2.75m  $68.75m   4.00%
hong-fang-tea          $11.22  45.62%   0.08%   $2.30k   93.4   $3.00m  $75.00m   4.00%
n00dles                 $9.75  97.47%   0.41%  $288.75   28.9  $70.00k   $1.75m   4.00%

### Iteration 5: Hacking Skill 40, $1.237m

DOWN AGAIN to $144/sec

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max       %
sigma-cosmetics       $144.88  83.43%   0.34%   $6.05k   34.8   $1.79m  $57.50m   3.12%
foodnstuff            $143.88  88.48%   0.37%   $4.75k   29.2   $1.27m  $50.00m   2.54%
joesguns              $102.85  72.86%   0.27%   $6.86k   48.6   $2.50m  $62.50m   4.00%
nectar-net             $33.00  57.14%   0.18%   $4.81k   83.3   $2.75m  $68.75m   4.00%
hong-fang-tea          $15.72  48.57%   0.10%   $2.92k   90.3   $3.00m  $75.00m   4.00%
n00dles                $10.09  97.59%   0.41%  $288.75   27.9  $70.00k   $1.75m   4.00%
harakiri-sushi          $1.16  36.43%   0.01%  $354.17  111.1   $4.00m $100.00m   4.00%


### Iteration 6: Hacking Skill 45, $1.551m

Switch back to foodnstuff as we can now get same $ in less time but $152/sec still down from iteration 3

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max       %
foodnstuff            $152.12  88.62%   0.37%   $4.75k   27.7   $1.27m  $50.00m   2.54%
sigma-cosmetics       $128.19  84.04%   0.34%   $5.04k   33.1   $1.48m  $57.50m   2.57%
joesguns              $114.14  74.21%   0.28%   $7.08k   46.1   $2.50m  $62.50m   4.00%
nectar-net             $40.04  59.68%   0.19%   $5.30k   78.9   $2.75m  $68.75m   4.00%
hong-fang-tea          $23.24  52.62%   0.13%   $3.78k   85.5   $3.00m  $75.00m   4.00%
n00dles                $10.67  97.74%   0.41%  $288.75   26.4  $70.00k   $1.75m   4.00%
harakiri-sushi          $7.51  41.83%   0.05%   $1.89k  105.3   $4.00m $100.00m   4.00%

### Iteration 6: Hacking Skill 49, $1.759m

Switch back to sigma-cosmetics but we are still at lower rates $135/sec.
At hacking level 50 I can manually program BruteSSH.exe

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max       %
sigma-cosmetics       $135.40  84.51%   0.34%   $5.08k   31.7   $1.48m  $57.50m   2.57%
foodnstuff            $132.40  88.62%   0.37%   $3.97k   26.6   $1.06m  $50.00m   2.12%
joesguns              $122.81  75.09%   0.29%   $7.23k   44.2   $2.50m  $62.50m   4.00%
nectar-net             $45.44  61.34%   0.20%   $5.61k   75.8   $2.75m  $68.75m   4.00%
hong-fang-tea          $29.20  55.26%   0.14%   $4.34k   82.1   $3.00m  $75.00m   4.00%
harakiri-sushi         $12.98  45.35%   0.07%   $2.89k  101.0   $4.00m $100.00m   4.00%
n00dles                $11.13  97.85%   0.41%  $288.75   25.4  $70.00k   $1.75m   4.00%


## Learn

Without spending money on cracks or purchasing servers I have learnt that even unlocking level 30 (hong-fang-tea)
and level 40 (harakiri-sushi) that I dont immediately gain higher income rates because the hack time is twice as long
and only 50% chance of success.

Analyzing _neo-net_ at level 51 (_neo-net_ is hackable from level 50) shows that a hack will take **3 minutes** with a 33% hack chance, an income of $1/second.

While I can spend money to buy cracks and unlock servers that need port cracking, I will be significantly losing my income rate.

At the very start increasing hacking level **did** unlock higher level servers and **one** round of significantly higher income. 

However subsequent hacking level and unlocking servers that need port cracking **did not** result in higher income rates.

I need to explore the growth mechanics and start purchasing additional servers to grow back what I have stolen right at the start. All servers start with 4% of their max Money. I need to keep this increasing AND keep weakening the servers so that I get and maintain at least 80% hack chance.
