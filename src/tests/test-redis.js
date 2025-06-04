// testRedisConnection.js
import Redis from "ioredis";

const redis = new Redis(
  "rediss://default:aP4vKAi7MPwQei4ljCrsrUZydFfvAK3D@redis-10843.c258.us-east-1-4.ec2.redns.redis-cloud.com:10843"
);

redis
  .set("test-key", "hello")
  .then(() => redis.get("test-key"))
  .then((val) => {
    console.log("✅ Redis Connected:", val);
    redis.disconnect();
  })
  .catch((err) => {
    console.error("❌ Redis Error:", err);
  });

// node src/tests/test-redis.js
