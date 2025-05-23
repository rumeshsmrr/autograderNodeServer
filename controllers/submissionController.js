// const axios = require("axios");
const Submission = require("../Model/Submission");
const Assignment = require("../Model/Assignment"); // Import the Assignment model

const axios = require("axios"); // Ensure axios is imported

const dotenv = require("dotenv");
dotenv.config();

exports.evaluateAndSaveSubmission = async (req, res) => {
  try {
    const { assignment_id, student_id, answer_code, input_data } = req.body;

    if (!assignment_id || !student_id || !answer_code) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const assignment = await Assignment.findById(assignment_id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const reference_code = assignment.reference_code;
    const rubric = assignment.rubric;

    console.log("flask api url", process.env.FLASK_API_URL);

    // const flaskApiUrl = "http://13.48.25.19:5000/evaluate";
    const flaskApiUrl = `${process.env.FLASK_API_URL}/evaluate`;
    const requestData = {
      reference_code,
      answer_code,
      input_data,
      rubric,
    };

    console.log("📤 Sending request to Flask API:", requestData);

    const flaskResponse = await axios.post(flaskApiUrl, requestData, {
      timeout: 100000, // Set 5s timeout
    });

    const evaluationResult = flaskResponse.data;

    console.log("✅ Flask API Response:", evaluationResult);

    if (!evaluationResult || !evaluationResult.grades) {
      return res.status(500).json({
        success: false,
        message: "Unexpected response from Flask API",
        flaskResponse: evaluationResult,
      });
    }

    const submission = new Submission({
      assignment_id,
      student_id,
      submitted_code: answer_code,
      total_score: evaluationResult.final_score || 0,
      grades: evaluationResult.grades || {},
      detailed_results: evaluationResult.grades || {},
      code_similarity_percentage: evaluationResult.code_similarity_percentage,
      code_similarity_details: evaluationResult.code_similarity_details || {},
      syntax_errors: evaluationResult.syntax_errors || [],
    });

    await submission.save();

    return res.status(201).json({
      success: true,
      message: "Submission evaluated and saved successfully",
      data: submission,
    });
  } catch (error) {
    console.error("❌ Error during evaluation:", error);

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: "Flask API error",
        flaskError: error.response.data,
      });
    } else if (error.code === "ECONNABORTED") {
      return res.status(500).json({
        success: false,
        message: "Flask API request timed out",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};

//get all submissions
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//get single submission by ID
exports.getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all submition by assignment id
exports.getAllSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const submissions = await Submission.find({ assignment_id });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all submissions by student
exports.getAllSubmissionsByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

    const submissions = await Submission.find({ student_id });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//get single submission by ID for student
exports.getSingleSubmissionForStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.manualUpdateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grades } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    let total = 0;
    for (const key in grades) {
      total += grades[key];
    }

    submission.total_score = total;
    submission.grades = grades;
    submission.detailed_results = grades;

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Marks manually updated",
      data: submission,
    });
  } catch (error) {
    console.error("Manual update error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Submission.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting submission",
      error: error.message,
    });
  }
};
