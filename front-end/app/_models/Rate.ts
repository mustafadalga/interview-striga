import mongoose, { Document, Model } from "mongoose";
import { Rates } from "@/_types";

interface RateDocument extends Document {
    _id: mongoose.Schema.Types.ObjectId
    data: Rates;
}

type RateModel = Model<RateDocument>


const schema = new mongoose.Schema<RateDocument>({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    data: {
        type: Object,
        required: true,
    },
});

const Rate = mongoose.models.Rate as RateModel || mongoose.model<RateDocument, RateModel>("Rate", schema);

export default Rate