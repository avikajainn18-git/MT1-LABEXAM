
import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

let tasks = [
    { id: 1, taskName: 'Develop Login Page', assignedTo: 'Rahul', status: 'Pending', priority: 'High' },
    { id: 2, taskName: 'Design Dashboard', assignedTo: 'Priya', status: 'In Progress', priority: 'Medium' },
    { id: 3, taskName: 'Test Registration Form', assignedTo: 'Amit', status: 'Completed', priority: 'Low' }
];

// GET: Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET: Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
});

// POST: Add a new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (id === undefined || !taskName?.trim() ||
        !assignedTo?.trim() || !status?.trim() || !priority?.trim()) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (tasks.some(t => t.id === Number(id))) {
        return res.status(400).json({ message: 'Task ID already exists' });
    }

    const newTask = { id: Number(id), taskName, assignedTo, status, priority };
    tasks.push(newTask);

    res.status(201).json(newTask);
});

// PUT: Update a task
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (!taskName?.trim() || !assignedTo?.trim() ||
        !status?.trim() || !priority?.trim()) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    task.taskName = taskName;
    task.assignedTo = assignedTo;
    task.status = status;
    task.priority = priority;

    res.status(200).json(task);
});

// DELETE: Remove a task
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const deletedTask = tasks.splice(index, 1)[0];
    res.status(200).json({ message: 'Task deleted', task: deletedTask });
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});
