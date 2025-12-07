import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHabitSchema } from "@shared/schema";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Group, User } from "@shared/schema";

const habitFormSchema = insertHabitSchema.extend({
  name: z.string().min(1, "Habit name is required"),
  targetValue: z.number().min(1).max(10),
});

type HabitFormValues = z.infer<typeof habitFormSchema>;

interface HabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HabitFormValues & { collaborators?: string[] }) => void;
  groups: Group[];
  userId: string;
  friends?: User[];
}

export function HabitForm({
  open,
  onOpenChange,
  onSubmit,
  groups,
  userId,
  friends = [],
}: HabitFormProps) {
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: "",
      description: "",
      userId,
      frequency: "daily",
      targetValue: 1,
      color: "#3B82F6",
      isCollaborative: false,
      groupId: undefined,
    },
  });

  const isCollaborative = form.watch("isCollaborative");

  const handleSubmit = (data: HabitFormValues) => {
    onSubmit({ ...data, collaborators: isCollaborative ? selectedCollaborators : undefined });
    form.reset();
    setSelectedCollaborators([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0" data-testid="dialog-habit-form">
        <div className="px-6 pt-6 pb-0">
          <DialogHeader>
            <DialogTitle>Habit Tracking Overview</DialogTitle>
            <DialogDescription>
              Create a new habit to track your daily progress
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col overflow-hidden flex-1">
            <div className="overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habit Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Morning Exercise"
                          {...field}
                          data-testid="input-habit-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add details about your habit..."
                          {...field}
                          value={field.value || ""}
                          data-testid="input-habit-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-habit-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-habit-group">
                            <SelectValue placeholder="Select a group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: group.color }}
                                />
                                {group.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          {["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`h-10 w-10 rounded-md border-2 transition-all ${
                                field.value === color
                                  ? "border-foreground scale-110"
                                  : "border-transparent hover-elevate"
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                              data-testid={`color-${color}`}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Target (1-10)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            data-testid="slider-habit-target"
                          />
                          <div className="text-center">
                            <span className="text-2xl font-bold">{field.value}</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isCollaborative"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Make Collaborative</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Share this habit with friends to track together
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-collaborative"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isCollaborative && friends.length > 0 && (
                  <FormItem>
                    <FormLabel>Add Friends</FormLabel>
                    <div className="space-y-2">
                      {friends.map((friend) => (
                        <div key={friend.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`friend-${friend.id}`}
                            checked={selectedCollaborators.includes(friend.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCollaborators([...selectedCollaborators, friend.id]);
                              } else {
                                setSelectedCollaborators(selectedCollaborators.filter((id) => id !== friend.id));
                              }
                            }}
                            data-testid={`checkbox-collaborator-${friend.id}`}
                          />
                          <Label htmlFor={`friend-${friend.id}`}>{friend.name}</Label>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-habit"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-create-habit">
                Create Habit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
