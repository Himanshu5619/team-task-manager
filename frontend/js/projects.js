let allUsers = [], editingProjectId = null;

async function loadProjects() {
  const projects = await apiFetch('/projects');
  const user = getUser();
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <h3>${p.name}</h3>
      <p>${p.description || 'No description'}</p>
      <div class="card-footer">
        <span style="font-size:0.8rem;color:var(--text-muted)">${p.members?.length || 0} members</span>
        <span class="status-badge status-todo">${p.status}</span>
      </div>
      ${user.role === 'admin' ? `
      <div class="project-actions">
        <button class="btn-sm" onclick="editProject('${p._id}', '${p.name}', '${p.description || ''}', ${JSON.stringify(p.members?.map(m=>m._id)||[])})">Edit</button>
        <button class="btn-sm danger" onclick="deleteProject('${p._id}')">Delete</button>
      </div>` : ''}
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No projects yet</p>';

  // Show/hide new project button for members
  const btn = document.getElementById('newProjectBtn');
  if (btn) btn.style.display = user.role === 'admin' ? '' : 'none';
}

async function openProjectModal(isEdit = false) {
  editingProjectId = null;
  document.getElementById('modalTitle').textContent = 'New Project';
  document.getElementById('projectName').value = '';
  document.getElementById('projectDesc').value = '';
  allUsers = await apiFetch('/users');
  renderMembersList([]);
  document.getElementById('projectModal').classList.remove('hidden');
}

function renderMembersList(selectedIds) {
  const list = document.getElementById('membersList');
  list.innerHTML = allUsers.map(u => `
    <label class="member-item">
      <input type="checkbox" value="${u._id}" ${selectedIds.includes(u._id) ? 'checked' : ''} />
      ${u.name} (${u.role})
    </label>
  `).join('');
}

async function editProject(id, name, desc, memberIds) {
  editingProjectId = id;
  document.getElementById('modalTitle').textContent = 'Edit Project';
  document.getElementById('projectName').value = name;
  document.getElementById('projectDesc').value = desc;
  allUsers = await apiFetch('/users');
  renderMembersList(memberIds);
  document.getElementById('projectModal').classList.remove('hidden');
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.add('hidden');
}

async function saveProject() {
  const name = document.getElementById('projectName').value.trim();
  const description = document.getElementById('projectDesc').value.trim();
  const members = [...document.querySelectorAll('#membersList input:checked')].map(i => i.value);
  if (!name) return alert('Project name required');

  if (editingProjectId) {
    await apiFetch(`/projects/${editingProjectId}`, {
      method: 'PUT', body: JSON.stringify({ name, description, members })
    });
  } else {
    await apiFetch('/projects', { method: 'POST', body: JSON.stringify({ name, description, members }) });
  }
  closeProjectModal();
  loadProjects();
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  await apiFetch(`/projects/${id}`, { method: 'DELETE' });
  loadProjects();
}

loadProjects();