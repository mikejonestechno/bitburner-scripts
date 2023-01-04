# 01: Opening Gameplay

## Welcome

This series will document my thoughts and learnings as I explore the early opening gameplay. I have performed a "hard reset" after my first few hours play and started the game from scratch, skipping the tutorial.

## Getting Started

Ideally we would figure out where to start hacking but at the very start we only have couple of choices till we level up our hacking skill.

The official documentation says:

> As a rule of thumb, your hacking target should be the server with highest max money that’s required hacking level is under 1/3 of your hacking level.

**I believe that's** a good rough rule of thumb, that can be explored and optimized in mid to late gameplay.

Until we reach hack skill 5 the only servers we can hack are _n00dles_ and _foodnstuff_. 

## Analyze _n00dles_ and _foodnstuff_

**I believe that** we should defer making an automated network scanner and analyzer because at the start _n00dles_ and _foodnstuff_ are the only servers we can attack and that there is more value in automating other things first.

The money and security level of servers is not displayed in the `scan-analyze` CLI output, the only way to get detailed information about a server is to use a script.

I will **try to** make a script to scan one server and return all the information we can about the server.

**I expect** that I can build this in to a reusable function and scale in to an automated network scanner in the future.

**I created** `getServerInfo.js` to output all the properties of the `getServer()` function.

I discovered the `getServer()` method in the bitburner [GitHub Netscript documentation](https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md) and it returns a `server` object containing all the properties without needing to make separate function calls to multiple methods; in fact most of the properties dont have dedicated exposed methods and are only available using the `getServer()` method.

**I have learnt** that I need to take care with programming terminology especially given the context of the game; _script_, _function_, _method_ have different meanings and are not interchangable.

**I believe that** it will become confusing or more complex to document if I name my own scripts and functions similar to the built-in or default CLI and Netscript methods. **I will try** to develop an improved naming convention in my next iterations.

I **learnt how to** `printf()` with `/t` tab aligned output including colors and icons, although markdown doesnt render the colors.

``` pre
> run getServerInfo.js n00dles
Hostname:           n00dles
Organization:       Noodle Bar
Backdoor: ❌       ip: 3.6.4.5
Specification
CPU Cores:  1       Max: 8
RAM:        0 GB    Max: 4 GB
Security
Hack required:  1   Root: ❌
Security level: 1   Min: 1
Open Ports: 0 of 0 required.
ftp:❌ http:❌ smtp:❌ sql:❌ ssh:❌
Funds
Available: $ 0.07 m
Max:       $ 1.75 m
Grow factor:        3000
```

**I learnt that** _n00dles_ has maximum $1.75 million but only $70 k available. However it has a huge growth factor of 3,000. So **I expect that** it grows super fast and can quickly reach the maximum,given the offical doco says growth factor is usually between 0 and 100.

```
> run getServerInfo.js foodnstuff
Hostname: 	foodnstuff
Organization: 	FoodNStuff
Backdoor: ❌ 	ip: 28.4.4.3
Specification
CPU Cores: 	1 	Max: 8
RAM: 		0 GB 	Max: 16 GB
Security
Hack required: 	1 	Root: ❌
Security level:	10 	Min: 3
Open Ports: 0 of 0 required.
ftp:❌ http:❌ smtp:❌ sql:❌ ssh:❌
Funds
Available:	$ 2 m
Max:		$ 50 m
Grow factor: 	5
```

**I learnt that** _foodnstuff_ has maximum $50 million but only $2 million available and growth factor of 5, much lower growth than _n00dles_.

## Problem Satement

Even if I grow _n00dles_ to maximum $1.75 million, _foodnstuff_ already has $2 million available at the start.

So where should I start? Is it better to grow and hack _n00dles_ or hack _foodnstuff_ or a bit of both?

The official documentation (see above) suggests _the server hacking level should be less than 1/3rd of my hacking level_.

So if I am hacking level 9 then I should target servers with required hacking of 3 or less.

So if I am hacking level 12 then I should target servers with required hacking of 4 or less.

Foodnstuff starts with security level 10 with minimum level 3 so does this mean i should wait until I am at hacking level 30 or hacking level 9 before attempting _foodnstuff_?

I dont understand the mechanics of the hack and security levels yet.

Even if I just focus on _n00dles_ and want to grow _n00dles_ to maximum $1.75 million, how many grow commands or threads would I need to get there, how long would it take, and how would that affect the security level?

Analyzing the information I have I still dont know if attacking _n00dles_ be better or worse than trying to hack _foodnstuff_ that already has 2 million at the start.

**I learnt** the CLI `scan-analyze` command and Netscript `getServer()` method do not provide complete information, and I need more infomration by manual experimentation "trial and error" or by exploring more Netscript methods.

## Actually Analyze n00dles and foodnstuff

I discovered the bitburner [GitHub Netscript documentation](https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md) includes additional methods `getGrowTime()`, `growthAnalyze()` and `growthAnalyzeSecurity()`.

**I will try** using these methods and evaluate what to do next.

**I created** `analyzeServer.js` to output raw responses of additional Netscript methods.

```
> run getServerInfo.js n00dles
growTime:	157.64705882352942 seconds
growSecurity:	0.004 per thread
growSecurity:	0.04 per 10 threads
growThreads:	0.9093035761244146 required for 10% increase
growThreads:	30.709576927272387 required for 25x current value
hackTime:	    49.26470588235294 seconds
hackMoney:	    0.41250000000000003 %
hackChance:	    42.42857142857142 %
hackSecurity:	0.002 per thread
hackThreads:	34.72222222222222 required to steal $10,000
```

Reviewing all the information I now have:
 _n00dles_ has $70k and maximum $1.75 million; a factor of 25x (70,000 * 25 = 1,750,000).

