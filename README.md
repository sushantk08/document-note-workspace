# 📝 Document & Note Management Workspace

A modern, full-stack **Single Page Application (SPA)** for organizing Markdown notes, interactive checklists, and code snippets with **full-text search, metadata tagging, filtering, analytics, and containerized deployment**.

Built with **React, FastAPI, Pydantic, MongoDB, Docker, and Nginx**, this project demonstrates modern full-stack development, asynchronous API communication, NoSQL data modeling, search optimization, and multi-container application architecture.

---

## 🌟 Overview

The **Document & Note Management Workspace** is a decoupled full-stack application designed to provide a centralized workspace for managing different kinds of technical and productivity documents.

The application uses:

- **React SPA** for the interactive frontend.
- **FastAPI** for high-performance asynchronous REST APIs.
- **MongoDB** for flexible document-oriented data storage.
- **Pydantic v2** for request validation and polymorphic schemas.
- **Docker Compose** for multi-container application orchestration.
- **Nginx** for serving the production frontend and reverse proxying API requests.

A key design feature is **polymorphic document modeling**, allowing standard Markdown notes, checklists, and code snippets to coexist within the same MongoDB collection while maintaining type-specific validation.

---

## 🎯 Project Highlights

This project demonstrates practical understanding of:

- RESTful API development with FastAPI.
- Asynchronous Python programming.
- MongoDB document modeling and aggregation pipelines.
- Pydantic v2 validation and discriminated unions.
- React component-based architecture.
- Global state management using React Context.
- Axios-based client-server communication.
- Full-text search with MongoDB indexes and relevance scoring.
- Responsive UI development with Tailwind CSS.
- Docker multi-container architecture.
- Nginx reverse proxy and SPA routing.
- Environment-based configuration.
- CRUD operations and partial resource updates.
- Search, filtering, sorting, pagination, and analytics.

---

## 🚀 Key Features

### 🗂️ Polymorphic Note Management

Supports three different document types inside a single MongoDB collection:

- `standard` — Markdown-based documents.
- `checklist` — Interactive task/checklist documents.
- `code` — Syntax-highlighted programming snippets.

Each type has its own fields while sharing common metadata such as title, tags, pinned status, archived status, and timestamps.

---

### 🔎 Full-Text Compound Search

The backend provides MongoDB-powered full-text search across multiple document fields.

Searchable information includes:

- Note titles.
- Markdown content.
- Tags.
- Checklist item text.
- Code explanations.

Weighted indexes are used to give important fields such as titles higher relevance than supporting content.

The API also supports filtering, sorting, and pagination so that large collections can be queried efficiently.

---

### 📝 Live Markdown Editor

The frontend provides a split-pane Markdown editing experience.

Features include:

- Live preview.
- GitHub-Flavored Markdown support.
- Tables.
- Task lists.
- Headings.
- Code blocks.
- Links and formatting.
- Real-time preview using `react-markdown`.
- GitHub-Flavored Markdown support using `remark-gfm`.

---

### ✅ Interactive Checklists

Checklist notes provide task-oriented functionality.

Features include:

- Add checklist items.
- Edit checklist items.
- Mark items as completed.
- Calculate completion percentage.
- Display real-time progress.
- Store completion state in MongoDB.

This provides a practical example of handling nested document structures in MongoDB.

---

### 💻 Code Snippet Management

Code notes are designed for storing reusable programming examples.

Each code snippet can contain:

- Programming language.
- Source code.
- Explanation.
- Tags.
- Title.
- Pin/archive state.

Additional functionality includes:

- Syntax-aware code presentation.
- One-click copy-to-clipboard.
- Documentation/explanation fields.
- Easy organization through tags and search.

---

### 📊 Workspace Analytics

The backend uses MongoDB aggregation pipelines to calculate workspace-level metrics.

Statistics include:

- Total number of notes.
- Active notes.
- Archived notes.
- Pinned notes.
- Notes grouped by type.
- Tag frequency and distribution.

This demonstrates practical usage of MongoDB aggregation rather than calculating every statistic on the client.

---

### 📌 Pin & Archive Management

Notes can be independently:

- Pinned for quick access.
- Archived to remove them from the active workspace.
- Unpinned.
- Restored from an archived state.

The frontend provides dedicated controls for these operations.

---

### 🔄 SPA Experience

The application follows a Single Page Application model.

Users can:

