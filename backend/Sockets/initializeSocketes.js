import { Server } from "socket.io";
import { initSocketManager } from "./socketManager.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { tokenModels } from "../models/token.model.js";

export function initializeSocketes(app) {
  const io = new Server(app.server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"],
  });

	io.db = app.db;

  io.use((socket, next) => {
    socket.db = app.db;
    next();
  });

  io.use(async (socket, next) => {
    try {
      const rawCookie = socket.request.headers.cookie;
      if (!rawCookie) return next(new Error("Unauthorized"));

      const cookies = cookie.parse(rawCookie);
      const accessToken = cookies.accessToken;
      const refreshToken = cookies.refreshToken;
			// console.log("accessToken:", accessToken);
			// console.log("refreshToken:", refreshToken);

      if (!accessToken) return next(new Error("Unauthorized"));

      if (refreshToken) {
        const revoked = await tokenModels.isTokenRevoked(socket.db, refreshToken);
        if (revoked) return next(new Error("TOKEN_REVOKED"));
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      socket.user = decoded;

      return next();
    } catch (err) {
      if (err?.name === "TokenExpiredError") {
        return next(new Error("TOKEN_EXPIRED"));
      }
      return next(new Error("Unauthorized"));
    }
  });

  app.decorate("io", io);
  initSocketManager(io);
}
