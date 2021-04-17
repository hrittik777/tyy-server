import * as path from "path";
import * as fs from "fs";
import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
import { redis } from './redis';

import { createTypeORMConnection } from "./utils/create-typeORM-connection";
import { confirmEmail } from "./routes/confirm-email";

export const startServer = async () => {
    const schemas: GraphQLSchema[] = [];
    const folders = fs.readdirSync(path.join(__dirname, "./modules"));

    folders.forEach(folder => {
        const { resolvers } = require(`./modules/${folder}/resolvers`);
        const typeDefs = importSchema(path.join(__dirname, `./modules/${folder}/schema.graphql`));

        schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
    });

    const server = new GraphQLServer({
        schema: mergeSchemas({ schemas }),
        context: ({ request }) => ({
            redis,
            url: request.protocol + '://' + request.get('host')
        })
    });

    server.express.get('/confirm/:id', confirmEmail);

    await createTypeORMConnection();
    const app = await server.start({
        port: process.env.NODE_ENV === "test" ? 6000 : 4000
    });

    console.log("Server is running on localhost:4000");
    return app;
};