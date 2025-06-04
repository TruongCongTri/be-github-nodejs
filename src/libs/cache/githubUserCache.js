import NodeCache from "node-cache";

// Cache TTL is 3600 seconds = 1 hour
export const githubUserCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL
