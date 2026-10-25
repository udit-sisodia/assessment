import mongoose from "mongoose"

const incidentSchema = new mongoose.Schema(
  {
    incident_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    establishment: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    incident_date: {
      type: Date,
      required: true,
    },

    incident_time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "Under Investigation","Under Review"],
      default: "Open",
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },

    hospitalized: {
      type: Boolean,
      default: false,
    },

    fatalities: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const incidentModel = mongoose.model("Incident", incidentSchema);

export default incidentModel;