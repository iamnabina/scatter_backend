const db = require("../config/db.js");

const endowmentIdMapping = {
  1: "True",
  2: "Good",
  3: "Beautiful",
  4: "Prosperous",
  5: "Sustainable",
  6: "Just and Well-Ordered",
};

const dailyWorkCategoryMapping = {
  0: "Employed",
  1: "SAH Parent",
  2: "Retired",
  3: "Student",
  4: "Homemaker",
  5: "Caregiver",
  6: "Volunteer",
  7: "Unemployed",
};
const getEndowment = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          e.score AS endowment_score, 
          COUNT(e.user_assessment_id) AS endowment_count, 
          COALESCE(w.score, 0) AS work_score, 
          COUNT(w.user_assessment_id) AS work_count
      FROM 
          (SELECT 
              uav.score, 
              uav.user_assessment_id 
          FROM 
              users_assessments_82_variables uav
          JOIN 
              users_assessments ua ON uav.user_assessment_id = ua.id 
          WHERE 
              uav.variable = 'endowment' AND ua.status = 'complete') e
      LEFT JOIN 
          (SELECT 
              wav.score, 
              wav.user_assessment_id 
          FROM 
              users_assessments_82_variables wav
          JOIN 
              users_assessments ua ON wav.user_assessment_id = ua.id 
          WHERE 
              wav.variable = 'work' AND ua.status = 'complete') w
      ON 
          e.user_assessment_id = w.user_assessment_id 
      GROUP BY 
          e.score, w.score 
      ORDER BY 
          e.score, w.score;
    `);

    const resultMap = {};

    rows.forEach((row) => {
      const endowment = endowmentIdMapping[row.endowment_score];
      const workScore = row.work_score;
      const workCount = row.work_count;

      //initialization if it doesn't exists
      if (!resultMap[endowment]) {
        resultMap[endowment] = {
          endowment: endowment,
          endowment_count: 0,
          daily_work: [],
        };
      }

      // Update the endowment counter
      resultMap[endowment].endowment_count += row.endowment_count;

      // Add the work score of categories and count
      if (workScore !== null) {
        const workCategory = dailyWorkCategoryMapping[workScore];

        // Check if work category already exists
        const existingWork = resultMap[endowment].daily_work.find(
          (work) => work.work_score === workCategory
        );

        if (existingWork) {
          existingWork.work_count += workCount;
        } else {
          resultMap[endowment].daily_work.push({
            work_score: workCategory,
            work_count: workCount,
          });
        }
      }
    });

    const finalResult = Object.values(resultMap);

    return res.status(200).json({ success: true, data: finalResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Something went Wrong !" });
  }
};

module.exports = { getEndowment };
