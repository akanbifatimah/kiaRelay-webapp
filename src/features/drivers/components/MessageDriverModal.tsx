import { useForm } from "react-hook-form";
import { MessageCircle } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";

interface MessageDriverFormValues {
  message: string;
}

interface MessageDriverModalProps {
  driverName: string;
  onClose: () => void;
  onSend: (message: string) => void;
}

// TODO: no real messaging system exists yet — "sends" by resolving locally,
// same mock-success pattern as requestPasswordReset always succeeding
// (see CLAUDE.md's auth mock note).
export function MessageDriverModal({ driverName, onClose, onSend }: MessageDriverModalProps) {
  const { control, handleSubmit } = useForm<MessageDriverFormValues>({ defaultValues: { message: "" } });

  function onSubmit(values: MessageDriverFormValues) {
    const message = values.message.trim();
    if (!message) return;
    onSend(message);
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <MessageCircle className="h-5 w-5 text-primary" />
          Message {driverName}
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Send Message
          </Button>
        </>
      }
    >
      <FormField
        control={control}
        name="message"
        label="Message"
        type="textarea"
        placeholder={`Send a message to ${driverName}…`}
        rules={{ required: "This field is required" }}
      />
    </Modal>
  );
}
