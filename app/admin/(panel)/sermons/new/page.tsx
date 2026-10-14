import SermonForm from "@/components/admin/SermonForm";

export default function NewSermonPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Sermon</h1>
      <p className="text-sm text-ink-soft mb-8">Fill in the details, upload the audio and/or video, then publish.</p>
      <SermonForm />
    </div>
  );
}
