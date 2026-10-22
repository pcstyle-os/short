import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    links: defineTable({
        // The original long URL
        url: v.string(),
        // Short code (e.g., "abc123")
        shortCode: v.string(),
        // Optional custom alias
        customAlias: v.optional(v.string()),
        // Click count
        clicks: v.number(),
        // Creation timestamp
        createdAt: v.number(),
        // Optional expiration timestamp
        expiresAt: v.optional(v.number()),
        // Creator identifier (could be IP or user ID)
        creatorId: v.optional(v.string()),
        // Listed in the public recent-links list; unset means private
        isPublic: v.optional(v.boolean()),
    })
        .index("by_shortCode", ["shortCode"])
        .index("by_public_createdAt", ["isPublic", "createdAt"]),
});
