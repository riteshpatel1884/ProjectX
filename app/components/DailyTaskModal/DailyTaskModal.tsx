"use client";

import { useState, useEffect } from "react";
import { 
  X, CheckCircle, Clock, Target, Plus, Calendar, Trophy, 
  Trash2, Pencil, Save 
} from "lucide-react";

// Types
interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface DailyEntry {
  id: string;
  tasks: SubTask[];
  totalPoints: number;
  createdAt: string;
}

interface DailyTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

export default function DailyTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
}: DailyTaskModalProps) {
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Edit State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  
  // Data State
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [history, setHistory] = useState<DailyEntry[]>([]);
  const [canCreateMore, setCanCreateMore] = useState(true);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTaskData();
      // Reset states on open
      setEditingTaskId(null);
      setNewTaskTitle("");
      setError("");
    }
  }, [isOpen]);

  const fetchTaskData = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/daily-tasks");
      if (res.ok) {
        const data = await res.json();
        setTodayEntry(data.todayEntry);
        setHistory(data.history || []);
        setCanCreateMore(data.canCreateMore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/daily-tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      const data = await res.json();

      if (res.ok) {
        setNewTaskTitle("");
        setSuccess("Task added!");
        fetchTaskData();
        onTaskCreated?.();
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (subTaskId: string) => {
    if (!todayEntry) return;
    setError("");
    
    try {
      const res = await fetch("/api/daily-tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayId: todayEntry.id, subTaskId }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(`+${data.pointsEarned} Points!`);
        fetchTaskData();
        onTaskCreated?.();
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to complete task");
    }
  };

  const handleDeleteTask = async (subTaskId: string) => {
    if (!todayEntry) return;
    if(!confirm("Are you sure you want to delete this task?")) return;

    setError("");
    try {
      const res = await fetch("/api/daily-tasks/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayId: todayEntry.id, subTaskId }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Task deleted");
        fetchTaskData();
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to delete task");
    }
  };

  const startEditing = (task: SubTask) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle("");
  };

  const saveEdit = async () => {
    if (!todayEntry || !editingTaskId || !editTitle.trim()) return;
    
    setError("");
    try {
      const res = await fetch("/api/daily-tasks/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          dayId: todayEntry.id, 
          subTaskId: editingTaskId,
          newTitle: editTitle 
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Task updated");
        setEditingTaskId(null);
        fetchTaskData();
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to update task");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Daily Goals</h2>
              <p className="text-slate-400 text-xs">Reset at 12:00 AM</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "today" ? "text-white bg-slate-800" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Today's Tasks
            {activeTab === "today" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "history" ? "text-white bg-slate-800" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            History
            {activeTab === "history" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm text-center">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-500/10 text-green-400 rounded-lg text-sm text-center">{success}</div>}

          {isFetching ? (
            <div className="text-center py-10 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              Loading...
            </div>
          ) : activeTab === "today" ? (
            <div className="space-y-6">
              {/* Task List */}
              <div className="space-y-3">
                {todayEntry?.tasks && todayEntry.tasks.length > 0 ? (
                  todayEntry.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                        task.completed
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-slate-800 border-slate-700"
                      }`}
                    >
                      {editingTaskId === task.id ? (
                        // EDIT MODE
                        <div className="flex items-center gap-2 w-full">
                           <input 
                             className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                             value={editTitle}
                             onChange={(e) => setEditTitle(e.target.value)}
                             autoFocus
                           />
                           <button onClick={saveEdit} className="p-1 text-green-400 hover:bg-green-400/10 rounded">
                             <Save className="w-4 h-4" />
                           </button>
                           <button onClick={cancelEditing} className="p-1 text-red-400 hover:bg-red-400/10 rounded">
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                      ) : (
                        // VIEW MODE
                        <>
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => !task.completed && handleCompleteTask(task.id)}
                              disabled={task.completed}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                task.completed
                                  ? "bg-green-500 border-green-500"
                                  : "border-slate-500 hover:border-blue-400"
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                            </button>
                            <span className={`text-sm ${task.completed ? "text-slate-400 line-through" : "text-white"}`}>
                              {task.title}
                            </span>
                          </div>
                          
                          {/* Actions: Show only if NOT completed */}
                          <div className="flex items-center gap-2">
                            {task.completed ? (
                              <span className="text-xs font-bold text-green-400 whitespace-nowrap">+3 pts</span>
                            ) : (
                              <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => startEditing(task)}
                                  className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                                  title="Edit Task"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-4">No tasks set for today yet.</p>
                )}
              </div>

              {/* Create New Task Input */}
              {canCreateMore ? (
                <div className="pt-4 border-t border-slate-800">
                  <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-semibold">
                     Add New Task ({todayEntry?.tasks?.length || 0}/3)
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => e.key === "Enter" && handleCreateTask()}
                    />
                    <button
                      onClick={handleCreateTask}
                      disabled={loading || !newTaskTitle.trim()}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg flex items-center justify-center"
                    >
                      {loading ? <Clock className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-slate-300">Daily limit reached!</p>
                  <p className="text-xs text-slate-500">Come back tomorrow to set new goals.</p>
                </div>
              )}
            </div>
          ) : (
            // HISTORY TAB
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No history found.</div>
              ) : (
                history.map((day) => (
                  <div key={day.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {new Date(day.createdAt).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">
                        {day.totalPoints} pts earned
                      </span>
                    </div>
                    <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                      {(day.tasks as unknown as SubTask[]).map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {t.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500/70" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600" />
                          )}
                          <span className={`text-sm ${t.completed ? "text-slate-500 line-through" : "text-slate-400"}`}>
                            {t.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}