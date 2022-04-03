const router = require('express').Router();
const { User, Thought } = require('../../models');

// Gets all thoughts
router.get('/', (req, res) => {
    Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err))
})

// Gets a single thought
router.get('/:thoughtId', (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
});

module.exports = router;