const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Jen',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Mike',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Adam',
            room: 'Node Course'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Ashish',
            room: 'Office'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var user = users.removeUser('1');
        expect(users).toExclude(user);
    });

    it('should not remove a user', () => {
        var user = users.removeUser(5);
        expect(user).toNotExist();
    });

    it('should find a user', () => {
        var user = users.getUser('1');
        expect(user.id).toBe('1');
    });

    it('should not find a user', () => {
        var user = users.getUser('99');
        expect(user).toNotExist();
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Jen', 'Adam']);
    });

    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Mike']);
    });
});