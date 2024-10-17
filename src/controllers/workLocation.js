const db = require("../config/db.js");

const workLocationsIdMapping = { 1: "Workplace", 2: "Hybrid", 3: "Remote" };

const getWorkLocation = async (req, res) => {
  try {
    const [rows] = await db.query(`   
            SELECT 
                uav.score as work_location, 
                COUNT(*) AS score_count 
            FROM 
                users_assessments_82_variables uav
            JOIN 
                users_assessments ua ON uav.user_assessment_id = ua.id 
            WHERE 
              ua.status="complete" AND
                uav.variable = 'location' 
            GROUP BY 
                uav.score 
            ORDER BY 
            uav.score;`);

    const mappedRows = rows.map((row) => ({
      work_location: workLocationsIdMapping[row.work_location],
      score_count: row.score_count,
    }));
    return res.status(200).json({ success: true, data: mappedRows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Something went Wrong !" });
  }
};

module.exports = { getWorkLocation };
