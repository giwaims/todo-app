import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Initialize tasks from localStorage or empty array if nothing is saved
  const [tasks, setTasks] = useState(() => {
    try {
      // Get saved tasks from localStorage during initial render
      const savedTasks = localStorage.getItem("todoTasks");
      // Check if we have saved tasks and parse them
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        console.log("Loaded from localStorage:", parsed);
        return parsed;
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
    }
    // Return empty array if no tasks found or error occurred
    return [];
  });

  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      console.log("Saving to localStorage:", tasks);
      localStorage.setItem("todoTasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  // Add new task
  const addTask = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString(), // Store as ISO string for better serialization
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setInputValue("");

      // Direct localStorage save as an additional safeguard
      try {
        localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
      } catch (err) {
        console.error("Failed direct save after add:", err);
      }
    }
  };

  // Delete task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    // Direct localStorage save as an additional safeguard
    try {
      localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
    } catch (err) {
      console.error("Failed direct save after delete:", err);
    }
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Direct localStorage save as an additional safeguard
    try {
      localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
    } catch (err) {
      console.error("Failed direct save after toggle:", err);
    }
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.text);
  };

  // Save edited task
  const saveEdit = (id) => {
    if (editValue.trim()) {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, text: editValue } : task
      );
      setTasks(updatedTasks);
      setEditingId(null);
      setEditValue("");

      // Direct localStorage save as an additional safeguard
      try {
        localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
      } catch (err) {
        console.error("Failed direct save after edit:", err);
      }
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // 'all' filter
  });

  // Clear all completed tasks
  const clearCompleted = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);

    // Direct localStorage save as an additional safeguard
    try {
      localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
    } catch (err) {
      console.error("Failed direct save after clear completed:", err);
    }
  };

  return (
    <div className="app-container">
      <div className="todo-app">
        <h1>TaskFlow</h1>

        {/* Add task form */}
        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            className="task-input"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        {/* Filter controls */}
        <div className="filter-controls">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button className="clear-completed-btn" onClick={clearCompleted}>
            Clear Completed
          </button>
        </div>

        {/* Task list */}
        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <li className="empty-state">No tasks to show</li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                {editingId === task.id ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      className="edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveEdit(task.id);
                        } else if (e.key === 'Escape') {
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(task.id)}
                      >
                        Save
                      </button>
                      <button className="cancel-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="task-content">
                    <div className="task-details">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="task-checkbox"
                      />
                      <span className="task-text">{task.text}</span>
                    </div>
                    <div className="task-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>

        {/* Task counter */}
        <div className="task-counter">
          {tasks.filter((task) => !task.completed).length} tasks left
        </div>
      </div>
    </div>
  );
}

export default App;
