require('dotenv').config();
const { expect } = require('chai');
const authenticateUser = require('./authenticateUser');
const { User } = require('../data/models');
const mongoose = require('mongoose');
const {
    errors: { AuthError, ContentError, ExistenceError, FormatError },
} = require('common');
const bcrypt = require('bcryptjs');

describe('authenticateUser', () => {
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

    it('should login a user with correct credentials', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = `Password${Math.random()}`;

        const cryptPassword = bcrypt.hashSync(password, 10);

        const user = { email, password: cryptPassword };

        await User.create(user);

        const userId = await authenticateUser(email, password);

        expect(userId).to.be.a('string').and.not.empty;
    });

    it('should fail on user not found', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = `Password${Math.random()}`;

        try {
            await authenticateUser(email, password);
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError);
            expect(error.message).to.equal('user not found');
        }
    });

    it('should fail on wrong credentials', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = `Password${Math.random()}`;

        const cryptPassword = bcrypt.hashSync(password, 10);

        const user = { email, password: cryptPassword };

        await User.create(user);

        try {
            await authenticateUser(email, 'not the correct password');
        } catch (error) {
            expect(error).to.be.instanceOf(AuthError);
            expect(error.message).to.equal('wrong credentials');
        }
    });

    it('should fail on invalid email type', async () => {
        const email = Math.floor(Math.random() * 999);
        const password = `Password${Math.random()}`;

        await expect(() => authenticateUser(email, password)).to.throw(TypeError, 'email is not a string');
    });

    it('should fail on invalid email format', async () => {
        const email = `NotAnEmail${Math.floor(Math.random() * 999)}`;
        const password = `Password${Math.random()}`;

        await expect(() => authenticateUser(email, password)).to.throw(FormatError, 'email format is not valid');
    });


    it('should fail on empty email', async () => {
        const email = '';
        const password = `Password${Math.random()}`;

        await expect(() => authenticateUser(email, password)).to.throw(ContentError, 'email is empty');
    });

    it('should fail on invalid password type', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = Math.random();

        await expect(() => authenticateUser(email, password)).to.throw(TypeError, 'password is not a string');
    });

    it('should fail on password to short', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = 'hi';

        await expect(() => authenticateUser(email, password)).to.throw(RangeError, 'password length lower than 4 characters');
    });

    it('should fail on empty password', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = ' ';

        await expect(() => authenticateUser(email, password)).to.throw(ContentError, 'password is empty');
    });
});