"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Pix } from "./Pix";

export const LinkShortener = () => {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<{ shortCode: string; shortUrl: string } | null>(null);
  const createLink = useMutation(api.links.createLink);
  const recentLinks = useQuery(api.links.getRecentLinks);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreatedLink(null);
    if (!url.trim()) { setError("Please enter a URL"); return; }
    let processedUrl = url.trim();
    if (!/^https?:\/\//i.test(processedUrl)) processedUrl = "https://" + processedUrl;
    setIsCreating(true);
    try {
      const result = await createLink({ url: processedUrl, customAlias: showCustom && customAlias.trim() ? customAlias.trim() : undefined, isPublic });
      setCreatedLink(result);
      setUrl("");
      setCustomAlias("");
      setShowCustom(false);
      setIsPublic(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create short link");
    } finally { setIsCreating(false); }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div>
      <form onSubmit={handleSubmit} className="short-form">
        <label htmlFor="long-url">long url</label>
        <div className="row">
          <input id="long-url" className="field" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/long-link" />
          <button type="submit" className="btn" disabled={isCreating}>{isCreating ? "shortening…" : "shorten →"}</button>
        </div>
        <label className="check">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          list in public recent links
        </label>
        <button type="button" className="toggle" onClick={() => setShowCustom(!showCustom)} aria-expanded={showCustom}>
          {showCustom ? "− hide custom alias" : "+ custom alias"}
        </button>
        {showCustom && (
          <>
            <label htmlFor="custom-alias">alias</label>
            <div>
              <div className="field alias">
                <span>s.pcstyle.dev/</span>
                <input id="custom-alias" type="text" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} placeholder="your-alias" pattern="^[a-zA-Z0-9_-]{1,64}$" maxLength={64} />
              </div>
              <p className="hint">1-64 characters: letters, numbers, dashes and underscores</p>
            </div>
          </>
        )}
      </form>

      {error && <p className="err" role="alert">{error}</p>}

      {createdLink && (
        <div className="created" role="status">
          <span className="ok">link created</span>
          <span className="main"><span className="name">{createdLink.shortUrl}</span></span>
          <button type="button" className={copiedUrl === createdLink.shortUrl ? "ico on" : "ico"} onClick={() => copyToClipboard(createdLink.shortUrl)} aria-label="copy short link" title="copy short link">
            <Pix name={copiedUrl === createdLink.shortUrl ? "check" : "copy"} />
          </button>
        </div>
      )}

      {recentLinks && recentLinks.length > 0 && (
        <>
          <h3 className="sect">recent links</h3>
          <ul className="rows">
            {recentLinks.map((link) => {
              const shortUrl = `https://s.pcstyle.dev/${link.shortCode}`;
              return (
                <li key={link._id}>
                  <span className="main">
                    <span className="name">s.pcstyle.dev/{link.shortCode}</span>
                    <span className="sub">{link.url}</span>
                  </span>
                  <span className="meta">{link.clicks} clk</span>
                  <span className="meta opt">{formatDate(link.createdAt)}</span>
                  <span className="acts">
                    <button type="button" className={copiedUrl === shortUrl ? "ico on" : "ico"} onClick={() => copyToClipboard(shortUrl)} aria-label="copy short link" title="copy short link">
                      <Pix name={copiedUrl === shortUrl ? "check" : "copy"} />
                    </button>
                    <a className="ico" href={link.url} target="_blank" rel="noopener noreferrer" aria-label="open original link" title="open original link">
                      <Pix name="open" />
                    </a>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};
