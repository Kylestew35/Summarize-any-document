'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setSummary(null);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">
          Summarize Any Document
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Upload a PDF, DOCX, or TXT file and get a concise summary with key points and action items.
        </p>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? "Summarizing…" : "Summarize Document"}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 text-sm text-red-500">{errorMsg}</div>
        )}

        {summary && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Summary
            </h2>
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {summary}
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500 text-center">
          Built with Next.js + OpenAI • by Kyle
        </p>
      </div>
    </main>
  );
}