const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");

const schema = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello123: TestData!
    }

    schema {
        query: RootQuery
    }
`)

module.exports = rootValue => {
    return createHandler({
        schema: schema,
        rootValue: rootValue
    });
}