import { EventEmitter } from "events";
import express from "express";
import { ZBClient } from "zeebe-node";

class WorkflowEmitter extends EventEmitter {}
const workflowEmitter = new WorkflowEmitter();

const zb = new ZBClient("localhost");

const app = express();
const port = 3000;

async function main() {
  await zb.deployWorkflow("./bpmn/random-number.bpmn", { redeploy: false });
  zb.createWorker("worker1", "generate-random-number", (job, complete) => {
    complete({
      number: Math.random()
    });
  });
  zb.createWorker("worker2", "output-task", (job, complete) => {
    const { workflowInstanceKey } = job.jobHeaders;
    const number = job.variables.number;
    workflowEmitter.emit(workflowInstanceKey.toString(), number);
    complete();
  });

  app.get("/", async (req, res) => {
    const { workflowInstanceKey } = await zb.createWorkflowInstance(
      "random-number",
      {}
    );
    workflowEmitter.once(workflowInstanceKey.toString(), number => {
      res.send({ number });
    });
  });
  app.listen(port, () =>
    console.log(`Zeebe REST handler listening on port ${port}!`)
  );
}

main();