- Search notes.
- Filter notes.
- Switch views.
- Create notes.
- Edit notes.
- Delete notes.
- Pin notes.
- Archive notes.

These operations happen through API requests without requiring complete browser page reloads.

---

### 📱 Responsive UI

The frontend is designed to adapt across:

- Desktop screens.
- Tablets.
- Mobile devices.

Tailwind CSS is used for responsive layout, spacing, typography, and component styling.

---

## 🏗️ Application Architecture

```text
                         ┌─────────────────────────┐
                         │        Browser          │
                         │                         │
                         │      React SPA          │
                         │  Vite + Tailwind CSS    │
                         └────────────┬────────────┘
                                      │
                                      │ HTTP / REST
                                      ▼
                         ┌─────────────────────────┐
                         │        Nginx            │
                         │                         │
                         │ Static Files            │
                         │ SPA Routing             │
                         │ API Reverse Proxy       │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │        FastAPI           │
                         │                         │
                         │ REST API                │
                         │ Pydantic Validation     │
                         │ Business Logic          │
                         │ Repository Layer        │
                         └────────────┬────────────┘
                                      │
                                      │ Async MongoDB
                                      ▼
                         ┌─────────────────────────┐
                         │        MongoDB           │
                         │                         │
                         │ Notes Collection        │
                         │ Text Indexes             │
                         │ Aggregation Pipelines    │
                         │ Persistent Storage       │
                         └─────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v4 |
| **UI & Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Markdown** | React-Markdown, Remark-GFM |
| **Backend** | Python 3.11, FastAPI |
| **Validation** | Pydantic v2 |
| **Database Driver** | Motor |
| **Database** | MongoDB 7.0 |
| **API Server** | Uvicorn |
| **Web Server** | Nginx Alpine |
| **Containerization** | Docker, Docker Compose |
| **Database UI** | Mongo Express |
| **Version Control** | Git, GitHub |

---

## 📁 Repository Structure

```text
document-note-workspace/
│
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   │   └── Pydantic Settings and environment configuration
│   │   │
│   │   ├── database.py
│   │   │   └── Async MongoDB connection and lifespan management
│   │   │
│   │   ├── main.py
│   │   │   └── FastAPI application entry point and CORS configuration
│   │   │
│   │   ├── schemas/
│   │   │   └── note.py
│   │   │       └── Polymorphic Pydantic schemas and discriminated unions
│   │   │
│   │   ├── repositories/
│   │   │   └── note_repository.py
│   │   │       └── MongoDB CRUD, search, filtering, and aggregation logic
│   │   │
│   │   └── routers/
│   │       └── notes.py
│   │           └── REST API route handlers
│   │
│   ├── .dockerignore
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   │   └── Search bar, sorting, and view controls
│   │   │   │
│   │   │   ├── MarkdownRenderer.jsx
│   │   │   │   └── GitHub-Flavored Markdown renderer
│   │   │   │
│   │   │   ├── NewNoteModal.jsx
│   │   │   │   └── Polymorphic note creation modal
│   │   │   │
│   │   │   ├── NoteCard.jsx
│   │   │   │   └── Individual note card and type indicator
│   │   │   │
│   │   │   ├── NoteEditor.jsx
│   │   │   │   └── Editor for Markdown, checklist, and code notes
│   │   │   │
│   │   │   └── Sidebar.jsx
│   │   │       └── Navigation, filters, and dynamic tags
│   │   │
│   │   ├── context/
│   │   │   └── NoteContext.jsx
│   │   │       └── Global React state and API dispatcher
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │       └── Axios HTTP client configuration
│   │   │
│   │   ├── App.jsx
│   │   │   └── Main application layout
│   │   │
│   │   ├── index.css
│   │   │   └── Tailwind CSS imports and global styles
│   │   │
│   │   └── main.jsx
│   │       └── React application entry point
│   │
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

