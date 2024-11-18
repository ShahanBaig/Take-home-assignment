import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import helmet from "helmet"
import userRoutes from "./routes/users.js";
import noteRoutes from "./routes/notes.js"
import searchRoutes from "./routes/search.js"
import errorMiddleware from "./middleware/error.js"
import { connectDatabase } from "./config/database.js"
import cookieParser from "cookie-parser"
import limit from "./middleware/limit.js"

/* UNHANDLED UNCAUGHT EXCEPTION */
process.on('uncaughtException', (err) => {
    console.log('Error: ' + err.message)
    console.log('Shutting down the server due to uncaught exception.')
    process.exit(1)
})

// Load environment variables from a file named .env into process.env.
dotenv.config({path: "config/.env"});

// Create an instance of the Express application.
const app = express();

// Allows the server to handle JSON-encoded request bodies.
app.use(express.json());

// Enables cookie parsing
app.use(cookieParser())

// Secure Express apps by setting various HTTP headers. Sets the Cross-Origin Resource Policy (CORP) header to "cross-origin."
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Parse incoming requests and sets limit.
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Rate Limit
app.use(limit)

/* ROUTES */
app.use("/api/auth", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/search", searchRoutes);

// Error middleware
app.use(errorMiddleware)

/* MONGOOSE SETUP */
connectDatabase()

/* START SERVER */
const PORT = process.env.PORT || 6001;
const server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

/* UNHANDLED PROMISE REJECTION */
process.on("unhandledRejection", (err) => {
    console.log('Error: ' + err.message)
    console.log('Shutting down the server due to unhandled promise rejection.')

    server.close(() => {
        process.exit(1)
    })
})