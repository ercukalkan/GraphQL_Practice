const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
    resolverCreateUser: async function (args) {
        const errors = [];

        if (!validator.isEmail(args.email)) {
            errors.push({ message: 'email is invalid' });
        }

        if (validator.isEmpty(args.password) ||
            !validator.isLength(args.password, { min: 5 })) {
            errors.push({ message: 'password is too short' });
        }

        if (errors.length > 0) {
            const error = new Error('invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({ email: args.email });

        if (existingUser) {
            const error = new Error('user exists already');
            throw error;
        }

        const hashedPw = await bcrypt.hash(args.password, 12);

        const newUser = new User({
            email: args.email,
            name: args.name,
            password: hashedPw
        });

        const createdUser = await newUser.save();

        return createdUser;
    },

    resolverLogin: async function (args) {
        const user = await User.findOne({ email: args.email });

        if (!user) {
            const error = new Error('no user found');
            error.code = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(args.password, user.password);

        if (!isEqual) {
            const error = new Error('wrong password');
            error.code = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            'secret789',
            {
                expiresIn: '1h'
            }
        );

        return {
            token: token,
            userId: user._id.toString()
        };
    }
}