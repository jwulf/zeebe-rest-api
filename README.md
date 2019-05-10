# zeebe-rest-api

How do I access Zeebe over REST? Some ideas.

## Synchronous Response

Uses an event emitter to pass a result from a workflow execution to a HTTP response.

### Prerequisites

* Node.js
* Zeebe](https://zeebe.io) - Docker compose config [here](https://github.com/jwulf/zeebe-operate-docker)

### To Install

```bash
npm i -g ts-node
npm i
```

### To Run:

1. Start the Zeebe broker.
2. Start the REST Server (starts workers and deploys workflow): `ts-node src/synchronous-response/index.ts`.
3. Open [127.0.0.1:3000](http://127.0.0.1:3000) (or `curl` it).

You'll see output like this:

```
zeebe-rest-api on  master [?] is 📦 v1.0.0 via ⬢ v10.9.0
➜ curl 127.0.0.1:3000
{"number":0.7504228909151884}%
```