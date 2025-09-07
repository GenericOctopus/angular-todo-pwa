import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-form">
      <h2>Add New Todo</h2>
      <form (ngSubmit)="addTodo()" #todoForm="ngForm">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            [(ngModel)]="newTodo.title" 
            required 
            #title="ngModel"
            placeholder="What needs to be done?"
          >
          <div class="error" *ngIf="title.invalid && (title.dirty || title.touched)">
            Title is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="description">Description (optional)</label>
          <textarea 
            id="description" 
            name="description" 
            [(ngModel)]="newTodo.description" 
            placeholder="Add details about this task"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="priority">Priority</label>
          <select 
            id="priority" 
            name="priority" 
            [(ngModel)]="newTodo.priority"
          >
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          [disabled]="!newTodo.title?.trim()"
        >
          Add Todo
        </button>
      </form>
    </div>
  `,
  styles: [`
    .todo-form {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 20px;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #555;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    textarea {
      min-height: 80px;
      resize: vertical;
    }
    
    .error {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 4px;
    }
    
    button {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    button:hover:not(:disabled) {
      background-color: #1565c0;
    }
    
    button:disabled {
      background-color: #bbdefb;
      cursor: not-allowed;
    }
  `]
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<Todo>();
  
  newTodo: Partial<Todo> = {
    title: '',
    description: '',
    priority: 'medium',
    completed: false
  };
  
  constructor(private todoService: TodoService) {}
  
  addTodo(): void {
    if (this.newTodo.title?.trim()) {
      this.todoService.addTodo({
        title: this.newTodo.title,
        description: this.newTodo.description,
        priority: this.newTodo.priority as 'low' | 'medium' | 'high',
        completed: false
      }).subscribe(todo => {
        this.todoAdded.emit(todo);
        this.resetForm();
      });
    }
  }
  
  resetForm(): void {
    this.newTodo = {
      title: '',
      description: '',
      priority: 'medium',
      completed: false
    };
  }
}
