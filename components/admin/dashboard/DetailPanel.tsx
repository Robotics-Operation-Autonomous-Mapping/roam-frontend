"use client";

import React, { useState } from "react";
import { Application, AppStatus, supabase } from "@/lib/supabase/client";
import { DetailPanelBody } from "./parts/DetailPanelBody";

interface DetailPanelProps {
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: AppStatus, notes: string) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  app,
  onClose,
  onStatusChange,
}) => {
  const [notes, setNotes] = useState(app.reviewer_notes || "");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (newStatus: AppStatus) => {
    setSaving(true);
    await onStatusChange(app.id, newStatus, notes);
    setSaving(false);
  };

  const getResumeUrl = () => {
    if (!app.resume_path) return null;
    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(app.resume_path);
    return data.publicUrl;
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <DetailPanelBody
      app={app}
      notes={notes}
      setNotes={setNotes}
      saving={saving}
      onClose={onClose}
      onStatusUpdate={handleUpdate}
      getResumeUrl={getResumeUrl}
      ensureAbsoluteUrl={ensureAbsoluteUrl}
    />
  );
};
