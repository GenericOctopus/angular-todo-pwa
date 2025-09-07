import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Todo PWA</h1>
        <p>Your tasks, anywhere, anytime - even offline!</p>
      </header>
      
      <main>
        <router-outlet />
      </main>
      
      <footer class="app-footer">
        <p>Todo PWA - Built with Angular</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app-header {
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: white;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 2rem;
    }
    
    .app-header p {
      margin: 0.5rem 0 0;
      opacity: 0.9;
    }
    
    main {
      flex: 1;
      padding: 1rem;
      background-color: #f5f5f5;
    }
    
    .app-footer {
      background-color: #f5f5f5;
      padding: 1rem;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class App {
  title() {
    return 'Todo PWA';
  }
}
