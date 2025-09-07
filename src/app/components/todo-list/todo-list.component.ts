import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent, TodoFormComponent],
  template: `
    <div class="todo-container">
      <h1>Todo List</h1>
      
      <div class="filters">
        <div class="filter-group">
          <label>Status:</label>
          <select [(ngModel)]="statusFilter" (change)="applyFilters()">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Priority:</label>
          <select [(ngModel)]="priorityFilter" (change)="applyFilters()">
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      <app-todo-form (todoAdded)="onTodoAdded($event)"></app-todo-form>
      
      <div class="todo-list">
        @if (todos.length === 0) {
          <p class="no-todos">No todos found. Add a new one!</p>
        } @else {
          @for (todo of todos; track todo.id) {
            <app-todo-item 
              [todo]="todo" 
              (toggleComplete)="onToggleComplete($event)"
              (deleteTodo)="onDeleteTodo($event)"
              (editTodo)="onEditTodo($event)">
            </app-todo-item>
          }
        }
      </div>
      
      <div class="todo-summary">
        <p>{{ getActiveTodosCount() }} items left</p>
        <button (click)="clearCompleted()" [disabled]="!hasCompletedTodos()">Clear completed</button>
      </div>
    </div>
  `,
  styles: [`
    .todo-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .filters {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .todo-list {
      margin-top: 20px;
    }
    
    .no-todos {
      text-align: center;
      color: #666;
      font-style: italic;
    }
    
    .todo-summary {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
  `]
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  statusFilter: 'all' | 'active' | 'completed' = 'all';
  priorityFilter: 'all' | 'high' | 'medium' | 'low' = 'all';
  
  constructor(private todoService: TodoService) {}
  
  ngOnInit(): void {
    this.loadTodos();
  }
  
  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.applyFilters();
    });
  }
  
  applyFilters(): void {
    let completedFilter: boolean | undefined = undefined;
    if (this.statusFilter === 'active') {
      completedFilter = false;
    } else if (this.statusFilter === 'completed') {
      completedFilter = true;
    }
    
    const priorityFilter = this.priorityFilter !== 'all' ? this.priorityFilter : undefined;
    
    this.todoService.getFilteredTodos(completedFilter, priorityFilter).subscribe(filteredTodos => {
      this.todos = filteredTodos;
    });
  }
  
  onTodoAdded(todo: Todo): void {
    this.applyFilters();
  }
  
  onToggleComplete(todo: Todo): void {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo).subscribe(() => {
      this.applyFilters();
    });
  }
  
  onDeleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.applyFilters();
    });
  }
  
  onEditTodo(todo: Todo): void {
    this.todoService.updateTodo(todo).subscribe(() => {
      this.applyFilters();
    });
  }
  
  getActiveTodosCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }
  
  hasCompletedTodos(): boolean {
    return this.todos.some(todo => todo.completed);
  }
  
  clearCompleted(): void {
    const completedTodos = this.todos.filter(todo => todo.completed);
    completedTodos.forEach(todo => {
      this.todoService.deleteTodo(todo.id).subscribe();
    });
  }
}
