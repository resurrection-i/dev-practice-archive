# Task Management System

A comprehensive task management system built with Go, featuring user authentication, role-based access control, and task tracking functionality.

## Features

- User authentication using JWT
- Role-based access control (RBAC)
- Task management (create, update, delete, assign)
- Task history tracking
- User management
- Configurable via YAML/JSON
- Logging with Zap

## Technologies Used

- Go 1.21+
- Gin Web Framework
- GORM (MySQL)
- JWT for authentication
- Zap for logging
- Viper for configuration
- Validator for input validation

## Prerequisites

- Go 1.21 or higher
- MySQL 5.7 or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management
```

2. Install dependencies:
```bash
go mod download
```

3. Configure the application:
- Copy `config.yaml` and adjust the settings according to your environment
- Set up your MySQL database using the provided `schema.sql`

4. Build and run:
```bash
go build
./task-management
```

## Configuration

The application can be configured using `config.yaml`. Key configuration options include:

```yaml
server:
  port: 8080
  mode: debug

database:
  driver: mysql
  host: localhost
  port: 3306
  username: root
  password: root
  dbname: task_management

jwt:
  secret: your-secret-key
  expire: 24 # hours

log:
  level: debug
  filename: ./logs/app.log
  maxSize: 100
  maxBackups: 3
  maxAge: 28
  compress: true
```

## API Endpoints

### Authentication
- POST `/api/login` - User login
- POST `/api/register` - User registration

### Users
- GET `/api/users` - List all users
- GET `/api/users/:id` - Get user details
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Tasks
- POST `/api/tasks` - Create task
- GET `/api/tasks` - List all tasks
- GET `/api/tasks/:id` - Get task details
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- PUT `/api/tasks/:id/status` - Update task status
- PUT `/api/tasks/:id/assign` - Assign task
- GET `/api/tasks/:id/history` - Get task history

## Role-Based Access Control

The system implements three roles with different permissions:

1. Admin
   - Full access to all features
   - Can manage users and roles

2. Manager
   - Can read user information
   - Full access to task management
   - Can assign tasks

3. User
   - Can create tasks
   - Can read all tasks
   - Can update and delete own tasks

## Default Credentials

The system comes with a default admin user:
- Username: admin
- Password: admin123

## Development

### Project Structure
```
.
├── config/
│   └── config.go
├── handlers/
│   ├── auth.go
│   ├── task.go
│   └── user.go
├── logger/
│   └── logger.go
├── middleware/
│   ├── jwt.go
│   └── rbac.go
├── models/
│   ├── task.go
│   └── user.go
├── routes/
│   └── routes.go
├── config.yaml
├── go.mod
├── main.go
├── README.md
└── schema.sql
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control for authorization
- Input validation for all requests
- Secure configuration management
- Comprehensive logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 