const { Schema, model } = require('mongoose');

const thoughtSchema = new mongoose.Schema(
    {
        thoughtText: {
            type: String,
            required: [true, "Thought required"],
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                return date.toDateString()
            },
        },
        username: {
            type: String,
            required: [true, "Username required"],
        },
        reactions: {
            reactionId: {
                type: Schema.Types.ObjectId,
                default: () => new Types.ObjectId(),
            },
            reactionBody: {
                type: String,
            required: [true, "Reaction required"],
            minlength: 1,
            maxlength: 280,
            },
            username: {
                type: String,
                required: [true, "Username required"],
            },
            createdAt: {
                type: Date,
                default: Date.now,
                get: (date) => {
                    return date.toDateString()
                },
            },
        }
    },
    {
        toJSON: {
            virtauls: true,
            getters: true
        },
        id: false,
    }
);

thoughtSchema.virtaul("reactionCount", {
    ref: 'thought.reactions',
    count: true
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;