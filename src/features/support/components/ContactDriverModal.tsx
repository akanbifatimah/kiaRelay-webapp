import { Controller, useForm, useWatch } from "react-hook-form";
import { Headset, MessageSquare, Phone, Smartphone } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { OptionToggleGroup } from "./OptionToggleGroup";

export type ContactChannel = "call" | "sms" | "in-app";

interface ContactFormValues {
  channel: ContactChannel;
  message: string;
  outcome: string;
}

interface ContactDriverModalProps {
  driverName: string;
  phone: string;
  onClose: () => void;
  onContact: (channel: ContactChannel, summary: string) => void;
}

const CHANNELS: { value: ContactChannel; label: string }[] = [
  { value: "call", label: "Call" },
  { value: "sms", label: "SMS" },
  { value: "in-app", label: "In-App" },
];

const QUICK_MESSAGES = [
  "Please call dispatch when safe to do so.",
  "Your detour has been approved — follow the updated route in the app.",
  "Reminder: submit your pre-trip inspection before departing.",
];

const OUTCOMES = ["Reached — issue resolved", "Reached — follow-up needed", "No answer — left voicemail", "Wrong number"];

// No design existed for "Contact Driver" — built per the user's direction to
// implement the screens behind buttons rather than stub them (2026-09-23).
// Call opens the device dialer (tel:) and logs the outcome; SMS/In-App send
// a message. TODO: POST /drivers/:id/contact (telephony/SMS/push providers).
export function ContactDriverModal({ driverName, phone, onClose, onContact }: ContactDriverModalProps) {
  const { control, handleSubmit, setValue } = useForm<ContactFormValues>({
    defaultValues: { channel: "call", message: "", outcome: OUTCOMES[0] },
  });
  const channel = useWatch({ control, name: "channel" });

  function onSubmit(values: ContactFormValues) {
    onContact(values.channel, values.channel === "call" ? values.outcome : values.message.trim());
  }

  return (
    <Modal
      title={
        <>
          <Headset className="h-5 w-5 text-primary" />
          Contact {driverName}
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="contact-driver-form" variant="dark">
            {channel === "call" ? "Log Call" : "Send Message"}
          </Button>
        </>
      }
    >
      <form id="contact-driver-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="channel"
          control={control}
          render={({ field }) => <OptionToggleGroup ariaLabel="Contact channel" options={CHANNELS} value={field.value} onChange={field.onChange} />}
        />
        {channel === "call" ? (
          <>
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3 hover:border-primary/40"
            >
              <span>
                <span className="block text-xs text-text-muted">Driver phone</span>
                <span className="font-semibold text-text">{phone}</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-sm font-medium text-white">
                <Phone className="h-4 w-4" />
                Start Call
              </span>
            </a>
            <FormField
              control={control}
              name="outcome"
              label="Call outcome"
              type="select"
              options={OUTCOMES.map((value) => ({ value, label: value }))}
            />
          </>
        ) : (
          <>
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              {channel === "sms" ? <Smartphone className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
              {channel === "sms" ? `Text message to ${phone}` : "Push notification + message in the KiaRelay Driver app"}
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_MESSAGES.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setValue("message", text, { shouldValidate: true })}
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-muted hover:border-primary/40 hover:text-text"
                >
                  {text}
                </button>
              ))}
            </div>
            <FormField
              control={control}
              name="message"
              label="Message"
              type="textarea"
              placeholder={`Write a message to ${driverName}…`}
              rules={{ validate: (value) => value.trim().length > 0 || "Write a message first." }}
            />
          </>
        )}
      </form>
    </Modal>
  );
}
