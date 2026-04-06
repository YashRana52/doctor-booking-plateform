import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import Patient from "../model/Patient.js";
import { body } from "express-validator";
import { computeAgeFromDob } from "../utils/date.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

//  Get Patient Profile

router.get("/me", authenticate, requireRole("patient"), async (req, res) => {
  try {
    // Logged-in user ke ID se patient ka data nikal rahe hain
    const patient = await Patient.findById(req.user._id).select(
      "-password -googleId",
    );
    res.ok(patient, "Profile Fetched");
  } catch (error) {
    res.serverError("Failed to fetch profile", [error.message]);
  }
});

//  Update Patient Profile

router.put(
  "/onboarding/update",
  authenticate,
  requireRole("patient"),
  [
    body("name").optional().notEmpty(),
    body("phone").optional().isString(),
    body("dob").optional().isISO8601(),
    body("age").optional().notEmpty(),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("bloodGroup").optional().isString(),
    body("emergencyContact").optional().isObject(),
    body("emergencyContact.name").optional().isString().notEmpty(),
    body("emergencyContact.phone").optional().isString().notEmpty(),
    body("emergencyContact.relationship").optional().isString().notEmpty(),
    body("medicalHistory").optional().isObject(),
    body("medicalHistory.allergies").optional().isString().notEmpty(),
    body("medicalHistory.currentMedications").optional().isString().notEmpty(),
    body("medicalHistory.chronicConditions").optional().isString().notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const updated = { ...req.body };

      // Agar dob diya gaya ho, to automatically age calculate karo
      if (updated.dob) {
        updated.age = computeAgeFromDob(updated.dob);
      }

      delete updated.password;
      updated.isVerified = true;

      // Patient profile update kar rahe hain
      const patient = await Patient.findByIdAndUpdate(req.user._id, updated, {
        new: true,
      }).select("-password -googleId");

      res.ok(patient, "Profile updated");
    } catch (error) {
      console.error("Update failed:", error);
      res.serverError("Update failed", [error.message]);
    }
  },
);

//ai suggestion

router.post("/symptom-suggestions", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("🔥 Symptom Suggestion API Hit");
    console.log("📩 Symptom Received:", message);

    const prompt = `
You are a medical assistant.

Task:
Generate 3 short realistic symptom descriptions a patient might write.

Rules:
- Expand the symptom naturally (duration, type, severity)
- Each suggestion under 8 words
- No numbering
- No extra text
- Return comma-separated suggestions only

Symptom: "${message}"
`;

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await aiResponse.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("📝 Gemini Text:", text);

    let suggestions = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // ✅ Dynamic fallback based on message
    if (!suggestions.length) {
      const msg = message.toLowerCase();

      if (msg.includes("fever")) {
        suggestions = [
          "high fever since 2 days",
          "mild fever with chills",
          "fever and sweating at night",
        ];
      } else if (msg.includes("cough")) {
        suggestions = [
          "dry cough for 3 days",
          "cough worse at night",
          "cough with slight chest pain",
        ];
      } else if (msg.includes("headache")) {
        suggestions = [
          "severe headache since morning",
          "headache with light sensitivity",
          "persistent headache for 2 days",
        ];
      } else if (msg.includes("fatigue")) {
        suggestions = [
          "feeling tired all day",
          "low energy since morning",
          "extreme fatigue after small tasks",
        ];
      } else if (msg.includes("sore throat")) {
        suggestions = [
          "pain while swallowing food",
          "sore throat since yesterday",
          "throat irritation with dryness",
        ];
      } else if (msg.includes("body pain")) {
        suggestions = [
          "body ache since morning",
          "muscle pain all over body",
          "joint pain with stiffness",
        ];
      } else {
        // generic fallback
        suggestions = [
          "symptoms since last 2 days",
          "feeling unwell and weak",
          "mild discomfort in body",
        ];
      }
    }

    return res.json({
      success: true,
      data: {
        suggestions,
      },
    });
  } catch (error) {
    console.error("AI error:", error);

    return res.status(500).json({
      message: "AI suggestion error",
      suggestions: [],
    });
  }
});

export default router;
