import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import { config } from '@/config'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis

  constructor() {
    this.client = new Redis(config.redis)
  }

  onModuleDestroy() {
    this.client.disconnect()
  }

  /**
   * Retrieves a value from Redis and deserializes it from JSON.
   *
   * @param key The key to retrieve.
   * @returns The deserialized value, or null if the key doesn't exist.
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key)
    if (!value) {
      return null
    }
    try {
      return JSON.parse(value) as T
    } catch (e) {
      console.error(`Failed to parse JSON from Redis for key: ${key}`, e)
      return null
    }
  }

  /**
   * Stores a value in Redis after serializing it to JSON.
   *
   * @param key The key to store the value under.
   * @param value The value to store. It will be JSON.stringified.
   * @param ttl Optional time-to-live in seconds.
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value)
    if (ttl) {
      await this.client.set(key, serializedValue, 'EX', ttl)
    } else {
      await this.client.set(key, serializedValue)
    }
  }

  /**
   * Deletes one or more keys from Redis.
   *
   * @param keys A single key or an array of keys to delete.
   */
  async del(keys: string | string[]): Promise<number> {
    const keysToDelete = Array.isArray(keys) ? keys : [keys]
    if (keysToDelete.length === 0) {
      return 0
    }
    return this.client.del(...keysToDelete)
  }

  /**
   * Retrieves Redis server information.
   *
   * @returns A string containing the server information.
   */
  async getInfo(): Promise<string> {
    return this.client.info()
  }

  /**
   * Flushes the entire Redis database.
   * Be careful with this in production!
   */
  async flushDb(): Promise<'OK'> {
    return this.client.flushdb()
  }
}
