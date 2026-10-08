import VideoAudioForm from "@/components/admin/VideoAudioForm";

export default function NewVideoAudioPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-navy mb-2">New Video or Audio</h1>
      <p className="text-sm text-ink-soft mb-8">Paste a link or mark it for upload, then publish.</p>
      <VideoAudioForm />
    </div>
  );
}
