import { WorkflowQueueView } from "./components/WorkflowQueueView";

/** Technical Support unit's queue (TC-16, Workflow B). */
export function TechnicalQueuePage() {
  return <WorkflowQueueView queue="technical" />;
}
