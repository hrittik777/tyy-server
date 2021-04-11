export interface ResolverMap {
    [key: string]: {
        [key: string]: (key: any, parent: any, context: {}, info: any) => any
    }
}