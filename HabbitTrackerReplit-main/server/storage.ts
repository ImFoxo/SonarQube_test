import {
  type User,
  type InsertUser,
  type Habit,
  type InsertHabit,
  type Completion,
  type InsertCompletion,
  type Group,
  type InsertGroup,
  type Achievement,
  type InsertAchievement,
  type FriendUpdate,
  type InsertFriendUpdate,
  type Friendship,
  type InsertFriendship,
  type GroupMember,
  type InsertGroupMember,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  getHabits(userId: string): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  deleteHabit(id: string): Promise<boolean>;
  
  getCompletions(userId: string): Promise<Completion[]>;
  getCompletion(id: string): Promise<Completion | undefined>;
  createCompletion(completion: InsertCompletion): Promise<Completion>;
  deleteCompletion(id: string): Promise<boolean>;
  
  getGroups(userId: string): Promise<Group[]>;
  createGroup(group: InsertGroup): Promise<Group>;
  
  getAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | undefined>;
  
  getFriendUpdates(userId: string): Promise<FriendUpdate[]>;
  createFriendUpdate(update: InsertFriendUpdate): Promise<FriendUpdate>;
  
  getFriends(userId: string): Promise<User[]>;
  addFriend(friendship: InsertFriendship): Promise<Friendship>;
  removeFriend(userId: string, friendId: string): Promise<boolean>;
  
  getGroupMembers(habitId: string): Promise<User[]>;
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  removeGroupMember(habitId: string, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private habits: Map<string, Habit>;
  private completions: Map<string, Completion>;
  private groups: Map<string, Group>;
  private achievements: Map<string, Achievement>;
  private friendUpdates: Map<string, FriendUpdate>;
  private friendships: Map<string, Friendship>;
  private groupMembers: Map<string, GroupMember>;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.completions = new Map();
    this.groups = new Map();
    this.achievements = new Map();
    this.friendUpdates = new Map();
    this.friendships = new Map();
    this.groupMembers = new Map();
    this.seedData();
  }

  private seedData() {
    const demoUser: User = {
      id: "demo-user-1",
      username: "demo",
      name: "Demo User",
      avatar: null,
      totalHabits: 0,
      currentStreak: 3,
      longestStreak: 7,
    };
    this.users.set(demoUser.id, demoUser);

    const groups: Group[] = [
      { id: "group-1", name: "Health", color: "#10B981", userId: demoUser.id },
      { id: "group-2", name: "Productivity", color: "#3B82F6", userId: demoUser.id },
      { id: "group-3", name: "Personal", color: "#8B5CF6", userId: demoUser.id },
    ];
    groups.forEach((g) => this.groups.set(g.id, g));

    const achievements: Achievement[] = [
      {
        id: "ach-1",
        userId: demoUser.id,
        name: "First Step",
        description: "Complete your first habit",
        icon: "trophy",
        isUnlocked: true,
        unlockedAt: new Date(),
      },
      {
        id: "ach-2",
        userId: demoUser.id,
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "flame",
        isUnlocked: false,
        unlockedAt: null,
      },
      {
        id: "ach-3",
        userId: demoUser.id,
        name: "Habit Master",
        description: "Complete 10 different habits",
        icon: "star",
        isUnlocked: false,
        unlockedAt: null,
      },
      {
        id: "ach-4",
        userId: demoUser.id,
        name: "Consistent Champion",
        description: "Complete habits 30 days in a row",
        icon: "crown",
        isUnlocked: false,
        unlockedAt: null,
      },
    ];
    achievements.forEach((a) => this.achievements.set(a.id, a));

    const friendUpdates: FriendUpdate[] = [
      {
        id: "fu-1",
        userId: demoUser.id,
        friendName: "Sarah Johnson",
        friendAvatar: null,
        activity: "completed Morning Exercise habit",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "fu-2",
        userId: demoUser.id,
        friendName: "Mike Chen",
        friendAvatar: null,
        activity: "achieved a 10-day streak",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ];
    friendUpdates.forEach((f) => this.friendUpdates.set(f.id, f));

    // Add sample friend users
    const friend1: User = {
      id: "friend-1",
      username: "sarah",
      name: "Sarah Johnson",
      avatar: null,
      totalHabits: 5,
      currentStreak: 10,
      longestStreak: 15,
    };
    const friend2: User = {
      id: "friend-2",
      username: "mike",
      name: "Mike Chen",
      avatar: null,
      totalHabits: 8,
      currentStreak: 7,
      longestStreak: 21,
    };
    this.users.set(friend1.id, friend1);
    this.users.set(friend2.id, friend2);

    // Add friendships
    const friendships: Friendship[] = [
      { id: "fs-1", userId: demoUser.id, friendId: friend1.id, createdAt: new Date() },
      { id: "fs-2", userId: demoUser.id, friendId: friend2.id, createdAt: new Date() },
    ];
    friendships.forEach((f) => this.friendships.set(f.id, f));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      totalHabits: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter((h) => h.userId === userId);
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const newHabit: Habit = {
      ...habit,
      id,
      createdAt: new Date(),
    };
    this.habits.set(id, newHabit);
    
    const user = await this.getUser(habit.userId);
    if (user) {
      await this.updateUser(user.id, { totalHabits: user.totalHabits + 1 });
    }
    
    return newHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    const habit = this.habits.get(id);
    if (!habit) return false;
    
    this.habits.delete(id);
    
    const user = await this.getUser(habit.userId);
    if (user && user.totalHabits > 0) {
      await this.updateUser(user.id, { totalHabits: user.totalHabits - 1 });
    }
    
    return true;
  }

  async getCompletions(userId: string): Promise<Completion[]> {
    const userHabits = await this.getHabits(userId);
    const habitIds = new Set(userHabits.map((h) => h.id));
    return Array.from(this.completions.values()).filter((c) =>
      habitIds.has(c.habitId),
    );
  }

  async getCompletion(id: string): Promise<Completion | undefined> {
    return this.completions.get(id);
  }

  async createCompletion(completion: InsertCompletion): Promise<Completion> {
    const id = randomUUID();
    const newCompletion: Completion = {
      ...completion,
      id,
      completedAt: new Date(),
    };
    this.completions.set(id, newCompletion);
    return newCompletion;
  }

  async deleteCompletion(id: string): Promise<boolean> {
    return this.completions.delete(id);
  }

  async getGroups(userId: string): Promise<Group[]> {
    return Array.from(this.groups.values()).filter((g) => g.userId === userId);
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const newGroup: Group = { ...group, id };
    this.groups.set(id, newGroup);
    return newGroup;
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (a) => a.userId === userId,
    );
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async updateAchievement(
    id: string,
    updates: Partial<Achievement>,
  ): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;
    const updated = { ...achievement, ...updates };
    this.achievements.set(id, updated);
    return updated;
  }

  async getFriendUpdates(userId: string): Promise<FriendUpdate[]> {
    return Array.from(this.friendUpdates.values())
      .filter((f) => f.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createFriendUpdate(update: InsertFriendUpdate): Promise<FriendUpdate> {
    const id = randomUUID();
    const newUpdate: FriendUpdate = {
      ...update,
      id,
      timestamp: new Date(),
    };
    this.friendUpdates.set(id, newUpdate);
    return newUpdate;
  }

  async getFriends(userId: string): Promise<User[]> {
    const userFriendships = Array.from(this.friendships.values()).filter(
      (f) => f.userId === userId,
    );
    return userFriendships
      .map((f) => this.users.get(f.friendId))
      .filter((u): u is User => u !== undefined);
  }

  async addFriend(friendship: InsertFriendship): Promise<Friendship> {
    const id = randomUUID();
    const newFriendship: Friendship = {
      ...friendship,
      id,
      createdAt: new Date(),
    };
    this.friendships.set(id, newFriendship);
    return newFriendship;
  }

  async removeFriend(userId: string, friendId: string): Promise<boolean> {
    const friendship = Array.from(this.friendships.values()).find(
      (f) => f.userId === userId && f.friendId === friendId,
    );
    if (!friendship) return false;
    this.friendships.delete(friendship.id);
    return true;
  }

  async getGroupMembers(habitId: string): Promise<User[]> {
    const members = Array.from(this.groupMembers.values()).filter(
      (m) => m.habitId === habitId,
    );
    return members
      .map((m) => this.users.get(m.userId))
      .filter((u): u is User => u !== undefined);
  }

  async addGroupMember(member: InsertGroupMember): Promise<GroupMember> {
    const id = randomUUID();
    const newMember: GroupMember = {
      ...member,
      id,
      createdAt: new Date(),
    };
    this.groupMembers.set(id, newMember);
    return newMember;
  }

  async removeGroupMember(habitId: string, userId: string): Promise<boolean> {
    const member = Array.from(this.groupMembers.values()).find(
      (m) => m.habitId === habitId && m.userId === userId,
    );
    if (!member) return false;
    this.groupMembers.delete(member.id);
    return true;
  }
}

export const storage = new MemStorage();
