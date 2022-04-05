const router = require('express').Router();
const { User, Thought } = require('../../models');

// Gets all thoughts
router.get('/', (req, res) => {
    Thought.find({})
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err))
})

// Gets a single thought
router.get('/:thoughtId', (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
});

// Creates a new thought
router.post('/', (req, res) => {
    Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought } },
                { new: true, runValidators: true }
            )
        })
        .then((thought) =>
            !thought
                ? res.status(404).json({
                    message: 'No thought found with that ID'
                })
                : res.json({ message: 'Thought successfully created' })
        )
        .catch((err) => res.status(500).json(err))
});

// Updates a thought
router.put('/:thoughtId', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID!' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
});

// Deletes a thought
router.delete("/:thoughtId", (req, res) => {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => {
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID' })
                : res.json({ message: 'Thought successfully deleted!' })
        })
        .catch((err) => res.status(500).json(err));
});

// Creates a reaction stored in a thoughts reactions field
router.post("/:thoughtId/reactions", (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
    )
        .then((thought) => {
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID' })
                : res.json(thought)
        })
        .catch((err) => res.status(500).json(err));
});

// Deletes a reaction stored in a thoughts reactions field
router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
    )
        .then((thought) => {
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID' })
                : res.json({ message: 'Reaction successfully deleted' })
        })
        .catch((err) => res.status(500).json(err));
});

module.exports = router;