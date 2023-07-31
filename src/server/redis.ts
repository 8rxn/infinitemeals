import { Redis } from '@upstash/redis'

if(!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN){
    throw new Error("Redis credentials not found")
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token:process.env.UPSTASH_REDIS_REST_TOKEN,
})

