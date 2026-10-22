import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a random short code
function generateShortCode(length: number = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Validate URL format
function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

// Create a new short link
export const createLink = mutation({
    args: {
        url: v.string(),
        customAlias: v.optional(v.string()),
        // Private unless the creator opts in to the public list
        isPublic: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Validate URL
        if (!isValidUrl(args.url)) {
            throw new Error("Invalid URL format. Must start with http:// or https://");
        }

        // Check if custom alias is provided and available
        let shortCode: string;

        if (args.customAlias) {
            // Validate custom alias (letters, numbers, _ and -, 1-64 chars)
            if (!/^[a-zA-Z0-9_-]{1,64}$/.test(args.customAlias)) {
                throw new Error("Custom alias must be 1-64 characters: letters, numbers, _ and -");
            }

            // Check if already exists
            const existing = await ctx.db
                .query("links")
                .withIndex("by_shortCode", (q) => q.eq("shortCode", args.customAlias!))
                .first();

            if (existing) {
                throw new Error("This custom alias is already taken");
            }

            shortCode = args.customAlias;
        } else {
            // Generate unique short code
            let attempts = 0;
            do {
                shortCode = generateShortCode();
                const existing = await ctx.db
                    .query("links")
                    .withIndex("by_shortCode", (q) => q.eq("shortCode", shortCode))
                    .first();

                if (!existing) break;
                attempts++;
            } while (attempts < 10);

            if (attempts >= 10) {
                throw new Error("Failed to generate unique short code");
            }
        }

        // Create the link
        const linkId = await ctx.db.insert("links", {
            url: args.url,
            shortCode,
            customAlias: args.customAlias,
            isPublic: args.isPublic ?? false,
            clicks: 0,
            createdAt: Date.now(),
        });

        return {
            id: linkId,
            shortCode,
            shortUrl: `https://s.pcstyle.dev/${shortCode}`,
        };
    },
});

// Get link by short code
export const getLinkByShortCode = query({
    args: {
        shortCode: v.string(),
    },
    handler: async (ctx, args) => {
        const link = await ctx.db
            .query("links")
            .withIndex("by_shortCode", (q) => q.eq("shortCode", args.shortCode))
            .first();

        return link;
    },
});

// Increment click count
export const incrementClicks = mutation({
    args: {
        shortCode: v.string(),
    },
    handler: async (ctx, args) => {
        const link = await ctx.db
            .query("links")
            .withIndex("by_shortCode", (q) => q.eq("shortCode", args.shortCode))
            .first();

        if (link) {
            await ctx.db.patch(link._id, {
                clicks: link.clicks + 1,
            });
        }
    },
});

// Get recent public links (for display). Private links never appear here.
export const getRecentLinks = query({
    args: {},
    handler: async (ctx) => {
        const links = await ctx.db
            .query("links")
            .withIndex("by_public_createdAt", (q) => q.eq("isPublic", true))
            .order("desc")
            .take(10);

        return links;
    },
});

// Get link stats
export const getLinkStats = query({
    args: {
        shortCode: v.string(),
    },
    handler: async (ctx, args) => {
        const link = await ctx.db
            .query("links")
            .withIndex("by_shortCode", (q) => q.eq("shortCode", args.shortCode))
            .first();

        if (!link) return null;

        return {
            url: link.url,
            shortCode: link.shortCode,
            clicks: link.clicks,
            createdAt: link.createdAt,
        };
    },
});
