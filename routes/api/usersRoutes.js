const router = require('express').Router();
const { User, Thought } = require('../../models');

// Gets all users
router.get('/', (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err))
});

// Gets a single user
router.get('/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
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
                ? res.status(404).json({ message: 'No user with that ID!'})
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
});

// Deletes a user
router.delete("/:userId", (req, res) => {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((user) => {
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : Thought.deleteMany({ _id: { $in: user.thought } })
                
        })
        .then(() => res.json({ message: 'User successfully deleted!' }))
        .catch((err) => res.status(500).json(err));
});

// router.post("/:userId/friends/:friendId", (req, res) => {

// })

// router.delete("/:userId/friends/:friendId", (req, res) => {
    
// })

module.exports = router;