Make sure the following tools are installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for containerized execution.
- [Node.js](https://nodejs.org/) v18+ for local frontend development.
- [Python](https://www.python.org/) 3.10+ for local backend development.
- Git for source control.

---

## 🐳 Option A: Run with Docker Compose

Docker Compose is the recommended approach because it starts the frontend, backend, MongoDB, and Mongo Express services together.

### 1. Clone the Repository

```bash
git clone https://github.com/sushantk08/document-note-workspace.git
cd document-note-workspace
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update the `.env` file with the required MongoDB and application configuration.

### 3. Build and Start All Services

```bash
docker compose up --build -d
```

### 4. Check Running Containers

```bash
docker compose ps
```

### 5. Open the Applications

- **Frontend UI:** http://localhost:3000
- **FastAPI Swagger Docs:** http://localhost:8000/docs
- **FastAPI ReDoc:** http://localhost:8000/redoc
- **Mongo Express:** http://localhost:8081

### 6. Stop the Application

```bash
docker compose down
```

To stop the application and remove persistent volumes:

```bash
docker compose down -v
```

---

## 💻 Option B: Local Manual Development

### 1. Start MongoDB

MongoDB can be started using Docker:

```bash
docker compose up mongodb -d
```

---

### 2. Start the FastAPI Backend

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

#### Windows

```powershell
.\venv\Scripts\activate
```

#### macOS/Linux

```bash
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend will be available at:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

---

### 3. Start the React Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend development server will normally run at:

```text
http://localhost:5173
```

---

## 📡 REST API Reference

### Health Checks

| **Method** | **Endpoint** | **Description** |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns FastAPI service status |
| `GET` | `/api/health/db` | Verifies MongoDB connectivity |

---

### Note Operations

| **Method** | **Endpoint** | **Query Parameters / Body** | **Description** |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes/` | `skip`, `limit`, `tag`, `note_type`, `is_archived`, `is_pinned`, `search`, `sort_by`, `sort_order` | Filter, search, sort, and paginate notes |
| `POST` | `/api/notes/` | `NoteCreate` JSON payload | Create a polymorphic note |
| `GET` | `/api/notes/{id}` | `id` path parameter | Retrieve a single note |
| `PATCH` | `/api/notes/{id}` | `NoteUpdate` JSON payload | Partially update a note |
| `DELETE` | `/api/notes/{id}` | `id` path parameter | Permanently delete a note |
| `PATCH` | `/api/notes/{id}/pin` | `id` path parameter | Toggle pinned state |
| `PATCH` | `/api/notes/{id}/archive` | `id` path parameter | Toggle archived state |

---

### Metadata & Analytics

| **Method** | **Endpoint** | **Description** |
| :--- | :--- | :--- |
| `GET` | `/api/notes/tags` | Returns distinct tags with occurrence counts |
| `GET` | `/api/notes/stats/summary` | Returns workspace-level statistics and type breakdown |

---

## 🧬 Polymorphic Data Models

### 1. Standard Markdown Note

```json
{
  "title": "System Architecture Overview",
  "note_type": "standard",
  "tags": [
    "architecture",
    "backend"
  ],
  "is_pinned": true,
  "is_archived": false,
  "content": "# System Architecture\nThis document describes the decoupled architecture..."
}
```

---

### 2. Checklist Note

```json
{
  "title": "Release Checklist",
  "note_type": "checklist",
  "tags": [
    "deployment",
    "qa"
  ],
  "is_pinned": false,
  "is_archived": false,
  "items": [
    {
      "id": "1",
      "text": "Run unit and integration tests",
      "completed": true
    },
    {
      "id": "2",
      "text": "Build Docker containers",
      "completed": true
    },
    {
      "id": "3",
      "text": "Verify API health check",
      "completed": false
    }
  ]
}
```

---

### 3. Code Snippet Note

```json
{
  "title": "MongoDB Text Index Creation",
  "note_type": "code",
  "tags": [
    "database",
    "python"
  ],
  "is_pinned": false,
  "is_archived": false,
  "language": "python",
  "code": "await collection.create_index([('title', 'text'), ('content', 'text')], weights={'title': 10, 'content': 5})",
  "explanation": "Creates a compound text index with field weights to enable relevance-scored full-text search."
}
```

---

## 🔍 Search & Filtering

The notes endpoint supports multiple query parameters that can be combined.

Example:

```text
/api/notes/?search=mongodb&tag=backend&note_type=code&is_pinned=true&sort_by=updated_at&sort_order=desc
```

Supported filtering capabilities include:

- Full-text search.
- Tag filtering.
- Note type filtering.
- Archived state filtering.
- Pinned state filtering.
- Sorting.
- Pagination.
- Relevance-based searching.

This allows the frontend to construct flexible queries without implementing search logic directly in the browser.

---

## 📊 Analytics & Aggregation

MongoDB aggregation pipelines are used to generate workspace statistics.

Example information returned by the analytics endpoint may include:

```json
{
  "total": 42,
  "active": 35,
  "archived": 7,
  "pinned": 8,
  "by_type": {
    "standard": 18,
    "checklist": 12,
    "code": 12
  }
}
```

Tag statistics are also calculated server-side so that the frontend receives ready-to-display aggregated results.

---

## 🔐 Configuration

Environment-specific configuration is separated from application code using environment variables.

Example configuration:

```env
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DATABASE=note_workspace
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=admin
```

A sample `.env.example` file is included in the repository.

Sensitive values should not be committed to Git.

---

## 🐳 Docker Services

The Docker Compose environment contains multiple services:

| Service | Purpose |
| :--- | :--- |
| **frontend** | Builds and serves the React production application through Nginx |
| **backend** | Runs the FastAPI application |
| **mongodb** | Persistent MongoDB database |
| **mongo-express** | Web-based MongoDB administration interface |

Persistent MongoDB storage is configured through Docker volumes so that database contents survive container restarts.

---

## 🧱 Backend Design

The backend follows a layered structure:

```text
API Request
    ↓
FastAPI Router
    ↓
Pydantic Validation
    ↓
Repository Layer
    ↓
MongoDB
    ↓
Response Serialization
    ↓
Frontend
```

This separation keeps API routing, validation, database operations, and application behavior easier to maintain and extend.

---

## ⚙️ Frontend Design

The React application is organized around reusable components and shared application state.

```text
App
├── Header
├── Sidebar
├── NoteCard
├── NoteEditor
├── NewNoteModal
└── MarkdownRenderer
```

Global note state is handled through:

```text
context/NoteContext.jsx
```

API communication is centralized through:

```text
services/api.js
```

This avoids duplicating HTTP request logic across individual components.

---

## 🧪 API Testing

The easiest way to test the backend is through the automatically generated Swagger interface:

```text
http://localhost:8000/docs
```

Swagger can be used to test:

- GET requests.
- POST requests.
- PATCH requests.
- DELETE requests.
- Query parameters.
- JSON request payloads.
- API validation behavior.

---

## 📌 Example API Workflow

A typical workflow looks like this:

```text
1. User creates a Markdown note
          ↓
2. React sends POST /api/notes/
          ↓
3. FastAPI validates the request using Pydantic
          ↓
4. Repository stores the document in MongoDB
          ↓
5. API returns the created note
          ↓
6. React updates the workspace state
          ↓
7. Note appears immediately in the UI
```

For search:

```text
User enters search term
        ↓
React sends search query
        ↓
FastAPI receives request
        ↓
MongoDB text index performs search
        ↓
Results are sorted/relevance scored
        ↓
FastAPI returns matching documents
        ↓
React renders filtered results
```

---

## 🧠 Technical Challenges Solved

### Polymorphic MongoDB Documents

Different note types require different fields while still sharing common metadata.

The application solves this using Pydantic discriminated unions and a `note_type` discriminator.

### Flexible Search

Instead of downloading all documents and filtering in JavaScript, search and filtering are performed server-side using MongoDB.

### Nested Checklist Data

Checklist items are stored as nested structures inside MongoDB documents, allowing related task data to remain together.

### Production Frontend Serving

The frontend uses a multi-stage Docker build to compile the React application and then serve the production assets through lightweight Nginx.

### SPA Routing & API Proxying

Nginx is configured to support client-side SPA routing and proxy API requests to the FastAPI backend.

---

## 📈 Possible Future Improvements

Potential improvements for a future version include:

- User authentication and authorization.
- JWT-based login.
- Multiple workspaces.
- Note sharing and collaboration.
- File and image attachments.
- Advanced Markdown editor.
- Drag-and-drop note organization.
- Note version history.
- Automated backups.
- Redis caching.
- Elasticsearch/OpenSearch for advanced search.
- Automated unit and integration testing.
- CI/CD deployment using GitHub Actions.
- Cloud deployment using AWS.

---

## 🎓 What This Project Demonstrates

This project is intended to demonstrate practical full-stack engineering skills, including:

- Designing REST APIs.
- Building asynchronous Python services.
- Working with FastAPI.
- Creating reusable React components.
- Managing application state.
- Designing MongoDB schemas.
- Implementing full-text search.
- Writing aggregation pipelines.
- Building responsive user interfaces.
- Containerizing applications with Docker.
- Configuring Nginx.
- Managing environment variables.
- Connecting frontend and backend services.
- Structuring a maintainable full-stack repository.

---

## 📜 License

This project is licensed under the MIT License.
