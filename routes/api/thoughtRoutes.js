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

// Creates a new thought
// push the created thought's `_id` to the associated user's `thoughts` array field
// router.post('/', (req, res) => {
//     Thought.create(req.body)
//         .then((thought) => res.json(thought))
//         .catch((err) => res.status(500).json(err))
// });

// Updates a thought
router.put('/:thoughtId', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought with that ID!'})
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
});

// Deletes a thought
router.delete("/:thoughtId", (req, res) => {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => {
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
                
        })
        .then(() => res.json({ message: 'Thought successfully deleted!' }))
        .catch((err) => res.status(500).json(err));
});

// Creates a reaction
// router.post("/:thoughtId/reactions", (req, res) => {

// })

// Deletes a reaction
// router.delete("/:thoughtId/reactions", (req, res) => {

// })

module.exports = router;