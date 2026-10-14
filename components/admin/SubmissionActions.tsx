"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck, MailOpen } from "lucide-react";
import DeleteButton from "./DeleteButton";

/** "Mark as read/unread" + delete for one message or prayer request. */
export default function SubmissionActions({ id, status, label }: { id: string; status: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const isRead = status === "READ";

  async function toggle() {
    setBusy(true);
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: isRead ? "UNREAD" : "READ" }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[12.5px] text-ink-soft hover:text-navy hover:bg-parchment/60 transition disabled:opacity-50"
      >
        {isRead ? <MailOpen size={15} /> : <MailCheck size={15} />} {isRead ? "Mark unread" : "Mark read"}
      </button>
      <DeleteButton endpoint={`/api/admin/submissions/${id}`} itemName={label} warning="This will be permanently removed." />
    </div>
  );
}
