import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button";
import { FormField } from "../../../../components/FormField";
import { Modal } from "../../../../components/Modal";
import type { DeliveryPhoto } from "../../deliveries/deliveryTypes";
import { PhotoUploadField } from "../booking/PhotoUploadField";

interface AddInfoForm {
  text: string;
  photos: DeliveryPhoto[];
}

// "Add Information" (2026-10-01; the design shows the button only — first
// pass): the reply lands on the admin ticket for the agent.
export function AddInfoModal({ request, onClose, onSend }: { request: string; onClose: () => void; onSend: (text: string, photos: DeliveryPhoto[]) => void }) {
  const { control, handleSubmit } = useForm<AddInfoForm>({ defaultValues: { text: "", photos: [] } });
  const submit = handleSubmit((v) => onSend(v.text, v.photos));
  return (
    <Modal
      title="Add Information"
      size="lg"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Send to Operations</Button>
        </div>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{request}</p>
        <FormField control={control} name="text" label="Your reply" type="textarea" placeholder="Add any details for Operations..." rules={{ validate: (v, all) => Boolean(String(v).trim()) || all.photos.length > 0 || "Add a note or at least one photo." }} />
        <PhotoUploadField control={control} name="photos" title="Photos" />
      </form>
    </Modal>
  );
}
