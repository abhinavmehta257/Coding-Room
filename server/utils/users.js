// [{
//   id: 'sdfgsdfgsdfg',
//   name: 'WDJ',
//   room: 'node js'
// }]

//start adding roomid, room name


class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, roomId) {
    let user = {id, name, roomId};
    this.users.push(user);
    return user;
  }

  getUserList (roomId) {
    let users = this.users.filter((user) => user.roomId === roomId);
    let namesArray = users.map((user) => user);

    return namesArray;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  removeUser(id) {
    let user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

}

module.exports = {Users};
