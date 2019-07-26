import express from "express";
import { ZBClient } from "zeebe-node";

const results = {};

const zb = new ZBClient("localhost");

const app = express();
const port = 3000;

async function main() {
  await zb.deployWorkflow("./bpmn/random-number.bpmn");
  zb.createWorker("worker1", "generate-random-number", (job, complete) => {
    complete({
      number: Math.random()
    });
  });
  zb.createWorker("worker2", "output-task", (job, complete) => {
    const { workflowInstanceKey } = job.jobHeaders;
    const number = job.variables.number;
    results[workflowInstanceKey] = {
      status: "Done",
      result: number
    };
    complete();
  });

  app.get("/", async (req, res) => {
    const { workflowInstanceKey } = await zb.createWorkflowInstance(
      "random-number",
      {}
    );
    results[workflowInstanceKey] = {
      status: "In Progress"
    };
    res.send({
      resultsUrl: `http://127.0.0.1:3000/results/${workflowInstanceKey}`
    });
  });
  app.get("/results/:key", (req, res) => {
    const { key } = req.params;
    if (!results[key]) {
      return res.sendStatus(404);
    } else {
      return res.send(results[key]);
    }
  });
  app.listen(port, () =>
    console.log(`Zeebe REST handler listening on port ${port}!`)
  );
}

main();
