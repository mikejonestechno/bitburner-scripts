# 03: Early Hack, Grow, Weaken

This page contains raw notes and current stream thinking while I was creating scripts for target servers. These ideas and strategies will change
as I learn and adapt to new learnings.

> As a rule of thumb, your hacking target should be the server with highest max money that’s required hacking level is under 1/3 of your hacking level.

Prefer running hack commands on the highest RAM machines that can run many threads at highest $/hack. If a lower RAM machines completes first then available money would be lower and the higher RAM machine would get less.

If I have a high hack chance, no need to weaken (yet?) although lower security affects **time** to hack, weaken, grow.


> double check my previous conclusions, i cannot hack, **grow or weaken** a higher level server until i hit the required hacking level. But i can run scripts on servers with open ports.

The server % hack does not change as hacking level or security level increase, at least not noticeable in the first levels iterations to hacking level 50.

_foodnstuff_ will always hack 0.37% of available money regardless of hacking level or security level.

However the income rapidly drops as a percentage of the available money.

hostname                $/sec  chance  %/hack   $/hack  h sec  $ avail    $ max avail %   $/grow    $/sec  g sec  grow/h      👮  min 👮  w sec
foodnstuff             $56.20  38.57%   0.38%   $7.50k   51.5   $2.00m  $50.00m   4.00%   $1.30k    $7.90  164.7    7.12   10.00    3.00  205.9
foodnstuff            $133.50  86.24%   0.37%   $6.35k   41.0   $1.70m  $50.00m   3.39%
foodnstuff            $133.68  87.60%   0.37%   $5.49k   36.0   $1.47m  $50.00m   2.93%
foodnstuff            $127.28  88.05%   0.37%   $4.75k   32.9   $1.27m  $50.00m   2.54%

To get maintain _or increase_ $/hack I do need to target grow threads. Comparing $/second at the start, I should have _at least_ 7 grows for each hack.

If I consider 8 grows to 1 hack = 9 threads and I have 6 x 32 GB servers that can run 9 threads, then I should have 1 server run all the 6 hacks multithreaded, and the other servers run the grows

Perhaps for this initial early game before advanced formulas.exe I approximate total botNet ram / 1.75 = number of botNet threads available.

Then divide by (8 + 1) = 9 threads for small growth while hacking...

Hmmm given we start at only 4% available maybe I should try to reach a point where 80% of threads are grow only, 20% then split hack + grow.
As server gets closer to max then slow down a little, do 50% grow and 50% split hack + grow.

Hmmm now i think that start with mostly keeping balance and grow a little, because as higher servers are unlocked with higher maxMoney they become higher targets to grow, so the 'growing' target should switch to the server with highest growth potential, 'hacking' target to server with current $/sec.

Hmmm. %/hack * maxMoney gives me my grow target, 0.4% of $1m vs 0.3% of $50m.


-- so some updated numbers after level 5 would help. 

i expect when highest value server is 4% available I should allocate 80% effort to grow only. 20% to hack + grow the hack target to keep it balanced
I need to earn $ so I can grow more servers, to better grow the money I stole....so maybe all hack at start, when I see income going up each iteration but by a smaller amount, start moving towards 50:50, when I start getting less income each iteration should be 80:20 grow.

hmmmmm I am thinking still good idea to get money as fast as possible, buy NUKE.exe and unlock more servers to add to the botnet.
Tor router is 200k + buy BruteSSH.exe is better deal than purchasing an 8 GB server for $440k.
yes, crack all servers on the network should be cheaper than buying servers.

I think I need a botNet dashboard to keep summary of money, available RAM.

It does still appear unintuitive, I might see foodnstuff has low chance, and security 10 is higher than min 3 so I should weaken it first.

However I will earn so much hacking skill so quickly, that I soon have 86% chance and going up, no need to weaken. As I level up the hack time continues to go down, no need to weaken.

