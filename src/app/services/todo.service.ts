import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos = new BehaviorSubject<Todo[]>([]);
  private dbName = 'todo-pwa-db';
  private storeName = 'todos';
  private db!: IDBDatabase;

  constructor() {
    this.initDB();
  }

  private initDB(): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        store.createIndex('completed', 'completed', { unique: false });
        store.createIndex('priority', 'priority', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.loadAllTodos();
    };
  }

  private loadAllTodos(): void {
    const transaction = this.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      this.todos.next(request.result);
    };

    request.onerror = (event) => {
      console.error('Error loading todos:', event);
    };
  }

  getTodos(): Observable<Todo[]> {
    return this.todos.asObservable();
  }

  getTodoById(id: string): Observable<Todo | undefined> {
    return from(new Promise<Todo | undefined>((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Error getting todo');
      };
    })).pipe(
      catchError(error => {
        console.error('Error getting todo:', error);
        return of(undefined);
      })
    );
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Observable<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: todo.completed || false
    };

    return from(new Promise<Todo>((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(newTodo);

      request.onsuccess = () => {
        resolve(newTodo);
      };

      request.onerror = () => {
        reject('Error adding todo');
      };
    })).pipe(
      tap(todo => {
        const currentTodos = this.todos.value;
        this.todos.next([...currentTodos, todo]);
      }),
      catchError(error => {
        console.error('Error adding todo:', error);
        throw error;
      })
    );
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const updatedTodo: Todo = {
      ...todo,
      updatedAt: new Date()
    };

    return from(new Promise<Todo>((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(updatedTodo);

      request.onsuccess = () => {
        resolve(updatedTodo);
      };

      request.onerror = () => {
        reject('Error updating todo');
      };
    })).pipe(
      tap(updatedTodo => {
        const currentTodos = this.todos.value;
        const index = currentTodos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          const newTodos = [...currentTodos];
          newTodos[index] = updatedTodo;
          this.todos.next(newTodos);
        }
      }),
      catchError(error => {
        console.error('Error updating todo:', error);
        throw error;
      })
    );
  }

  deleteTodo(id: string): Observable<void> {
    return from(new Promise<void>((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject('Error deleting todo');
      };
    })).pipe(
      tap(() => {
        const currentTodos = this.todos.value;
        this.todos.next(currentTodos.filter(todo => todo.id !== id));
      }),
      catchError(error => {
        console.error('Error deleting todo:', error);
        throw error;
      })
    );
  }

  getFilteredTodos(completed?: boolean, priority?: string): Observable<Todo[]> {
    return this.todos.pipe(
      map(todos => {
        let filteredTodos = [...todos];
        
        if (completed !== undefined) {
          filteredTodos = filteredTodos.filter(todo => todo.completed === completed);
        }
        
        if (priority) {
          filteredTodos = filteredTodos.filter(todo => todo.priority === priority);
        }
        
        return filteredTodos;
      })
    );
  }
}
