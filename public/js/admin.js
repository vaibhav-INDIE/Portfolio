// Admin Panel JavaScript
let updates = [];
let editingId = null;

// DOM Elements
const updateForm = document.getElementById('update-form');
const updatesTableBody = document.getElementById('updates-table-body');
const updateTitleInput = document.getElementById('update-title');
const updateDateInput = document.getElementById('update-date');
const updateCategoryInput = document.getElementById('update-category');
const updateContentInput = document.getElementById('update-content');

// Show Add Form
function showAddForm() {
  editingId = null;
  updateForm.style.display = 'block';
  updateForm.reset();
  updateForm.querySelector('h2').textContent = 'Add New Update';
}

// Hide Add Form
function hideAddForm() {
  updateForm.style.display = 'none';
  updateForm.reset();
  editingId = null;
}

// Format Date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Create Update Row
function createUpdateRow(update) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${formatDate(update.date)}</td>
    <td>${update.title}</td>
    <td><span class="category-badge ${update.category}">${update.category}</span></td>
    <td>
      <button class="action-btn edit-btn" onclick="editUpdate('${update.id}')">
        <i class="fas fa-edit"></i> Edit
      </button>
      <button class="action-btn delete-btn" onclick="deleteUpdate('${update.id}')">
        <i class="fas fa-trash"></i> Delete
      </button>
    </td>
  `;
  return row;
}

// Load Updates
async function loadUpdates() {
  try {
    const response = await fetch('/api/updates');
    updates = await response.json();
    renderUpdates();
  } catch (error) {
    console.error('Error loading updates:', error);
    showNotification('Error loading updates', 'error');
  }
}

// Render Updates
function renderUpdates() {
  updatesTableBody.innerHTML = '';
  updates.sort((a, b) => new Date(b.date) - new Date(a.date));
  updates.forEach(update => {
    updatesTableBody.appendChild(createUpdateRow(update));
  });
}

// Edit Update
function editUpdate(id) {
  const update = updates.find(u => u.id === id);
  if (!update) return;

  editingId = id;
  updateTitleInput.value = update.title;
  updateDateInput.value = update.date;
  updateCategoryInput.value = update.category;
  updateContentInput.value = update.content;
  
  updateForm.style.display = 'block';
  updateForm.querySelector('h2').textContent = 'Edit Update';
}

// Delete Update
async function deleteUpdate(id) {
  if (!confirm('Are you sure you want to delete this update?')) return;

  try {
    const response = await fetch(`/api/updates/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      updates = updates.filter(u => u.id !== id);
      renderUpdates();
      showNotification('Update deleted successfully', 'success');
    } else {
      throw new Error('Failed to delete update');
    }
  } catch (error) {
    console.error('Error deleting update:', error);
    showNotification('Error deleting update', 'error');
  }
}

// Show Notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Handle Form Submit
updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const updateData = {
    title: updateTitleInput.value,
    date: updateDateInput.value,
    category: updateCategoryInput.value,
    content: updateContentInput.value
  };

  try {
    const url = editingId ? `/api/updates/${editingId}` : '/api/updates';
    const method = editingId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      const updatedUpdate = await response.json();
      
      if (editingId) {
        updates = updates.map(u => u.id === editingId ? updatedUpdate : u);
      } else {
        updates.push(updatedUpdate);
      }
      
      renderUpdates();
      hideAddForm();
      showNotification(
        editingId ? 'Update edited successfully' : 'Update added successfully',
        'success'
      );
    } else {
      throw new Error('Failed to save update');
    }
  } catch (error) {
    console.error('Error saving update:', error);
    showNotification('Error saving update', 'error');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadUpdates); 