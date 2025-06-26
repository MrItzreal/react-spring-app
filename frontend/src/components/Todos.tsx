import { useState, useEffect } from "react";
import { useApiClient } from "../apis/apiClient";
import type { Todo, CreateTodoRequest, TaskPatch } from "../types/todo";
import { Plus, Trash, Edit, Ellipsis } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | boolean | null>(
    null
  );
  const { makeAuthenticatedRequest } = useApiClient();

  // Allows typing in editable field
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTask(e.target.value);
  };

  //Dot Menu Option
  const toggleDotMenu = (id: number) => {
    if (activeTaskId === id) {
      setActiveTaskId(null); // Close the menu if clicking the same message
    } else {
      setActiveTaskId(id); // Open menu for clicked message
    }
  };

  // GET req
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await makeAuthenticatedRequest({
          url: "/todos",
          method: "GET",
        });
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };
    fetchTodos();
  }, []);

  // POST req
  const handleAddTask = async () => {
    // Prevent adding empty tasks
    if (newTask.trim() === "") {
      return;
    }

    try {
      const requestBody: CreateTodoRequest = { task: newTask };

      const newTodo = await makeAuthenticatedRequest({
        url: "/todos",
        method: "POST",
        data: requestBody,
      });

      setTodos((currentTodos) => [...currentTodos, newTodo.data]);
      setNewTask("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  // Edit Tasks
  const handleEdit = (task: Todo | null) => {
    try {
      if (task) {
        setIsEditing(true);
        setEditingTaskId(task.id);
        setUpdatedTask(task.task);
      } else {
        setIsEditing(false);
        setEditingTaskId(null);
        setUpdatedTask("");
        setActiveTaskId(true);
      }
    } catch (err) {
      console.error("Failed to edit todo:", err);
    }
  };

  // PATCH req: Save Edited Tasks
  const handleSave = async (id: number) => {
    try {
      const patchData: TaskPatch = {
        task: updatedTask,
      };

      await makeAuthenticatedRequest({
        url: `/todos/${id}`,
        method: "PATCH",
        data: patchData,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, ...patchData } : todo
        )
      );

      // Reset editing states
      setIsEditing(false);
      setEditingTaskId(null);
      setUpdatedTask("");
      setActiveTaskId(true);
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  // PATCH req: Check Completed Tasks
  const handleCompletedTasks = async (id: number) => {
    try {
      const todo = todos.find((todo) => todo.id === id);

      if (!todo) {
        console.error(`Todo with id ${id} not found`);
        return;
      }

      const patchData: TaskPatch = {
        isCompleted: !todo.isCompleted,
      };

      await makeAuthenticatedRequest({
        url: `/todos/${id}`,
        method: "PATCH",
        data: patchData,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id
            ? { ...todo, isCompleted: patchData.isCompleted }
            : todo
        )
      );
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  // DELETE req
  const deleteTask = async (id: number) => {
    const hasConfirmed = confirm("Do you want to delete this task?");
    if (hasConfirmed) {
      try {
        await makeAuthenticatedRequest({
          url: `/todos/${id}`,
          method: "DELETE",
        });

        // Removes Completed tasks from List.
        setTodos((currentTodos) =>
          currentTodos.filter((todo) => todo.id !== id)
        );
        setActiveTaskId(true);
      } catch (err) {
        console.error("Failed to delete todo:", err);
      }
    } else {
      setActiveTaskId(true);
    }
  };

  // Calculates the number of incomplete todos
  const activeTodos = todos.filter((todo) => !todo.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-indigo-400/20 rounded-full blur-md animate-bounce delay-700"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center font-sans p-4">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
          <header className="mb-6 md:mb-8 text-center">
            <div className="flex justify-center items-center mb-4 gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wider uppercase">
                Todo List
              </h1>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "3rem",
                      height: "3rem",
                    },
                  },
                }}
              />
            </div>
          </header>

          {/* Input Section*/}
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-grow p-4 text-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
            />
            <button
              type="button"
              className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-r-lg transition-all duration-300 disabled:opacity-50"
              onClick={handleAddTask}
              disabled={!newTask.trim()}
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Filters and summary */}
          <div className="flex flex-col sm:flex-row justify-center items-center mb-4 text-sm text-white/70">
            <p className="mb-2 sm:mb-0 font-medium">{activeTodos} items left</p>
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                    todo.isCompleted
                      ? "bg-white/5 backdrop-blur-sm border border-white/10"
                      : "bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      handleCompletedTasks(todo.id);
                    }}
                    style={{
                      borderColor: todo.isCompleted ? "#4ade80" : "#ffffff80",
                      backgroundColor: todo.isCompleted
                        ? "#4ade80"
                        : "transparent",
                    }}
                  >
                    {todo.isCompleted && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                  <span className="flex-grow mx-4 text-lg text-white">
                    {isEditing && todo.id === editingTaskId ? (
                      <input
                        type="text"
                        value={updatedTask}
                        onChange={handleStatusChange}
                        placeholder="Edit Task..."
                        className="flex-grow p-2 text-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      />
                    ) : (
                      <p>{todo.task}</p>
                    )}
                  </span>

                  {/* EDIT/SAVE/DELETE BTNS */}
                  <div className="flex items-center justify-end gap-3">
                    {activeTaskId !== todo.id ? (
                      <button
                        onClick={() => toggleDotMenu(todo.id)}
                        className="text-white/50 hover:text-pink-300 transition-colors duration-300 p-1 rounded-lg hover:bg-white/10"
                      >
                        <Ellipsis size={20} />
                      </button>
                    ) : isEditing && todo.id === editingTaskId ? (
                      <>
                        <button
                          className="inline-flex items-center px-3 text-sm font-medium text-white transition-colors border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-focusrings"
                          onClick={() => handleSave(todo.id)}
                        >
                          Save
                        </button>
                        <button
                          className="inline-flex items-center px-3 text-sm font-medium text-white transition-colors border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-focusrings"
                          onClick={() => handleEdit(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => deleteTask(todo.id)}
                          className="text-white/50 hover:text-pink-300 transition-colors duration-300 p-1 rounded-lg hover:bg-white/10"
                        >
                          <Trash size={20} />
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(todo);
                          }}
                          className="text-white/50 hover:text-pink-300 transition-colors duration-300 p-1 rounded-lg hover:bg-white/10"
                        >
                          <Edit size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/70">
                <p className="text-lg">You're all caught up!</p>
                <p className="text-sm">Add a task above to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Todos;
