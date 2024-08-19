const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString } = require("graphql");

const UserType = require("./TypeDefinitions/UserType");
const PostType = require("./TypeDefinitions/PostType");
const AuthType = require("./TypeDefinitions/AuthType");

const User = require("../models/user");
const Post = require("../models/post");

const { resolverCreateUser, resolverLogin, resolverCreatePost } = require('./resolver');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hello: {
            type: GraphQLString,
            resolve(obj, args, context, info) {
                return 'hello world';
            }
        },

        getUsers: {
            type: new GraphQLList(UserType),
            async resolve() {
                const users = await User.find();
                return users;
            }
        },

        login: {
            type: AuthType,
            args: {
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                }
            },
            async resolve(req, args) {
                return await resolverLogin(args);
            }
        },

        getPosts: {
            type: new GraphQLList(PostType),
            args: {
                id: {
                    type: GraphQLString
                }
            },
            async resolve(req, args) {
                const posts = await Post.find({ creator: args.id }).populate('creator');
                return posts;
            }
        }
    }
});

const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        createUser: {
            type: UserType,
            args: {
                email: {
                    type: GraphQLString
                },
                name: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                }
            },
            async resolve(source, args, context, info) {
                return await resolverCreateUser(args);
            }
        },

        createPost: {
            type: PostType,
            args: {
                userId: {
                    type: GraphQLString
                },
                title: {
                    type: GraphQLString
                },
                content: {
                    type: GraphQLString
                },
                imageUrl: {
                    type: GraphQLString
                }
            },
            async resolve(source, args, context, info) {
                return await resolverCreatePost(args);
            }
        },

        deletePost: {
            type: PostType,
            args: {
                id: {
                    type: GraphQLString
                },
                userId: {
                    type: GraphQLString
                }
            },
            async resolve(source, args, context, info) {
                const post = await Post.findById(args.id);

                if (!post) {
                    const error = new Error('post not found');
                    error.code = 401;
                    throw error;
                }

                if (post.creator.toString() !== args.userId.toString()) {
                    const error = new Error('invalid user for this post');
                    error.code = 401;
                    throw error;
                }

                const deletedPost = await Post.findByIdAndDelete(args.id);

                const user = await User.findById(args.userId);

                user.posts = user.posts.filter(i => i.toString() !== args.id.toString());

                await user.save();

                return deletedPost;
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});

module.exports = schema;