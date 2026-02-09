# driver-garage-backend

Backend for driver assistant project — **Clean Architecture**, module-by-module.

## Structure

- **Presentation** → **Application** → **Domain** → **Infrastructure**
- Business logic organized by **domain modules** (auth, driver, garage, appointments, etc.), not by technical layer.

## Layout

```
src/
├── main/          # App bootstrap (app.js, server.js, routes.js)
├── config/        # Database, env, logger
├── shared/        # Middleware, errors, utils, constants
└── modules/       # One folder per domain (auth, admin, driver, garage, …)
    └── <module>/
        ├── domain/
        ├── application/
        ├── infrastructure/
        └── presentation/
            └── routes.js
```

## Modules

| Module | Responsibility |
|--------|----------------|
| auth | Admin, driver, garage auth |
| admin | Garage approval, admin management, moderation, reported posts |
| driver | Driver profile, settings, driver-specific views |
| garage | Garage profile, settings, garage-specific views |
| vehicles | Vehicle CRUD and related |
| maintenance | Maintenance & reminders |
| appointments | Appointments (driver, garage, admin) |
| community | Posts, comments, likes, bookmarks, reports |
| education | Education content |
| services | Service locator |
| notifications | Notifications |
| ai | AI assistant |
| onsiteAssistance | On-site assistance |
| ratings | Ratings & reviews |
| settings | Driver & garage settings |

## Run

```bash
npm install
npm run dev
```

Default: `http://localhost:3000`.
