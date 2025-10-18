import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todosApi } from '../api/todos';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types';

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([]);
  const loading = ref(false);

  async function fetchTodos() {
    loading.value = true;
    try {
      todos.value = await todosApi.getAll();
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      loading.value = false;
    }
  }

  async function createTodo(data: CreateTodoDto) {
    try {
      const newTodo = await todosApi.create(data);
      todos.value.unshift(newTodo);
      return true;
    } catch (error) {
      console.error('Error creating todo:', error);
      return false;
    }
  }

  async function updateTodo(id: string, data: UpdateTodoDto) {
    try {
      const updatedTodo = await todosApi.update(id, data);
      const index = todos.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        todos.value[index] = updatedTodo;
      }
      return true;
    } catch (error) {
      console.error('Error updating todo:', error);
      return false;
    }
  }

  async function deleteTodo(id: string) {
    try {
      await todosApi.delete(id);
      todos.value = todos.value.filter((t) => t.id !== id);
      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      return false;
    }
  }

  async function toggleComplete(id: string) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      return updateTodo(id, { completed: !todo.completed });
    }
    return false;
  }

  return {
    todos,
    loading,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
});
