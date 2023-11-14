# 08: Analyze, Really Analyze

I want to to select a target server to attack.


At the start of the game _foodnstuff_ has the highest hack $ per second and also the highest max money per second, so appears the best target to hack.

> TEST: If I weaken _foodnstuff_ from security level 10 to minimum security 3 then it will increase my hack chance, and the more sucessful hacks, the faster I can gain hacking experience. Will weakening security pay off by increasing (a) hacking experience earnt per second? (b) money earnt per second?









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

// summarize scripts and the progress to date 
// what does run start.js do?
// explain the file structure so far.