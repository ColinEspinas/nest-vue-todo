<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Inscription</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nom (optionnel)</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Votre nom"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
          <small>Minimum 6 caractères</small>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
      </form>
      <p class="login-link">
        Déjà un compte ? <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleRegister() {
  error.value = '';
  
  if (password.value.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères';
    return;
  }
  
  loading.value = true;
  
  const success = await authStore.register(email.value, password.value, name.value || undefined);
  
  if (success) {
    router.push('/todos');
  } else {
    error.value = 'Une erreur est survenue lors de l\'inscription';
  }
  
  loading.value = false;
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin: 0 0 30px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

small {
  display: block;
  margin-top: 5px;
  color: #888;
  font-size: 12px;
}

button {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #5568d3;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 14px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
