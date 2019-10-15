const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let reqs = 0;

server.use((req, res, next) => {
  reqs++;
  console.log(`${reqs} request${reqs > 1 ? 's' : ''} was received until now`);

  return next();
});

function checkIdExists(req, res, next) {
  const project = projects.find(p => p.id == req.params.id);

  if (!project) {
    return res.status(400).json({ error: 'Could not find a project with this ID'});
  }

  req.project = project;

  return next();
};

server.post('/projects', (req, res) => {
  const { id, title, tasks = [] } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id, title, tasks = [] } = req.body;

  const index = projects.findIndex(p => p.id === req.project.id);

  projects[index] = { id, title, tasks };

  return res.json(projects[index]);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const index = projects.findIndex(p => p.id === req.project.id);

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const index = projects.findIndex(p => p.id === req.project.id);
  const { title } = req.body;

  projects[index].tasks.push(title);

  return res.json(req.project);
});

server.listen(3000);