# Hacking

Minimum RAM required for a script containing `hack`, `run` and `exec` methods:

| Methods     | base | cmd  | run  | exec |  Total  |
|-------------|:----:|:-----|-----:|-----:|--------:|
| hack only   | 1.6  | 0.1  |   -  |   -  |  1.7 GB |
| grow only   | 1.6  | 0.15 |   -  |   -  | 1.75 GB |
| weaken only | 1.6  | 0.15 |   -  |   -  | 1.75 GB |
| run only    | 1.6  |   -  | 1.0  |   -  |  2.6 GB |
| exec only   | 1.6  |   -  |   -  | 1.3  |  2.9 GB |
| hack & run  | 1.6  | 0.1  | 1.0  |   -  |  2.7 GB |
| hack & exec | 1.6  | 0.1  |   -  | 1.3  |  3.0 GB |

A minimal hack-only script requires 1.7GB RAM. How much RAM is required for multiple threads?

| Server | Scripts   | Used RAM   | Avail RAM |
|-------:|-----------|-----------:|----------:|
|   4 GB | hack * 2  |  3.40 GB   |   0.60 GB |
|   4 GB | g/w * 2   |  3.50 GB   |   0.50 GB |
|   8 GB | hack * 4  |  6.80 GB   |   1.20 GB |
|   8 GB | g/w * 4   |  7.00 GB   |   1.00 GB |
|  16 GB | hack * 9  | 15.30 GB   |   0.70 GB |
|  16 GB | g/w * 9   | 15.75 GB   |   0.25 GB |
|  32 GB | hack * 18 | 30.60 GB   |   1.40 GB |
|  32 GB | g/w * 18  | 31.50 GB   |   0.50 GB |
|  64 GB | hack * 37 | 62.90 GB   |   1.10 GB |
|  64 GB | g/w * 36  | 63.00 GB   |   1.00 GB |

Perhaps I find a more effective use of the 4 GB n00dles than running 2 commands.


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
