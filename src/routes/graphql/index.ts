import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from "graphql";
import depthLimit from 'graphql-depth-limit'
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import userResolvers from './resolvers/userResolvers.js';
import memberTypeResolvers from './resolvers/memberTypeResolvers.js';
import postResolvers from './resolvers/postResolvers.js';
import profileResolvers from './resolvers/profileResolvers.js';
import { buildDataLoaders } from './dataLoaderBuilder.js';

const rootValue = {
    ...userResolvers,
    ...memberTypeResolvers,
    ...postResolvers,
    ...profileResolvers
};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const { prisma } = fastify;

    const dataLoaders = buildDataLoaders(prisma);

    fastify.route({
        url: '/',
        method: 'POST',
        schema: {
            ...createGqlResponseSchema,
            response: {
                200: gqlResponseSchema,
            },
        },
        async handler(req) {
            const errors = validate(gqlSchema, parse(req.body.query), [depthLimit(5)]);

            if (errors.length > 0) {
                return { errors };
            };

            const response = await graphql({
                schema: gqlSchema,
                source: req.body.query,
                rootValue,
                variableValues: req.body.variables,
                contextValue: { prisma, ...dataLoaders }
            });
            return response;
        },
    });
};

export default plugin;
