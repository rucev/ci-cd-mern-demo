require('dotenv').config();
const { expect } = require('chai');
const registerUser = require('./registerUser');
const { User } = require('../data/models');
const mongoose = require('mongoose');
const {
    errors: { DuplicityError, ContentError, FormatError },
} = require('common');
const bcrypt = require('bcryptjs');

console.log('ENV MONGO URL:', process.env.MONGODB_URI)

describe('registerUser', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
    });

    beforeEach(async () => {
        await User.deleteMany();
    })

    after(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it('should create a user', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = `Password${Math.random()}`;


        await registerUser(email, password);

        const createdUser = await User.findOne({ email });

        const match = await bcrypt.compare(password, createdUser.password);

        expect(createdUser.email).to.equal(email);
        expect(match).to.equal(true);
    });

    it('should fail on user already registered', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = `Password${Math.random()}`;


        await registerUser(email, password);

        try {
            await registerUser(email, password);
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError);
            expect(error.message).to.equal(`user with email ${email} already exists`);
        }
    });

    it('should fail on invalid email type', async () => {
        const email = Math.floor(Math.random() * 999);
        const password = `Password${Math.random()}`;

        await expect(() => registerUser(email, password)).to.throw(TypeError, 'email is not a string');
    });

    it('should fail on empty email', async () => {
        const email = '';
        const password = `Password${Math.random()}`;

        await expect(() => registerUser(email, password)).to.throw(ContentError, 'email is empty');
    });

    it('should fail on incorrect email format', async () => {
        const email = `User${Math.floor(Math.random() * 999)}`;
        const password = `Password${Math.random()}`;

        await expect(() => registerUser(email, password)).to.throw(FormatError, 'email format is not valid');
    });

    it('should fail on invalid password type', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = Math.random();

        await expect(() => registerUser(email, password)).to.throw(TypeError, 'password is not a string');
    });

    it('should fail on password to short', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = 'hi';

        await expect(() => registerUser(email, password)).to.throw(RangeError, 'password length lower than 4 characters');
    });

    it('should fail on empty password', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = '    ';

        await expect(() => registerUser(email, password)).to.throw(ContentError, 'password is empty');
    });
});