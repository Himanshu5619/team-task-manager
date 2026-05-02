async function loadDashboard() {
  const [tasks, projects] = await Promise.all([
    apiFetch('/tasks'),
    apiFetch('/projects')
  ]);

  const now = new Date();
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
  ).length;

  document.getElementById('totalTasks').textContent = total;
  document.getElementById('doneTasks').textContent = done;
  document.getElementById('inProgressTasks').textContent = inProgress;
  document.getElementById('overdueTasks').textContent = overdue;

  // My Tasks
  const taskList = document.getElementById('myTasksList');
  taskList.innerHTML = tasks.slice(0, 6).map(t => `
    <div class="task-item">
      <div>
        <div class="task-title">${t.title}</div>
        <div class="task-meta">${t.project?.name || ''} · ${t.priority}</div>
      </div>
      <span class="status-badge status-${t.status}">${t.status}</span>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No tasks yet</p>';

  // Projects
  const projList = document.getElementById('projectsList');
  projList.innerHTML = projects.slice(0, 5).map(p => `
    <div class="task-item">
      <div>
        <div class="task-title">${p.name}</div>
        <div class="task-meta">${p.members?.length || 0} members</div>
      </div>
      <span class="status-badge status-todo">${p.status}</span>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No projects yet</p>';
}

loadDashboard();