# zeebe-rest-api

How do I wrap a workflow with a single REST request-response in Zeebe? That is to say: create an instance on the request, and send some final output of the workflow in the response. Here are two different ways to do that.

### Prerequisites

* Node.js
* Zeebe](https://zeebe.io) - Docker compose config [here](https://github.com/jwulf/zeebe-operate-docker)

### To Install

```bash
npm i -g ts-node
npm i
```

## 1. Synchronous Response

Uses an event emitter to pass a result from a workflow execution to a HTTP response.

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

## 2. Callback Route

Cache the outcome of a workflow, and send the client a results URL that it can poll.

### To Run:

1. Start the Zeebe broker.
2. Start the REST Server (starts workers and deploys workflow): `ts-node src/synchronous-response/index.ts`.
3. Open [127.0.0.1:3000](http://127.0.0.1:3000) (or `curl` it).

You'll see output like this:

```
zeebe-rest-api on  master [!?] is 📦 v1.0.0 via ⬢ v10.9.0
➜ curl 127.0.0.1:3000
{"resultsUrl":"http://127.0.0.1:300/results/9685"}%
```

Now, curl the resultsUrl to collect the result:

```
zeebe-rest-api on  master [!?] is 📦 v1.0.0 via ⬢ v10.9.0
➜ curl http://127.0.0.1:3000/results/9685
{"status":"Done","result":0.8547789402934958}%
```
