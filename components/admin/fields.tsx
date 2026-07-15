"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import type { SkillItem } from "@/types/content";

export function TextField({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </div>
  );
}

export function NumberField({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: number | null;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        type="number"
        name={name}
        defaultValue={defaultValue ?? 0}
        required={required}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue ?? options[0]?.value}
        required={required}
        className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SwitchField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked ?? false}
        className="h-4 w-4 accent-primary"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

export function ImageUploader({
  label,
  name,
  bucket,
  defaultValue,
}: {
  label: string;
  name: string;
  bucket: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState<string | null>(defaultValue ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("bucket", bucket);
      fd.append("file", file);
      const res = await uploadImage(fd);
      if (res.error || !res.url) {
        setError(res.error ?? "Upload failed");
      } else {
        setUrl(res.url);
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input type="hidden" name={name} value={url ?? ""} />
      <div className="flex items-center gap-4">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
        )}
        <label className="cursor-pointer px-4 py-2 rounded-md border border-input bg-background text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          {uploading ? "Uploading..." : "Choose file"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {url && <p className="text-xs text-muted-foreground break-all">{url}</p>}
    </div>
  );
}

export function SkillsField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: SkillItem[];
}) {
  const [items, setItems] = useState<SkillItem[]>(defaultValue ?? []);

  const update = (next: SkillItem[]) => setItems(next);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Skills (name + highlight)</label>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={item.name}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...item, name: e.target.value };
                update(next);
              }}
              placeholder="Skill name"
            />
            <label className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
              <input
                type="checkbox"
                checked={item.highlight}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...item, highlight: e.target.checked };
                  update(next);
                }}
                className="h-4 w-4 accent-primary"
              />
              Top
            </label>
            <button
              type="button"
              onClick={() => update(items.filter((_, i) => i !== idx))}
              className="px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => update([...items, { name: "", highlight: false }])}
        className="text-xs text-primary hover:text-primary/80"
      >
        + Add skill
      </button>
    </div>
  );
}

export function AdminCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
