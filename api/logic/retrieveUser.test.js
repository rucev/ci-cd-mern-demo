require('dotenv').config();
const { expect } = require('chai');
const retrieveUser = require('./retrieveUser');
const { User } = require('../data/models');
const mongoose = require('mongoose');
const { errors: { TypeError, ExistenceError } } = require('common');

describe('retrieveUser', () => {
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

    it('should get user by id with valid userId', async () => {
        const email = `User${Math.floor(Math.random() * 999)}@mail.com`;
        const password = `Password${Math.random()}`;

        const user = { email, password };

        const createdUser = await User.create(user);

        const fetchedUserEmail = await retrieveUser(createdUser.id);

        expect(fetchedUserEmail).to.be.a('string');
        expect(fetchedUserEmail).to.equal(user.email);
    });

    it('should fail on user not found', async () => {
        const id = (new mongoose.Types.ObjectId()).toString();
        try {
            await retrieveUser(id);
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError);
            expect(error.message).to.equal('user not found');
        }
    });

    it('should fail on invalid id type', async () => {
        const invalidId = 1234;
        await expect(() => retrieveUser(invalidId)).to.throw(TypeError, 'userId is not a string');
    });

    it('should fail on empty id', async () => {
        const emptyId = '   ';
        await expect(() => retrieveUser(emptyId)).to.throw(TypeError, 'userId is empty');
    });

});