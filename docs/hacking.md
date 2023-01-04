# Hacking

Minimum RAM required for a script containing `hack`, `run` and `exec` methods:

| Methods     | base | hack | run  | exec | Total  |
|-------------|:----:|:----:|:----:|:----:|:------:|
| hack only   | 1.6  | 0.1  |   -  |   -  | 1.7 GB |
| run only    | 1.6  |   -  | 1.0  |   -  | 2.6 GB |
| exec only   | 1.6  |   -  |   -  | 1.3  | 2.9 GB |
| hack & run  | 1.6  | 0.1  | 1.0  |   -  | 2.7 GB |
| hack & exec | 1.6  | 0.1  |   -  | 1.3  | 3.0 GB |

A minimal hack-only script requires 1.7GB RAM. How much RAM is required for multiple threads?

|  Threads | RAM Required | Server Size | Server Name  |
|---------:|-------------:|------------:|--------------|
|        1 |       1.7 GB |             |              |
|        2 |       3.4 GB |        4 GB | _n00dles_    |
|        3 |       5.1 GB |             |              |
|        4 |       6.8 GB |        8 GB | _home_       |
|        5 |       8.5 GB |             |              |
|        6 |      10.2 GB |             |              |
|        7 |      11.9 GB |             |              |
|        8 |      13.6 GB |             |              |
|        9 |      15.3 GB |       16 GB | _foodnstuff_ |
