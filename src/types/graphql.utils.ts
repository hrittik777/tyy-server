import { Redis } from "ioredis";
export interface ResolverMap {
    [key: string]: {
        [key: string]: (
            key: any,
            parent: any,
            context: {
                redis: Redis,
                url: string
            },
            info: any
        ) => any
    }
}