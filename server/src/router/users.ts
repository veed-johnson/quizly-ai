import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  createAdmin,
} from "../controllers/users";
import { isAdmin, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, isAdmin, getAllUsers);
  router.patch(
    "/users/create-admin/:email",
    isAuthenticated,
    isAdmin,
    createAdmin
  );
  router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);
  router.patch("/users/:id", isAuthenticated, isAdmin, updateUser);
};
