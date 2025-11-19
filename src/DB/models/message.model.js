import { model, Schema } from "mongoose";

export const messageSchema = new Schema(
    {
        content: {
            type: String,
        },
        to: {
            type: Object,
            ref: "user",
            required: true,
        },
        from: {
            type: Object,
            ref: "user",
        },
    },
    { timestamps: true }
);

export const messageModel = model("message", messageSchema);
