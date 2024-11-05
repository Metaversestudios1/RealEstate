const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8000;


const AdminRoute = require("./Routes/AdminRoute");
const UserRoute = require("./Routes/UserRoute");
const SettingRoutes = require("./Routes/SettingRoutes");
const ClientRoutes = require("./Routes/ClientRoutes");
const PropertyRoutes = require("./Routes/PropertyRoutes");
const AgentRoutes = require("./Routes/AgentRoutes");
const ProjectRoutes = require("./Routes/ProjectRoutes");
const CommisionRoutes = require("./Routes/CommisionRoutes");
const SiteRoutes = require("./Routes/SiteRoutes");
const RankRoutes = require("./Routes/RankRoutes");
const DashboardRoutes = require("./Routes/DashboardRoutes");
const CommonRoute = require("./Routes/CommonRoute");
// Connect to the database
connectDB();
const server = http.createServer(app);
const corsOptions = {
  origin: ["https://real-estate-backend-wine.vercel.app","https://real-estate-client-agent.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use("/api", UserRoute);
app.use("/api", AdminRoute);
app.use("/api", SettingRoutes);
app.use("/api", PropertyRoutes);
app.use("/api", AgentRoutes);
app.use("/api", ProjectRoutes);
app.use("/api", ClientRoutes);
app.use("/api", CommisionRoutes);
app.use("/api", SiteRoutes);
app.use("/api", RankRoutes);
app.use("/api", DashboardRoutes);
app.use("/api", CommonRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


