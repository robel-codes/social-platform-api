const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUser(req, res){
        User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    
    // get user by id
    getUserById({ params }, res){
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
        })
        .populate({
            path: 'friends',
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // add user
    addUser({ body }, res){
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    // update user by id
    updateUser({ params, body }, res){
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'No User with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // delete user  
    deleteUser({ params }, res){
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            console.log(dbUserData)
            dbUserData.thoughts.forEach(thoughArr => {
                Thought.findOneAndDelete({ _id: thoughArr })
                .then(dbThoughtData => console.log(dbThoughtData))
                .catch(err => {
                    console.log(err);
                })
            })
            res.json(dbUserData)
        })
        .catch(err => res.json(err));
    },

    // add friend
    addFriend({ params }, res){
        User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId }}, { new: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
    },

    // remove friend
    removeFriend({ params }, res){
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId }}, { new: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
    }
};

module.exports = userController;