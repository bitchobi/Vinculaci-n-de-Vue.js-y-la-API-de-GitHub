<template>
  <div>
    <h1>lista de problemas</h1>
    <el-button type="success" @click="getIssues">Obtener emisión</el-button>
    <el-row :gutter="12">
      <el-col :span="12" v-for="(issue, index) in issues" :key="issue.id">
        <el-card class="box-card" shadow="hover" style="margin: 5px 0;">
          <el-row :gutter="12">
            <el-col :span="21">{{ issue.title }}</el-col>
            <el-col :span="3">
              <el-button @click="closeIssue(index)" type="success" icon="el-icon-check" circle></el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.VUE_APP_GITHUB_ENDPOINT,
  headers: {
    'Authorization': `token ${process.env.VUE_APP_GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  },
});

export default {
  name: 'IssueList',
  data() {
    return {
      issues: []
    }
  },
  methods: {
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
    },
    closeIssue(index) {
      const target = this.issues[index];
      client.patch(`/repos/${process.env.VUE_APP_GITHUB_REPO}/issues/${target.number}`, {
          state: 'closed'
        })
        .then(() => {
          this.issues.splice(index, 1);
        });
    }
  },
  created() {
    this.getIssues();
  }
}
</script>
