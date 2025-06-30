import { useState, useEffect } from "react";
import { useApiClient } from "../apis/apiClient";
import type { Todo, CreateTodoRequest, TaskPatch } from "../types/todo";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | boolean | null>(
    null
  );
  const { makeAuthenticatedRequest } = useApiClient();

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

  // Calculates the number of incomplete todos
  const activeTodos = todos.filter((todo) => !todo.isCompleted).length;

  return {
    todos,
    newTask,
    setNewTask,
    handleAddTask,
    activeTodos,
    handleCompletedTasks,
    deleteTask,
    isEditing,
    editingTaskId,
    updatedTask,
    handleEdit,
    handleSave,
    handleStatusChange,
    activeTaskId,
    toggleDotMenu,
  };
};
