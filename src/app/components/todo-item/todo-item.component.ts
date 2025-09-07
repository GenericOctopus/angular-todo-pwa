import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-item" [class.completed]="todo.completed" [class.editing]="isEditing">
      <div class="todo-item-view" *ngIf="!isEditing">
        <div class="todo-item-content">
          <input 
            type="checkbox" 
            class="todo-checkbox" 
            [checked]="todo.completed" 
            (change)="toggleComplete.emit(todo)"
          >
          <div class="todo-details">
            <span class="todo-title" [class.completed]="todo.completed">{{ todo.title }}</span>
            @if (todo.description) {
              <p class="todo-description">{{ todo.description }}</p>
            }
            @if (todo.priority) {
              <span class="todo-priority" [class]="'priority-' + todo.priority">
                {{ todo.priority }}
              </span>
            }
          </div>
        </div>
        <div class="todo-actions">
          <button class="edit-btn" (click)="startEditing()">Edit</button>
          <button class="delete-btn" (click)="deleteTodo.emit(todo.id)">Delete</button>
        </div>
      </div>
      
      <div class="todo-item-edit" *ngIf="isEditing">
        <div class="edit-form">
          <div class="form-group">
            <label for="title">Title:</label>
            <input 
              type="text" 
              id="title" 
              [(ngModel)]="editedTodo.title" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea 
              id="description" 
              [(ngModel)]="editedTodo.description"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="priority">Priority:</label>
            <select id="priority" [(ngModel)]="editedTodo.priority">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div class="edit-actions">
            <button class="save-btn" (click)="saveEdit()">Save</button>
            <button class="cancel-btn" (click)="cancelEdit()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .todo-item {
      background-color: #fff;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .todo-item.completed {
      opacity: 0.7;
      background-color: #f9f9f9;
    }
    
    .todo-item-view {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .todo-item-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }
    
    .todo-checkbox {
      margin-top: 4px;
    }
    
    .todo-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .todo-title {
      font-weight: 500;
      font-size: 18px;
    }
    
    .todo-title.completed {
      text-decoration: line-through;
      color: #888;
    }
    
    .todo-description {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
    
    .todo-priority {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      width: fit-content;
    }
    
    .priority-high {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    .priority-medium {
      background-color: #fff8e1;
      color: #ff8f00;
    }
    
    .priority-low {
      background-color: #e8f5e9;
      color: #388e3c;
    }
    
    .todo-actions {
      display: flex;
      gap: 8px;
    }
    
    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .edit-btn {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .edit-btn:hover {
      background-color: #bbdefb;
    }
    
    .delete-btn {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    .delete-btn:hover {
      background-color: #ffcdd2;
    }
    
    .todo-item-edit {
      margin-top: 8px;
    }
    
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .form-group label {
      font-weight: 500;
      font-size: 14px;
      color: #555;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .form-group textarea {
      min-height: 80px;
      resize: vertical;
    }
    
    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    
    .save-btn {
      background-color: #e8f5e9;
      color: #388e3c;
    }
    
    .save-btn:hover {
      background-color: #c8e6c9;
    }
    
    .cancel-btn {
      background-color: #f5f5f5;
      color: #616161;
    }
    
    .cancel-btn:hover {
      background-color: #e0e0e0;
    }
  `]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleComplete = new EventEmitter<Todo>();
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() editTodo = new EventEmitter<Todo>();
  
  isEditing = false;
  editedTodo!: Todo;
  
  startEditing(): void {
    this.isEditing = true;
    this.editedTodo = { ...this.todo };
  }
  
  saveEdit(): void {
    if (this.editedTodo.title.trim()) {
      this.editTodo.emit(this.editedTodo);
      this.isEditing = false;
    }
  }
  
  cancelEdit(): void {
    this.isEditing = false;
  }
}
