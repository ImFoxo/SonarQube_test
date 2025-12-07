import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertHabitSchema,
  insertCompletionSchema,
  insertGroupSchema,
  insertFriendshipSchema,
  insertUserSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEMO_USER_ID = "demo-user-1";

  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getHabits(DEMO_USER_ID);
      res.json(habits);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const validatedData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(validatedData);
      res.json(habit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteHabit(id);
      if (!deleted) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/completions", async (req, res) => {
    try {
      const completions = await storage.getCompletions(DEMO_USER_ID);
      res.json(completions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/completions", async (req, res) => {
    try {
      const validatedData = insertCompletionSchema.parse(req.body);
      const completion = await storage.createCompletion(validatedData);
      res.json(completion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/completions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCompletion(id);
      if (!deleted) {
        return res.status(404).json({ error: "Completion not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/groups", async (req, res) => {
    try {
      const groups = await storage.getGroups(DEMO_USER_ID);
      res.json(groups);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const validatedData = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(validatedData);
      res.json(group);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements(DEMO_USER_ID);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/friend-updates", async (req, res) => {
    try {
      const updates = await storage.getFriendUpdates(DEMO_USER_ID);
      res.json(updates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/user", async (req, res) => {
    try {
      // Only allow editing name, username, and avatar - exclude streak fields
      const updates = insertUserSchema.partial().parse(req.body);
      // Ensure streak fields are never modified through this endpoint
      delete (updates as any).currentStreak;
      delete (updates as any).longestStreak;
      delete (updates as any).totalHabits;
      
      const user = await storage.updateUser(DEMO_USER_ID, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/friends", async (req, res) => {
    try {
      const friends = await storage.getFriends(DEMO_USER_ID);
      res.json(friends);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/friends", async (req, res) => {
    try {
      const { friendId } = req.body;
      if (!friendId) {
        return res.status(400).json({ error: "friendId is required" });
      }

      // Prevent self-friending
      if (DEMO_USER_ID === friendId) {
        return res.status(400).json({ error: "Cannot add yourself as a friend" });
      }

      // Check if friendship already exists
      const existingFriends = await storage.getFriends(DEMO_USER_ID);
      if (existingFriends.some(f => f.id === friendId)) {
        return res.status(400).json({ error: "Already friends with this user" });
      }

      const friendship = await storage.addFriend({
        userId: DEMO_USER_ID,
        friendId,
      });
      res.json(friendship);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/friends/:friendId", async (req, res) => {
    try {
      const { friendId } = req.params;
      const deleted = await storage.removeFriend(DEMO_USER_ID, friendId);
      if (!deleted) {
        return res.status(404).json({ error: "Friendship not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/all-users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/habits/:habitId/members", async (req, res) => {
    try {
      const { habitId } = req.params;
      const members = await storage.getGroupMembers(habitId);
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/habits/:habitId/members", async (req, res) => {
    try {
      const { habitId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const member = await storage.addGroupMember({ habitId, userId });
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/habits/:habitId/members/:userId", async (req, res) => {
    try {
      const { habitId, userId } = req.params;
      const deleted = await storage.removeGroupMember(habitId, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get collaborator completions for a specific habit and date
  app.get("/api/habits/:habitId/collaborations/:date", async (req, res) => {
    try {
      const { habitId, date } = req.params;
      const members = await storage.getGroupMembers(habitId);
      const allCompletions = await storage.getCompletions(DEMO_USER_ID);
      
      // Get completions for each member for the specified date
      const collaboratorData = members.map(member => {
        const hasCompleted = allCompletions.some(c => c.habitId === habitId && c.date === date);
        return {
          memberId: member.id,
          memberName: member.name,
          memberAvatar: member.avatar,
          completed: hasCompleted,
        };
      });
      
      res.json(collaboratorData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
