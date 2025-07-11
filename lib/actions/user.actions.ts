"use server";

import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";

// Get user by ID - using Clerk ID
export async function getUserById(clerkId: string) {
  try {
    await connectToDatabase();

    // If using default ID or invalid ID, create a default user object
    if (!clerkId || clerkId === "default_user_id") {
      return {
        _id: "default_user_id",
        firstName: "Guest",
        lastName: "User",
        email: "guest@example.com",
        photo: "/assets/icons/user.svg",
        creditBalance: 100,
        username: "guest_user"
      };
    }

    // Use clerkId field to query instead of _id
    const user = await User.findOne({ clerkId });

    if (!user) {
      // Return default guest user if no user found
      return {
        _id: "default_user_id",
        firstName: "Guest",
        lastName: "User",
        email: "guest@example.com",
        photo: "/assets/icons/user.svg",
        creditBalance: 100,
        username: "guest_user"
      };
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
    
    // Return a default user to avoid errors
    return {
      _id: "default_user_id",
      firstName: "Guest",
      lastName: "User",
      email: "guest@example.com",
      photo: "/assets/icons/user.svg", 
      creditBalance: 100,
      username: "guest_user"
    };
  }
} 