import { createClient, RedisClient } from 'redis';
import * as jwt from "jsonwebtoken";
import config from "../config";
import { promisify } from 'util';

class CacheManager {

    private KEY_PREFIX: string = 'JWT-BLACKLIST:';
    private static instance : CacheManager;
    private readonly redisClient: RedisClient;
    private readonly getTokenRevoked: any;
    private readonly revokeToken: any;

    private constructor() {
        this.redisClient = this.createRedisClient();
        this.getTokenRevoked =  promisify(this.redisClient.get).bind(this.redisClient);
        this.revokeToken = promisify(this.redisClient.set).bind(this.redisClient);
    }

    private createRedisClient(): RedisClient {
        const redisClient: RedisClient = createClient(config.redis.port, config.redis.host);

        redisClient.on('connect', function() {
            console.log('Redis client connected');
        });

        redisClient.on('error', function (error) {
            console.log(`Something went wrong: ${error}`);
        });

        return redisClient;
    }

    static getInstance() {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }

    async isTokenRevoked(token: string): Promise<boolean> {
        const isRevoked = await this.getTokenRevoked(this.KEY_PREFIX + token);
        return !!isRevoked;
    }

    async addTokenInBlackList(token: string) {
        const jwtPayload = <any> jwt.verify(token, config.jwtSecret);
        const secondsToExpire = jwtPayload.exp - (Date.now()/1000);
        await this.revokeToken(this.KEY_PREFIX + token, token, 'EX', Math.round(secondsToExpire));
    }
}

export default CacheManager;