
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const tasks = [
    {
        id: 1,
        taskName: 'Develop Login Page',
        assignedTo: 'Rahul Sharma',
        status: 'Pending'
    },
    {
        id: 2,
        taskName: 'Design Dashboard',
        assignedTo: 'Priya Verma',
        status: 'In Progress'
    },
    {
        id: 3,
        taskName: 'Test Registration Form',
        assignedTo: 'Amit Kumar',
        status: 'Completed'
    }
];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // A2: GET /
    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Welcome to Employee Task Management</h1>');
        return;
    }

    // A2 and A3: GET /tasks
    if (method === 'GET' && url === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks, null, 2));
        return;
    }

    // A2: GET /about
    if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Employee Task Management Application');
        return;
    }

    // A4: GET /home, serving HTML using the FS module
    if (method === 'GET' && url === '/home') {
        const filePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Internal Server Error: Unable to read HTML file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
        return;
    }

    // A3: POST /add-task
    if (method === 'POST' && url === '/add-task') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            let newTask;

            try {
                newTask = JSON.parse(body);
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON request body' }));
                return;
            }

            if (
                !newTask ||
                typeof newTask !== 'object' ||
                Array.isArray(newTask) ||
                newTask.id === undefined ||
                newTask.taskName === undefined ||
                newTask.assignedTo === undefined ||
                newTask.status === undefined ||
                String(newTask.taskName).trim() === '' ||
                String(newTask.assignedTo).trim() === '' ||
                String(newTask.status).trim() === ''
            ) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Required fields: id, taskName, assignedTo and status'
                }));
                return;
            }

            if (tasks.some(task => task.id === newTask.id)) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Task ID already exists' }));
                return;
            }

            tasks.push({
                id: newTask.id,
                taskName: newTask.taskName,
                assignedTo: newTask.assignedTo,
                status: newTask.status
            });

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Task added successfully',
                task: tasks[tasks.length - 1]
            }));
        });
        return;
    }

    // A5: Invalid routes and unsupported methods
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
