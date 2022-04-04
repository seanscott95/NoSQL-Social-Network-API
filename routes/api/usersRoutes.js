const router = require('express').Router();
const { User, Thought } = require('../../models');

// Gets all users
router.get('/', (req, res) => {
    User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err))
});

// Gets a single user
router.get('/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
});

// Creates a new user
router.post('/', (req, res) => {
    User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err))
});

// Updates a user
router.put('/:userId', (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with that ID!' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
});

// Deletes a user
router.delete("/:userId", (req, res) => {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((user) => {
            !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : Thought.deleteMany({ _id: { $in: user.thought } })

        })
        .then(() => res.json({ message: 'User successfully deleted!' }))
        .catch((err) => res.status(500).json(err));
});

// Adds a new friend to the users friend list
router.post("/:userId/friends/:friendId", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { runValidators: true, new: true }
    )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
})

// Removes a friend from a users friend list
router.delete("/:userId/friends/:friendId", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
    )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
})

module.exports = router;