After refactoring analyze.js to analyze which server to target and how many threads are needed, I realize I want to reserve a minimum number of threads
to maintain some base minimum income rather than wait for servers to fill up their maxMoney.

            If minIncome wants 2 hack : 17 grow : 1 weaken
            Then do 2 hack threads, 2 grow + 2 grow + 2 grow + 2 grow + 2 grow + 2 grow + 2 grow + 2 grow (16), 1 grow / 1 weaken 

            If minIncome wants 5 hack : 43 grow : 3 weaken
            Then do 5 hack threads, and spread the 3 weakens through the remaining 43 grows always ending in a weaken
            43 grow + 3 weaken = 46 threads round down to nearest divisible of 5 hacks = 45 threads. 
            This may result in gradual decline of income/rise of security if we dont fully grow back or fully weaken however 
            keep it simpler until predictive formulas to maximize thread use.
            45 threads / 3 = 15 so do repeat a batch of (14 g + 1 w) * 3 times
            14 g, 1 w, 14 g, 1 w, 14 g, 1 w sliced up into 5 threads
            Plan would be 5h, 5g, 5g, 4g1w, 5g, 5g, 4g1w, 5g, 5g, 4g1w
            This is not optimal because weaken takes longer than grow.
            But is is it worth slicing up or just doing 3x weaken at the end? 1 weaken reduces security by 0.05 its not really making much difference  
            Alt Plan is 5 hack threads, then split 4 threads do grow x 9 iterations = 36 grows, and 1 thread iterates over 6 grows and 3 weakens parhaps
            
            If we were doing a large multi server hack then perhaps we keep count of how many grow/weakens weve done and carry over any remainder to the next 'iteration'.

            Acurately 5 h : 43.702 g : 3.696 w => weaken/grow => 0.0846 weaken per grow
            a) do hack x5 threads and track how much money we stole, compare with what we expected. Not sure what to do with this info but could be used to trigger different action?
            b) 43.702 grow remain so g x5 threads (and add 0.423 w)
            c) 38.702 grow remain so g x5 threads (now its 0.846 w)
            d) 33.702 grow remain so g x5 threads (now its 1.266 w)
            e) 28.702 grow remain but at least 1 w so do 1 weaken, and grow x4 threads (0.604 w)
                from this point we have 4 threads continuously growing, 1 thread 'out of sync' doing a weaken.
            f) we have 24.702 grow remaining, 0.604 weaken and ideally the hack/grow keep polling the port to check what to do next 
                alternate grow/weaken on the 1 thread (when weaken is > 1) and continuously grow x4 threads till grow remain is < 5 
                i.e. we have pretty much grown back almost all we stole.
                Assuming that this is still the highest $/sec targert we now want to get all 5 threads back in sync for next hack.
                Determine how long it will take for the 1x thread to complete and determine if it is less delay time to wait for it to complete or 
                do another 4x grow and wait for the 4x grow to complete. Do I waste 4 threads of x seconds or 1 thread of y seconds? Whichever delay is the shortest.
            g) rollover any remaining g/w and add to the next round of 5 h : 43.702 g : 3.696 w
                eventually over many cycles the rollover would work out to keep the desired ratios.
                
            perhaps the 1x thread should split out and I still to the hack x5 threads and grow x5 threads but occasionally 
            when weaken > 1 I queue a separate 1x weaken thread all by itself.
            I could have a 1x queue dedicated to weakens and if it overweakens (w goes negative or would go below min security, then it does a grow instead to help the main threads)

            New strategy is take 5 hack threads, 43 grow, 3 weaken 
            a)  i)  hack x5 threads then grow x5 threads 9 times (results in 45 grow so keep track that we grow +2 extra threads)
                ii) hack x5 threads then grow x5 threads 9 times again (now we have grown +4 extra theads)
                in a few cycles we will will only need to grow x5 threads 8 times
            b) in parallel to above run 1 thread that will just do weaken and grow, alternating between w and g to keep security at min security.
            This results in sustainable income but there is a huge time gap between the hack and then the next hack.

            Alternative strategy 
            1 hack : 8.74 grow : 0.739 weaken
            1 hack thread repeatedly hacks. 8 threads repeatedly grow. 1 thread alternates grow and weaken.
            This results in continuous sustainable income but takes 10 threads rather than 5 threads.
            At the start I have max 29 threads available so this still leaves 19 threads for growing next target.
            If I wanted to double 2 hack : 17 grow : 1 weaken then I need 20 threads
            2 hack thread repeatedly hacks. 17 threads repeatedly grow. 1 thread alternates grow and weaken.

            Attack should keep track of state to forecast and abort if we have leveled up and somehow grew faster than expected
            Attack should also continuously check if it is still the highest hackmoneypersecond and abort if a better target is available...
            ...AND the new target has higher hackmoney than original target, otherwise I would keep flipping targets and never grow anything back