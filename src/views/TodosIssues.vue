<template>
  <div>
    <h1>lista de tareas</h1>
    <form @submit.prevent="addTodo()">
      <el-input placeholder="todo" v-model="todo"></el-input>
    </form>
    <el-row :gutter="12">
      <TodoItem
        v-for="(todo, index) in todos"
        :key="'todo-' + index"
        :todo="todo"
        :index="index"
        @remove-todo="removeTodo"
      />
      <TodoItem
        v-for="(issue, index) in issues"
        :key="'issue-' + index"
        :todo="issue.title"
        :index="index"
        @remove-todo="closeIssue"
      />
    </el-row>
  </div>
</template>

<script>
import axios from 'axios';
import TodoItem from '@/components/TodoItem.vue';

const client = axios.create({
  baseURL: `${process.env.VUE_APP_GITHUB_ENDPOINT}`,
  headers: {
    'Authorization': `token ${process.env.VUE_APP_GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  },
});

export default {
  name: 'TodosIssues',
  components: {
    TodoItem
  },
  data() {
    return {
      todo: '',
      todos: [],
      issues: []
    }
  },
  methods: {
    addTodo() {
      this.todos.push(this.todo);
      this.todo = '';
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    closeIssue(index) {
      const target = this.issues[index];
      client.patch(`/repos/${process.env.VUE_APP_GITHUB_REPO}/issues/${target.number}`, {
          state: 'closed'
        })
        .then(() => {
          this.issues.splice(index, 1);
        });
    },
    getIssues() {
      const repo = process.env.VUE_APP_GITHUB_REPO;
      console.log('Fetching issues for repo:', repo);
      if (!repo) {
        console.error('GitHub repo is not defined in environment variables');
        return;
      }
      this.loading = true;
      this.error = null;
      client.get(`/repos/${repo}/issues`)
        .then((res) => {
          console.log('Issues fetched successfully:', res.data);
          this.issues = res.data;
        })
        .catch((error) => {
          console.error('Error fetching issues:', error.response || error);
          this.error = 'Error al cargar los issues. Por favor, intenta de nuevo.';
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getIssues();
  }
}
</script>
