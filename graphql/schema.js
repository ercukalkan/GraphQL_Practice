const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");

const schema = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        mutation: RootMutation
    }
`)

module.exports = rootValue => {
    return createHandler({
        schema: schema,
        rootValue: rootValue
    });
}