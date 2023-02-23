class Users{
    constructor(){
        this.users = [];
    }

    addUser(id,room,name){
        let user = {id,room,name};
        this.users.push(user);
        return user;
    }

    getUserList(room){
        let userList = this.users.filter((e)=> e.room === room);
        let nameArr = userList.map((user)=>user.name);

        return nameArr;
    }

    getUser(id){
        return this.users.filter((user)=> user.id === id)[0];
    }

    removeUser(id){
        let user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user)=>user.id !== id);
        }

        return user;
    }

}

module.exports = {Users}