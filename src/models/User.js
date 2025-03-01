const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, },
    dob: { type: Date,  },
    gender: { type: String, enum: ["Male", "Female", "Other"],  },
    fatherName: { type: String, },
    motherName: { type: String, },
    spouseName: { type: String },
    nationality: { type: String, },
    aadharNo: { type: String, unique: true },
    passportDetails: {
      passportNo: { type: String,},
      dateOfIssue: { type: Date },
      dateOfExpiry: { type: Date },
    },
    address: {
      presentAddress: { type: String, },
      city: { type: String,  },
      state: { type: String,  },
      pincode: { type: String, },
    },
    travelHistory: { type: [String] }, // Array for multiple travel records
    emergencyDetails: {
      contactName: { type: String, },
      relationship: { type: String,  },
      contactNo: { type: String, },
      address: { type: String,  },
    },
    declaration: { type: Boolean,  }, // Checkbox
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
