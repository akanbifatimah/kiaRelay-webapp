import { WorkflowQueueView } from "./components/WorkflowQueueView";

/** Customer Support unit's queue (TC-16, Workflow A). */
export function SupportQueuePage() {
  return <WorkflowQueueView queue="customer" />;
}
