<template>
  <header>
    <nav>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li><RouterLink to="/contact">Contact</RouterLink></li>
      </ul>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
  <footer>
    <p>&copy; 2024 My Website</p>
  </footer>
</template>