`getServerInfo` tells me that _n00dles_ has $70k and maximum $1.75 million; a factor of 25x (70,000 * 25 = 1,750,000).

The grow factor is 3000 (hyper fast - Netscript documentation says it's typically less than 100).

`analyzeServer.js` tells me 30.7 threads are needed to grow 25x 

Reviewing the available RAM on the servers available at the start, and given a bare bones `grow.js` script requires 1.7 GB:

| server     | RAM   | threads |
|------------|------:|--------:|
| n00dles    |  4 GB |       2 |
| foodnstuff | 16 GB |       9 |
| home       |  8 GB |       4 |

So I could run a total 15 grow threads across all the servers. Seems feasible to me.

This will increase security by 0.004 * 15 = 0.06 and I need to do this twice to get to maxMoney so total increase to security by 0.004 * 15 * 2 = 0.12.

Thats actually much lower than I expected. I expected security to increase quickly and require frequent weakening.

At start (before growing server) I have 42% chance of successful hack and estimated 0.4% of $70,000 = $280 per hack.

If I grew _n00dles_ to $1.75 million then 0.4% of $1,750,000 = $7,000 per hack.

That much higher than I expected, at least before I did the mental math and realized it will be _significantly higher_ returns by growing _n00dles_ before hacking.

Reviewing _foodnstuff_ also had unexpected results.

```
> run getServerInfo.js foodnstuff
growTime:	164.70588235294122 seconds
growSecurity:	0.004 per thread
growSecurity:	0.04 per 10 threads
growThreads:	636.3538246560908 required for 10% increase
growThreads:	21491.344853752544 required for 25x current value
hackTime:	51.47058823529412 seconds
hackMoney:	0.37500000000000006 %
hackChance:	38.57142857142857 %
hackSecurity:	0.002 per thread
hackThreads:	1.3333333333333333 required to steal $10,000
```

`getServerInfo` tells me that _foodnstuff_ starts with $2 million and has maximum $50 million; again a factor of 25x (2 * 25 = 50).

The grow factor is 5 (a very slow growing server)

`analyzeServer.js` tells me 21,491 threads are required to grow 25x!!

Wow, that was unexpected. Growing _foodnstuff_ to max money is going to take ages! And will increase security level by 85 (21,491 * 0.004).

At start (before doing anything) I have 38% chance of successful hack and get 0.375% of $2 million = $7,500.

That's also unexpected, at the start I have similar chance of hacking _foodnstuff_ and get more money than if I were to grow  _n00dles_ to maximum and then hack _n00dles_.

The times for hack and grow are similar for servers - although time depends upon hack skill and security level which will constantly change.

Time for some manual experiements to validate what I have learnt!

## Hypothesis

**I will try** manual hack commands in the CLI to validate this hypothesis.

> **Given** I am at the very start of the game
>
> **When** I hack _n00dles_
>
> **Then** I have a 42% chance of getting $280.
>
> **When** I hack _foodnstuff_
>
> **Then** I have a 38% chance of getting $7,500.

```
[home ~/]> connect n00dles
Connected to n00dles
[n00dles ~/]> hack
[||||||||||||||||||||||||||||||||||||||||||||||||||]
Failed to hack 'n00dles'. Gained 0.825 hacking exp
[n00dles ~/]> hack
[||||||||||||||||||||||||||||||||||||||||||||||||||]
Failed to hack 'n00dles'. Gained 0.825 hacking exp
[n00dles ~/]> hack
[||||||||||||||||||||||||||||||||||||||||||||||||||]
Hack successful on 'n00dles'! Gained $288.000 and 3.300 hacking exp
Security increased on 'n00dles' from 1.000 to 1.002
[n00dles ~/]> home
Connected to home
[home ~/]> connect foodnstuff
Connected to foodnstuff
[foodnstuff ~/]> hack
[||||||||||||||||||||||||||||||||||||||||||||||||||]
Failed to hack 'foodnstuff'. Gained 1.500 hacking exp
[foodnstuff ~/]> hack
[||||||||||||||||||||||||||||||||||||||||||||||||||]
Hack successful on 'foodnstuff'! Gained $7.500k and 6.000 hacking exp
Security increased on 'foodnstuff' from 10.000 to 10.002
```

**Actual result** matched my expected outcome from the analysis.

Given the hack command only takes a few seconds, and security only increased by a tiny fraction I decided **to try** a few more hacks on _foodnstuff_ to validate if this was repeatable; could I repeatedly get $7.5 k from hacking _foodnstuff_?

**Results of** a couple more hacks and I already had $23 k and had levelled up half way through hacking level 2! The return on each hack was gradually reducing to $7.4 k per hack.

After 5 successful hacks I hit hacking skill level 3 and `analyzeServer.js` showed that my hack chance had increased to 73% so even after only five successful hacks, I was getting more likely that future hacks would also be successful.

After 10 successful hacks I was at hacking skill level 5 and my hack chance was 80%. Last successful hack returned $7.25 k and I had a total $75 k in my account.

After a soft reset I tried to manual grow and hack _n00dles_ and it only took 1 grow to get to $1 million and the second grow maxed at $1.75 million. I had expected this would require 30 grow threads based on the output of `AnalyzeServer.js`.

## What have I learnt?

At the start it is more effective to repeatedly hack _foodnstuff_ to quickly level up (and hack success rapidly increases with each successful hack), rather than spend effort growing _n00dles_ and then hacking _n00dles_ for lower return.

I have learnt that I need to revisit my server analysis and get a better understanding of how the values are applied.

## What will I try next?

I think that I want to validate these findings using scripts and inspect and adapt over a few iterations to improve my understanding and form a basic formula to determine which is the most effective strategy to reach hacking level 5?
