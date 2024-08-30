<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Vue.js To-Do App</h1>
        <AddTodo @add-todo="addTodo" />
        <v-list>
          <v-list-item
            v-for="(todo, index) in todos"
            :key="index"
            @click="$router.push({ name: 'ToDoDetail', params: { id: todo.id } })"
          >
            <template v-slot:prepend>
              <v-checkbox
                v-model="todo.completed"
                @click.stop="toggleTodoStatus(todo)"
                hide-details
              />
            </template>
            
            <v-list-item-title>{{ todo.title }}</v-list-item-title>
            
            <template v-slot:append>
              <v-btn icon="mdi-delete" size="small" @click.stop="removeTodo(todo.id)">
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

      <!-- 페이징 UI -->
       <v-pagination 
       v-model="currentPage"
       :length="totalPages"
       @input="fetchTodos"
       />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import todos from '@/store/modules/todos';
import AddTodo from './AddTodo.vue'
import todoService from '@/services/todoService';

export default {
  name: 'ToDoList',
  components: { AddTodo },
  watch: {
    currentPage() {
      this.fetchTodos()
    }
  },
  data() {
    return {
      todos: [],
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,

    }
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await todoService.getTodos(this.currentPage -1, this.pageSize)
        console.log(response)
        this.todos = response.data.content
        this.totalPages = response.data.totalPages
      } catch (error) {
          console.error('Error fetchTodos todo : ', error)
      }
    },
    async toggleTodoStatus(todo) {
      try {
        const updateTodo = {...todo, completed: !todo.completed}
        const response = await todoService.updateTodo(todo.id, updateTodo)
        this.fetchTodos()
      } catch(error) {
        console.error('Error toggleTodoStatus todo : ', error)
      }
    },
    async addTodo(todoTitle) {
      try {
          const newTodo = {title: todoTitle, completed: false}
          const response = await todoService.createTodo(newTodo)
          this.fetchTodos()
      } catch(error) {
        console.error('Error addTodo todo : ', error)
      }
    },
    async removeTodo(id) {
      try {
          const response = await todoService.deleteTodo(id)
          this.fetchTodos()
        } catch(error) {
        console.error('Error removeTodo todo : ', error)
      }
    }
  },
  created() {
    this.fetchTodos();
  }
}
</script>