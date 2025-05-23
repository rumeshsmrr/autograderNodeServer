const express = require("express");
const router = express.Router();
const {
  evaluateAndSaveSubmission,
  getAllSubmissions,
  getSubmissionById,
  getAllSubmissionsByAssignment,
  getAllSubmissionsByStudent,
  getSingleSubmissionForStudent,
  manualUpdateSubmission,
  deleteSubmissionById, // ✅ Import the new controller
} = require("../controllers/submissionController");

// Evaluate and save a submission
router.post("/evaluate", evaluateAndSaveSubmission);

// Get routes
router.get("/getAll", getAllSubmissions);
router.get("/:id", getSubmissionById);
router.get("/assignment/:assignment_id", getAllSubmissionsByAssignment);
router.get("/student/:student_id", getAllSubmissionsByStudent);
router.get("/student/:_id", getSingleSubmissionForStudent);

// ✅ Add the manual update route (MUST begin with "/")
router.put("/manual-update/:id", manualUpdateSubmission);
router.delete("/:id", deleteSubmissionById); // ✅ Add the delete route
module.exports = router;
