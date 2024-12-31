import mongoose, { Document, Model, Schema } from "mongoose";
import { Rates } from "@/_types";

interface RateDocument extends Document {
    data: Rates;
    updatedAt: Date;
}

type RateModel = Model<RateDocument>;

const schema = new Schema<RateDocument>({
    data: {
        type: Object,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Rate = (mongoose.models.Rate as RateModel) || mongoose.model<RateDocument>("Rate", schema);

export default Rate;