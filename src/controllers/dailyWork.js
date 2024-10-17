const db = require("../config/db.js");

const dailyWorkCategories = {
  1: "Employed",
  2: "SAH Parent",
  3: "Retired",
  4: "Student",
  5: "Homemaker",
  6: "Caregiver",
  7: "Voluneer",
  8: "Unemployed",
};

const getDailyWork = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
        SELECT 
      uav.score as category, 
      COUNT(*) AS score_count 
      FROM 
          users_assessments_82_variables uav
      JOIN 
          users_assessments ua ON uav.user_assessment_id = ua.id 
      WHERE 
        ua.status="complete" AND
        uav.variable = 'work' 
      GROUP BY 
          uav.score 
      ORDER BY 
          uav.score;
      `
    );
    const mappedRows = rows.map((row) => ({
      category: dailyWorkCategories[row.category],
      score_count: row.score_count,
    }));
    return res.status(200).json({ success: true, data: mappedRows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Something went Wrong !" });
  }
};

module.exports = { getDailyWork };
