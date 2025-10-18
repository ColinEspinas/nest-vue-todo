<template>
  <div class="todos-container">
    <header class="header">
      <h1>Mes Tâches</h1>
      <button @click="handleLogout" class="logout-btn">Déconnexion</button>
    </header>

    <div class="content">
      <div class="add-todo-section">
        <h2>Ajouter une tâche</h2>
        <form @submit.prevent="handleAddTodo">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Titre *</label>
              <input
                id="title"
                v-model="newTodo.title"
                type="text"
                placeholder="Titre de la tâche"
                maxlength="50"
                required
              />
              <small>{{ newTodo.title.length }}/50 caractères</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="content">Contenu *</label>
              <textarea
                id="content"
                v-model="newTodo.content"
                placeholder="Description de la tâche"
                maxlength="256"
                required
              ></textarea>
              <small>{{ newTodo.content.length }}/256 caractères</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priorité *</label>
              <select id="priority" v-model="newTodo.priority" required>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>

            <div class="form-group">
              <label for="executionDate">Date d'exécution</label>
              <input
                id="executionDate"
                v-model="newTodo.executionDate"
                type="text"
                placeholder="JJ/MM/AAAA"
                @blur="validateDate"
              />
              <small v-if="dateError" class="error">{{ dateError }}</small>
            </div>
          </div>

          <div v-if="error" class="error">{{ error }}</div>
          <button type="submit" class="btn-primary">Ajouter</button>
        </form>
      </div>

      <div class="todos-list">
        <h2>Liste des tâches</h2>
        <div v-if="todoStore.loading" class="loading">Chargement...</div>
        <div v-else-if="todoStore.todos.length === 0" class="no-todos">
          Aucune tâche pour le moment
        </div>
        <div v-else class="todo-items">
          <div
            v-for="todo in todoStore.todos"
            :key="todo.id"
            :class="['todo-item', `priority-${todo.priority}`, { completed: todo.completed }]"
          >
            <div class="todo-header">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="handleToggleComplete(todo.id)"
              />
              <h3>{{ todo.title }}</h3>
              <span :class="`priority-badge priority-${todo.priority}`">
                {{ priorityLabel(todo.priority) }}
              </span>
            </div>
            <p class="todo-content">{{ todo.content }}</p>
            <div class="todo-footer">
              <span v-if="todo.executionDate" class="execution-date">
                📅 {{ todo.executionDate }}
              </span>
              <button @click="handleDeleteTodo(todo.id)" class="btn-delete">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useTodoStore } from '../stores/todos';
import type { CreateTodoDto } from '../types';

const router = useRouter();
const authStore = useAuthStore();
const todoStore = useTodoStore();

const newTodo = ref<CreateTodoDto>({
  title: '',
  content: '',
  priority: 'medium',
  executionDate: '',
});

const error = ref('');
const dateError = ref('');

onMounted(() => {
  todoStore.fetchTodos();
});

function priorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
  };
  return labels[priority] || priority;
}

function validateDate() {
  dateError.value = '';
  if (newTodo.value.executionDate && !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(newTodo.value.executionDate)) {
    dateError.value = 'Le format doit être JJ/MM/AAAA';
  }
}

async function handleAddTodo() {
  error.value = '';
  dateError.value = '';

  if (newTodo.value.title.length > 50) {
    error.value = 'Le titre doit contenir moins de 50 caractères';
    return;
  }

  if (newTodo.value.content.length > 256) {
    error.value = 'Le contenu doit contenir moins de 256 caractères';
    return;
  }

  if (newTodo.value.executionDate) {
    if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(newTodo.value.executionDate)) {
      dateError.value = 'Le format doit être JJ/MM/AAAA';
      return;
    }
  }

  const todoData: CreateTodoDto = {
    title: newTodo.value.title,
    content: newTodo.value.content,
    priority: newTodo.value.priority,
  };

  if (newTodo.value.executionDate) {
    todoData.executionDate = newTodo.value.executionDate;
  }

  const success = await todoStore.createTodo(todoData);

  if (success) {
    newTodo.value = {
      title: '',
      content: '',
      priority: 'medium',
      executionDate: '',
    };
  } else {
    error.value = 'Erreur lors de l\'ajout de la tâche';
  }
}

async function handleToggleComplete(id: string) {
  await todoStore.toggleComplete(id);
}

async function handleDeleteTodo(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    await todoStore.deleteTodo(id);
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.todos-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #667eea;
  color: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
}

.logout-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #f0f0f0;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.add-todo-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.add-todo-section h2 {
  margin-top: 0;
  color: #333;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

small {
  display: block;
  margin-top: 5px;
  color: #888;
  font-size: 12px;
}

.error {
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 14px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #5568d3;
}

.todos-list {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.todos-list h2 {
  margin-top: 0;
  color: #333;
}

.loading,
.no-todos {
  text-align: center;
  color: #888;
  padding: 40px;
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #ddd;
  transition: all 0.3s;
}

.todo-item.priority-high {
  border-left-color: #e74c3c;
}

.todo-item.priority-medium {
  border-left-color: #f39c12;
}

.todo-item.priority-low {
  border-left-color: #3498db;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed h3,
.todo-item.completed .todo-content {
  text-decoration: line-through;
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.todo-header input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-header h3 {
  margin: 0;
  flex: 1;
  color: #333;
}

.priority-badge {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.priority-badge.priority-high {
  background: #e74c3c;
}

.priority-badge.priority-medium {
  background: #f39c12;
}

.priority-badge.priority-low {
  background: #3498db;
}

.todo-content {
  margin: 10px 0;
  color: #666;
  line-height: 1.5;
}

.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.execution-date {
  color: #888;
  font-size: 14px;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .header {
    padding: 20px;
  }
  
  .content {
    padding: 20px 10px;
  }
  
  .add-todo-section,
  .todos-list {
    padding: 20px;
  }
}
</style>
