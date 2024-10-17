const express = require("express");
const cors = require("cors");
const dailyWorkRoute = require("./routes/dailyWork");
const workLocationRoute = require("./routes/workLocation");
const endowmentRoute = require("./routes/endowment");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1/daily-work", dailyWorkRoute);
app.use("/api/v1/work-locations", workLocationRoute);
app.use("/api/v1/endowments", endowmentRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
