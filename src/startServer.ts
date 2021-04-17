import { GraphQLServer } from "graphql-yoga";
import { redis } from './redis';
import { createTypeORMConnection } from "./utils/create-typeORM-connection";
import { confirmEmail } from "./routes/confirm-email";
import { genSchema } from "./utils/gen-schema";

export const startServer = async () => {
    const server = new GraphQLServer({
        schema: genSchema(),
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