let allProjects = [], allUsers = [];

async function loadTasks() {
  const projectId = document.getElementById('filterProject')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';
  let url = '/tasks';
  const params = [];
  if (projectId) params.push(`projectId=${projectId}`);
  if (status) params.push(`status=${status}`);
  if (params.length) url += '?' + params.join('&');

  const tasks = await apiFetch(url);
  const now = new Date();

  const todoCol = document.getElementById('todoCol');
  const inprogressCol = document.getElementById('inprogressCol');
  const doneCol = document.getElementById('doneCol');
  todoCol.innerHTML = inprogressCol.innerHTML = doneCol.innerHTML = '';

  tasks.forEach(task => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < now && task.status !== 'done';
    const card = `
      <div class="kanban-card">
        <div class="task-title">${task.title}</div>
        <div class="task-info">
          📁 ${task.project?.name || '—'}<br/>
          👤 ${task.assignedTo?.name || 'Unassigned'}<br/>
          ${task.dueDate ? `📅 ${new Date(task.dueDate).toLocaleDateString()}` : ''}
          ${isOverdue ? '<span class="overdue-badge"> ⚠ Overdue</span>' : ''}
        </div>
        <div class="card-actions">
          <span class="status-badge priority-${task.priority}">${task.priority}</span>
          ${task.status !== 'done' ? `
            <button class="btn-sm" onclick="updateStatus('${task._id}', '${task.status === 'todo' ? 'in-progress' : 'done'}')">
              ${task.status === 'todo' ? '▶ Start' : '✓ Done'}
            </button>` : ''}
          ${getUser().role === 'admin' ? `
            <button class="btn-sm danger" onclick="deleteTask('${task._id}')">✕</button>` : ''}
        </div>
      </div>`;
    if (task.status === 'todo') todoCol.innerHTML += card;
    else if (task.status === 'in-progress') inprogressCol.innerHTML += card;
    else doneCol.innerHTML += card;
  });
}

async function populateFilters() {
  allProjects = await apiFetch('/projects');
  const sel = document.getElementById('filterProject');
  allProjects.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p._id; opt.textContent = p.name;
    sel.appendChild(opt);
  });
}

async function openTaskModal() {
  allProjects = await apiFetch('/projects');
  allUsers = await apiFetch('/users');

  const projSel = document.getElementById('taskProject');
  projSel.innerHTML = allProjects.map(p => `<option value="${p._id}">${p.name}</option>`).join('');

  const userSel = document.getElementById('taskAssignee');
  userSel.innerHTML = `<option value="">Unassigned</option>` +
    allUsers.map(u => `<option value="${u._id}">${u.name}</option>`).join('');

  document.getElementById('taskModal').classList.remove('hidden');
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.add('hidden');
}

async function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDesc').value.trim();
  const project = document.getElementById('taskProject').value;
  const assignedTo = document.getElementById('taskAssignee').value;
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;
  if (!title) return alert('Title required');

  await apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description, project, assignedTo, priority, dueDate })
  });
  closeTaskModal();
  loadTasks();
}

async function updateStatus(id, newStatus) {
  await apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
  loadTasks();
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

populateFilters();
loadTasks();