# Todo List App

## Project Overview

This project is a responsive Todo List application built with React. It features a clean, modern UI with core task management functionality and persistent storage using the browser's localStorage API.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/giwaims/todo-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd todo-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The application will open in your default browser at `http://localhost:3000`.

#### Features

- **Task Management:** Add, edit, and delete tasks
- **Task Status:** Mark tasks as complete or incomplete
- **Task Filtering:** Filter tasks by All, Active, or Completed status
- **Batch Actions:** Clear all completed tasks at once
- **Persistent Storage:** Tasks are saved to localStorage and persist between page refreshes
- **Responsive Design:** Works seamlessly across desktop and mobile devices

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run eject` - Removes the single build dependency from your project

## Technical Implementation

Core Technologies

- React: Frontend library for building the user interface
- React Hooks: For state management (useState, useEffect)
- localStorage API: For persistent data storage
- CSS3: For styling with animations and responsive design

Component Structure

The entire application is contained within the `App` component. While this approach works well for a smaller application, the code could be refactored into smaller components for larger applications.

State Management

The application uses React's useState hook to manage several pieces of state:

- `tasks`: Array of task objects
- `inputValue`: String for the new task input field
- `editingId`: ID of the task currently being edited (null if none)
- `editValue`: String for the edit input field
- `filter`: String representing the current filter ('all', 'active', 'completed')

Data Persistence

The app uses localStorage to persist tasks between page reloads:

1. Loading Data: During initial render, tasks are loaded from localStorage
2. Saving Data: Whenever the tasks state changes, it's saved to localStorage
3. Error Handling: Try/catch blocks prevent crashes if localStorage operations fail

Task Object Structure

Each task is represented as an object with the following properties:

```javascript
{
  id: Number,          // Unique identifier (timestamp)
  text: String,        // Task description
  completed: Boolean,  // Completion status
  createdAt: String    // ISO timestamp when task was created
}
```

Code Documentation

State Initialization

```javascript
// Initialize tasks state from localStorage or empty array
const [tasks, setTasks] = useState(() => {
  try {
    const savedTasks = localStorage.getItem("todoTasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
  }
  return [];
});
```

Local Storage Persistence

```javascript
// Save tasks to localStorage whenever tasks change
useEffect(() => {
  try {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
}, [tasks]);
```

Task Management Functions

Adding Tasks

```javascript
const addTask = (e) => {
  e.preventDefault();
  if (inputValue.trim()) {
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setInputValue("");
  }
};
```

Deleting Tasks

```javascript
const deleteTask = (id) => {
  setTasks(tasks.filter((task) => task.id !== id));
};
```

Toggling Task Completion

```javascript
const toggleComplete = (id) => {
  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  );
};
```

Editing Tasks

```javascript
// Start editing a task
const startEdit = (task) => {
  setEditingId(task.id);
  setEditValue(task.text);
};

// Save edited task
const saveEdit = (id) => {
  if (editValue.trim()) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editValue } : task
      )
    );
    setEditingId(null);
    setEditValue("");
  }
};

// Cancel editing
const cancelEdit = () => {
  setEditingId(null);
  setEditValue("");
};
```

Filtering and Clearing Tasks

```javascript
// Filter tasks based on current filter
const filteredTasks = tasks.filter((task) => {
  if (filter === "active") return !task.completed;
  if (filter === "completed") return task.completed;
  return true; // 'all' filter
});

// Clear all completed tasks
const clearCompleted = () => {
  setTasks(tasks.filter((task) => !task.completed));
};
```

UI Components

Form Component

```jsx
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
```

Filter Controls

```jsx
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
```

Task List Component

The task list component renders either an empty state message or a list of task items:

```jsx
<ul className="task-list">
  {filteredTasks.length === 0 ? (
    <li className="empty-state">No tasks to show</li>
  ) : (
    filteredTasks.map((task) => (
      <li
        key={task.id}
        className={`task-item ${task.completed ? "completed" : ""}`}
      >
        {/ Task content or edit form /}
      </li>
    ))
  )}
</ul>
```

CSS Structure

The CSS is organized by component and follows a mobile-first approach:

1. Global Styles: Reset and base styles
2. App Container: Overall layout
3. Header: Title styles
4. Task Form: Input and add button
5. Filter Controls: Filter buttons
6. Task List: List container
7. Task Items: Individual task styles
8. Edit Mode: Styles for task editing state
9. Task Counter: Counter at bottom
10. Responsive Design: Media queries for mobile devices

Key design elements include:

- Modern gradient background
- Card-based UI with subtle shadows
- Smooth animations and transitions
- Responsive layout adjustments
- Visual feedback on hover and active states
- Color-coding for different actions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Create React App for the initial project setup
- React community for the excellent documentation and resources
- Contributors who have helped improve this project

Extending the Project

Here are some potential ways to extend this project:

1. Component Refactoring: Break down App.js into smaller components
2. State Management: Add Redux or Context API for more complex state needs
3. Additional Features:
   - Due dates for tasks
   - Priority levels
   - Categories/tags
   - Task sorting
   - User accounts with backend storage
4. Testing: Add unit and integration tests
5. Accessibility: Improve keyboard navigation and screen reader support

Troubleshooting

Common Issues

1. Tasks not persisting:

   - Check if localStorage is enabled
   - Make sure you're not in private/incognito mode
   - Check console for errors

2. UI display issues:
   - Verify CSS is properly loaded
   - Check browser compatibility
   - Test on different screen sizes

Conclusion

This Todo List application demonstrates core React concepts including state management, effect hooks, conditional rendering, and event handling. The implementation includes both functional features and an aesthetically pleasing UI that works across devices.
