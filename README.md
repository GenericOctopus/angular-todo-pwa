# Todo PWA

A Progressive Web Application (PWA) for managing your todo list, built with Angular. This application works offline and provides a native-like experience on both desktop and mobile devices.

## Features

- **Offline Support**: Continue using the app even without an internet connection
- **Installable**: Add to your home screen for quick access
- **Responsive Design**: Works on all devices and screen sizes
- **Todo Management**: Create, read, update, and delete todo items
- **Filtering**: Filter todos by status (active/completed) and priority
- **Persistence**: Your todos are saved locally using IndexedDB

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Production Build

To build the project for production, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

### Testing the PWA

To test the PWA features including offline functionality, you need to build and serve the production version:

```bash
ng build
npx http-server -p 8080 -c-1 dist/angular-todo-pwa/browser
```

Then open your browser and navigate to `http://localhost:8080/`.

## Deployment

### GitHub Pages

This project is configured for easy deployment to GitHub Pages. Follow these steps to deploy:

1. Make sure you have a GitHub repository for this project
2. Ensure your changes are committed and pushed to your repository
3. Run the deploy script:

```bash
npm run deploy
```

This will:
- Build the application with the correct base href for GitHub Pages
- Create or update the `gh-pages` branch in your repository
- Push the built application to the `gh-pages` branch

4. After deployment, your application will be available at:
   `https://[your-github-username].github.io/angular-todo-pwa/`

5. If this is your first deployment, you may need to enable GitHub Pages in your repository settings:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Select the `gh-pages` branch as the source
   - Save the changes

### Custom Domain (Optional)

If you want to use a custom domain:

1. Add your domain in the GitHub repository settings
2. Create a CNAME file in the `public` folder with your domain name
3. Update the `baseHref` in `angular.json` to match your domain

## Technical Details

### Architecture

- **Frontend**: Angular 20.2.0
- **PWA Support**: Angular Service Worker
- **Offline Storage**: IndexedDB
- **Styling**: CSS with component-scoped styles

### Project Structure

- `src/app/components/`: Contains all Angular components
- `src/app/services/`: Contains the Todo service for data management
- `src/app/models/`: Contains the Todo model interface
- `public/`: Contains PWA assets like manifest and icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.
