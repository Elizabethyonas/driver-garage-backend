# Code Writing Conventions

This document outlines the coding standards and conventions for the **driver-garage-backend** project. All code must adhere to these conventions to ensure consistency, maintainability, and scalability.

---

## Table of Contents

1. [General Principles](#general-principles)
2. [Naming Conventions](#naming-conventions)
3. [File Organization](#file-organization)
4. [TypeScript Conventions](#typescript-conventions)
5. [Clean Architecture Patterns](#clean-architecture-patterns)
6. [Code Style](#code-style)
7. [Error Handling](#error-handling)
8. [Documentation](#documentation)
9. [Testing Conventions](#testing-conventions)
10. [Git Conventions](#git-conventions)

---

## General Principles

### 1. **Clean Architecture First**
- Always respect layer boundaries
- Dependencies flow inward: Presentation → Application → Domain ← Infrastructure
- Domain layer must never depend on outer layers

### 2. **Type Safety**
- Use TypeScript strictly (no `any` types unless absolutely necessary)
- Enable strict mode in `tsconfig.json`
- Prefer interfaces over types for object shapes
- Use enums for fixed sets of values

### 3. **Single Responsibility**
- Each class/function should have one clear purpose
- Keep functions small and focused
- Avoid god classes or functions

### 4. **DRY (Don't Repeat Yourself)**
- Extract common logic into shared utilities
- Reuse DTOs, validators, and mappers where appropriate
- Avoid code duplication across features

---

## Naming Conventions

### Files & Directories

#### File Naming
- **Use kebab-case** for all file names: `user-repository.ts`, `create-driver.usecase.ts`
- **Use PascalCase** for class files that export a single class: `UserRepository.ts`, `CreateDriverUseCase.ts`
- **Use descriptive names**: `get-driver-by-id.usecase.ts` not `get.ts`
- **Suffix files by purpose**:
  - Use cases: `*.usecase.ts` or `*.use-case.ts`
  - DTOs: `*.dto.ts`
  - Entities: `*.entity.ts`
  - Repositories: `*.repository.ts`
  - Controllers: `*.controller.ts`
  - Validators: `*.validator.ts`
  - Mappers: `*.mapper.ts`
  - Types: `*.types.ts`
  - Interfaces: `*.interface.ts`

#### Directory Naming
- **Use camelCase** for feature directories: `garageApproval`, `userManagement`
- **Use lowercase** for layer directories: `presentation`, `application`, `domain`, `infrastructure`

### Code Naming

#### Variables & Functions
```typescript
// ✅ Good: camelCase for variables and functions
const driverId = 123;
const getUserById = async (id: string) => { };
const isEmailValid = (email: string) => { };

// ❌ Bad
const driver_id = 123;
const GetUserById = async (id: string) => { };
const IsEmailValid = (email: string) => { };
```

#### Classes & Interfaces
```typescript
// ✅ Good: PascalCase for classes and interfaces
class DriverRepository { }
interface IUserService { }
type CreateDriverRequest = { }

// ❌ Bad
class driverRepository { }
interface userService { }
```

#### Constants
```typescript
// ✅ Good: UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 10;
const API_BASE_URL = 'https://api.example.com';

// ✅ Good: camelCase for enum-like objects
const UserRoles = {
  ADMIN: 'admin',
  DRIVER: 'driver',
  GARAGE: 'garage'
} as const;
```

#### Enums
```typescript
// ✅ Good: PascalCase for enum name, PascalCase for values
enum AppointmentStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Completed = 'COMPLETED'
}

// ✅ Good: Use const enum for better performance
const enum UserRole {
  Admin = 'ADMIN',
  Driver = 'DRIVER',
  Garage = 'GARAGE'
}
```

#### Private Members
```typescript
// ✅ Good: Prefix private members with underscore
class DriverService {
  private _driverRepository: IDriverRepository;
  
  private _validateDriver(driver: Driver): boolean {
    // ...
  }
}
```

---

## File Organization

### Module Structure Pattern

Each feature within a module should follow this structure:

```
feature-name/
├── presentation/
│   ├── routes/
│   │   └── feature-name.routes.ts
│   ├── controllers/
│   │   └── feature-name.controller.ts
│   └── validators/
│       └── feature-name.validator.ts
├── application/
│   ├── usecases/
│   │   ├── create-feature.usecase.ts
│   │   ├── get-feature-by-id.usecase.ts
│   │   └── update-feature.usecase.ts
│   └── dto/
│       ├── create-feature.dto.ts
│       └── feature-response.dto.ts
├── domain/
│   ├── entities/
│   │   └── feature.entity.ts
│   └── repositories/
│       └── feature.repository.interface.ts
└── infrastructure/
    ├── prisma/
    │   └── feature.prisma.mapper.ts
    ├── repositories/
    │   └── feature.repository.ts
    └── mappers/
        └── feature.mapper.ts
```

### File Exports

#### Use Named Exports
```typescript
// ✅ Good: Named exports
export class DriverRepository { }
export interface IDriverService { }
export const createDriver = async () => { };

// ❌ Avoid: Default exports (except for main entry points)
export default class DriverRepository { }
```

#### Index Files
```typescript
// ✅ Good: Use index.ts for clean imports
// src/modules/driver/profile/application/usecases/index.ts
export { CreateProfileUseCase } from './create-profile.usecase';
export { UpdateProfileUseCase } from './update-profile.usecase';
export { GetProfileUseCase } from './get-profile.usecase';

// Usage
import { CreateProfileUseCase, UpdateProfileUseCase } from './usecases';
```

---

## TypeScript Conventions

### Type Definitions

#### Prefer Interfaces for Object Shapes
```typescript
// ✅ Good: Interface for object shapes
interface CreateDriverRequest {
  name: string;
  email: string;
  phone: string;
}

// ✅ Good: Type for unions, intersections, or computed types
type DriverStatus = 'active' | 'inactive' | 'suspended';
type DriverWithProfile = Driver & { profile: DriverProfile };
```

#### Use Type Aliases for Complex Types
```typescript
// ✅ Good: Type alias for complex types
type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

### Strict Typing

```typescript
// ✅ Good: Explicit return types
async function getDriverById(id: string): Promise<Driver | null> {
  // ...
}

// ✅ Good: Type inference for simple cases
const driverId = '123'; // inferred as string
const count = 10; // inferred as number

// ❌ Bad: Using 'any'
function processData(data: any): any {
  // ...
}

// ✅ Good: Use 'unknown' when type is truly unknown
function processData(data: unknown): void {
  if (typeof data === 'string') {
    // TypeScript knows data is string here
  }
}
```

### Optional vs Nullable

```typescript
// ✅ Good: Use optional for truly optional fields
interface Driver {
  id: string;
  name: string;
  email?: string; // Optional
  phone: string | null; // Explicitly nullable
}

// ✅ Good: Use null for "not set" vs undefined for "missing"
const driver: Driver = {
  id: '1',
  name: 'John',
  email: undefined, // Not provided
  phone: null // Explicitly set to null
};
```

### Enums vs Union Types

```typescript
// ✅ Good: Use enum for fixed set of values that might expand
enum AppointmentStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}

// ✅ Good: Use union type for simple, unlikely-to-change values
type UserRole = 'admin' | 'driver' | 'garage';
```

---

## Clean Architecture Patterns

### Dependency Injection

```typescript
// ✅ Good: Constructor injection
class CreateDriverUseCase {
  constructor(
    private readonly driverRepository: IDriverRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(request: CreateDriverRequest): Promise<Driver> {
    // ...
  }
}

// ❌ Bad: Direct instantiation
class CreateDriverUseCase {
  async execute(request: CreateDriverRequest): Promise<Driver> {
    const repository = new DriverRepository(); // ❌
    // ...
  }
}
```

### Repository Pattern

```typescript
// ✅ Good: Domain repository interface
// domain/repositories/driver.repository.interface.ts
export interface IDriverRepository {
  findById(id: string): Promise<Driver | null>;
  findByEmail(email: string): Promise<Driver | null>;
  create(driver: Driver): Promise<Driver>;
  update(id: string, data: Partial<Driver>): Promise<Driver>;
  delete(id: string): Promise<void>;
}

// ✅ Good: Infrastructure implementation
// infrastructure/repositories/driver.repository.ts
export class DriverRepository implements IDriverRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Driver | null> {
    const data = await this.prisma.driver.findUnique({ where: { id } });
    return data ? DriverMapper.toDomain(data) : null;
  }
  // ...
}
```

### Use Case Pattern

```typescript
// ✅ Good: Single-purpose use case
export class CreateDriverUseCase {
  constructor(
    private readonly driverRepository: IDriverRepository,
    private readonly validator: IValidator
  ) {}

  async execute(request: CreateDriverRequest): Promise<CreateDriverResponse> {
    // 1. Validate input
    await this.validator.validate(request);

    // 2. Business logic
    const driver = Driver.create({
      name: request.name,
      email: request.email,
      phone: request.phone
    });

    // 3. Persist
    const savedDriver = await this.driverRepository.create(driver);

    // 4. Return result
    return CreateDriverResponse.from(driver);
  }
}
```

### DTO Pattern

```typescript
// ✅ Good: Separate request/response DTOs
export class CreateDriverRequest {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string
  ) {}

  static from(body: unknown): CreateDriverRequest {
    // Validation and transformation
    return new CreateDriverRequest(
      body.name,
      body.email,
      body.phone
    );
  }
}

export class DriverResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}

  static from(driver: Driver): DriverResponse {
    return new DriverResponse(
      driver.id,
      driver.name,
      driver.email
    );
  }
}
```

---

## Code Style

### Formatting

- Use **2 spaces** for indentation
- Use **single quotes** for strings (unless escaping)
- Use **semicolons** at end of statements
- Use **trailing commas** in objects and arrays
- Maximum line length: **100 characters**

```typescript
// ✅ Good
const driver = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
};

// ❌ Bad
const driver = {id:"123",name:"John Doe",email:"john@example.com"}
```

### Imports

```typescript
// ✅ Good: Group imports
// 1. External dependencies
import express from 'express';
import { PrismaClient } from '@prisma/client';

// 2. Internal modules (absolute paths)
import { IDriverRepository } from '@/modules/driver/domain/repositories';
import { CreateDriverUseCase } from '@/modules/driver/application/usecases';

// 3. Relative imports
import { DriverMapper } from '../mappers/driver.mapper';

// ✅ Good: Use path aliases (configure in tsconfig.json)
import { Driver } from '@domain/driver/entities';
import { CreateDriverDTO } from '@application/driver/dto';
```

### Functions

```typescript
// ✅ Good: Async/await over promises
async function getDriver(id: string): Promise<Driver | null> {
  try {
    const driver = await this.repository.findById(id);
    return driver;
  } catch (error) {
    throw new DriverNotFoundError(id);
  }
}

// ❌ Bad: Promise chains
function getDriver(id: string): Promise<Driver | null> {
  return this.repository.findById(id)
    .then(driver => driver)
    .catch(error => {
      throw new DriverNotFoundError(id);
    });
}
```

### Early Returns

```typescript
// ✅ Good: Early returns for guard clauses
function validateDriver(driver: Driver): void {
  if (!driver.name) {
    throw new ValidationError('Name is required');
  }
  
  if (!driver.email) {
    throw new ValidationError('Email is required');
  }
  
  if (!isValidEmail(driver.email)) {
    throw new ValidationError('Invalid email format');
  }
  
  // Main logic here
}

// ❌ Bad: Nested if statements
function validateDriver(driver: Driver): void {
  if (driver.name) {
    if (driver.email) {
      if (isValidEmail(driver.email)) {
        // Main logic here
      }
    }
  }
}
```

### Destructuring

```typescript
// ✅ Good: Destructure when appropriate
const { id, name, email } = driver;
const updatedDriver = { ...driver, email: newEmail };

// ✅ Good: Destructure function parameters
function createDriver({ name, email, phone }: CreateDriverRequest): Driver {
  // ...
}

// ❌ Bad: Over-destructuring
const { id } = driver; // Just use driver.id
```

---

## Error Handling

### Custom Error Classes

```typescript
// ✅ Good: Domain-specific errors
export class DriverNotFoundError extends DomainError {
  constructor(public readonly driverId: string) {
    super(`Driver with ID ${driverId} not found`);
    this.name = 'DriverNotFoundError';
  }
}

export class InvalidEmailError extends DomainError {
  constructor(public readonly email: string) {
    super(`Invalid email format: ${email}`);
    this.name = 'InvalidEmailError';
  }
}
```

### Error Handling in Use Cases

```typescript
// ✅ Good: Let domain errors bubble up, catch infrastructure errors
async execute(request: CreateDriverRequest): Promise<Driver> {
  try {
    // Business logic that may throw domain errors
    const driver = Driver.create(request);
    return await this.repository.create(driver);
  } catch (error) {
    if (error instanceof DomainError) {
      throw error; // Re-throw domain errors
    }
    // Wrap infrastructure errors
    throw new ApplicationError('Failed to create driver', error);
  }
}
```

### Error Handling in Controllers

```typescript
// ✅ Good: Controllers catch and format errors
async createDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const request = CreateDriverRequest.from(req.body);
    const driver = await this.createDriverUseCase.execute(request);
    res.status(201).json(DriverResponse.from(driver));
  } catch (error) {
    next(error); // Pass to error middleware
  }
}
```

### Result Pattern (Optional)

```typescript
// ✅ Good: Use Result pattern for operations that may fail
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function getDriver(id: string): Promise<Result<Driver, DriverNotFoundError>> {
  const driver = await this.repository.findById(id);
  if (!driver) {
    return { success: false, error: new DriverNotFoundError(id) };
  }
  return { success: true, data: driver };
}
```

---

## Documentation

### JSDoc Comments

```typescript
// ✅ Good: Document public APIs
/**
 * Creates a new driver in the system.
 * 
 * @param request - The driver creation request containing name, email, and phone
 * @returns The created driver entity
 * @throws {ValidationError} If the request data is invalid
 * @throws {EmailAlreadyExistsError} If the email is already registered
 * 
 * @example
 * ```typescript
 * const request = new CreateDriverRequest('John Doe', 'john@example.com', '+1234567890');
 * const driver = await useCase.execute(request);
 * ```
 */
async execute(request: CreateDriverRequest): Promise<Driver> {
  // ...
}
```

### Inline Comments

```typescript
// ✅ Good: Explain "why", not "what"
// Cache for 5 minutes to reduce database load during peak hours
const cachedDriver = await this.cache.get(`driver:${id}`, 300);

// ❌ Bad: Obvious comments
// Get driver by ID
const driver = await this.repository.findById(id);
```

### README Files

Each feature module should have a `README.md` explaining:
- Purpose of the feature
- Key use cases
- Important domain rules
- Dependencies

---

## Testing Conventions

### Test File Naming

```typescript
// ✅ Good: Mirror source structure
// Source: src/modules/driver/profile/application/usecases/create-profile.usecase.ts
// Test:   tests/unit/modules/driver/profile/application/usecases/create-profile.usecase.test.ts
```

### Test Structure

```typescript
// ✅ Good: Arrange-Act-Assert pattern
describe('CreateProfileUseCase', () => {
  let useCase: CreateProfileUseCase;
  let mockRepository: jest.Mocked<IDriverRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    } as any;
    
    useCase = new CreateProfileUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create a profile successfully', async () => {
      // Arrange
      const request = new CreateProfileRequest('John Doe', 'john@example.com');
      const expectedDriver = Driver.create({ ...request, id: '123' });
      mockRepository.create.mockResolvedValue(expectedDriver);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(ProfileResponse.from(expectedDriver));
      expect(mockRepository.create).toHaveBeenCalledWith(expect.any(Driver));
    });

    it('should throw ValidationError when email is invalid', async () => {
      // Arrange
      const request = new CreateProfileRequest('John Doe', 'invalid-email');

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(ValidationError);
    });
  });
});
```

### Mocking

```typescript
// ✅ Good: Mock interfaces, not implementations
const mockRepository: jest.Mocked<IDriverRepository> = {
  findById: jest.fn(),
  create: jest.fn(),
} as any;

// ✅ Good: Use factories for test data
function createTestDriver(overrides?: Partial<Driver>): Driver {
  return Driver.create({
    id: '123',
    name: 'Test Driver',
    email: 'test@example.com',
    ...overrides,
  });
}
```

---

## Git Conventions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(driver): add vehicle management endpoints
fix(auth): resolve JWT token expiration issue
docs(readme): update API documentation
refactor(garage): extract service status logic to use case
test(driver): add unit tests for profile use cases
```

### Branch Naming

```
<type>/<module>-<feature>
```

**Examples:**
```
feat/driver-vehicle-management
fix/admin-garage-approval
refactor/auth-jwt-handling
```

---

## Additional Best Practices

### 1. **Avoid Business Logic in Controllers**
```typescript
// ❌ Bad: Business logic in controller
async createDriver(req: Request, res: Response): Promise<void> {
  if (!req.body.email.includes('@')) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }
  // ...
}

// ✅ Good: Delegate to use case
async createDriver(req: Request, res: Response): Promise<void> {
  const request = CreateDriverRequest.from(req.body);
  const driver = await this.createDriverUseCase.execute(request);
  res.status(201).json(DriverResponse.from(driver));
}
```

### 2. **Use Value Objects for Domain Concepts**
```typescript
// ✅ Good: Value object for email
export class Email {
  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new InvalidEmailError(value);
    }
  }

  static create(value: string): Email {
    return new Email(value);
  }

  toString(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### 3. **Keep Functions Pure When Possible**
```typescript
// ✅ Good: Pure function
function calculateTotalPrice(items: Item[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}

// ❌ Bad: Side effects
function calculateTotalPrice(items: Item[]): number {
  let total = 0;
  items.forEach(item => {
    total += item.price;
    console.log(`Added ${item.price}`); // Side effect
  });
  return total;
}
```

### 4. **Use Constants for Magic Numbers/Strings**
```typescript
// ❌ Bad: Magic numbers
if (retries > 3) { }

// ✅ Good: Named constants
const MAX_RETRY_ATTEMPTS = 3;
if (retries > MAX_RETRY_ATTEMPTS) { }
```

---

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] All code follows naming conventions
- [ ] Types are properly defined (no `any`)
- [ ] Clean Architecture layers are respected
- [ ] Error handling is implemented
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] Environment variables are used (no hardcoded values)
- [ ] Code is formatted (run linter/formatter)
- [ ] Imports are organized and unused imports removed

---

## Tools & Configuration

### Recommended Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files
- **Jest**: Testing framework
- **TypeScript**: Strict mode enabled

### Example `.eslintrc.json`

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---

## Summary

- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces, kebab-case for files
- **Structure**: Follow Clean Architecture layers strictly
- **Types**: Use TypeScript strictly, prefer interfaces over types
- **Errors**: Use custom error classes, handle errors appropriately per layer
- **Tests**: Write tests for all use cases, mock dependencies
- **Documentation**: Document public APIs with JSDoc
- **Git**: Use conventional commits and descriptive branch names

**Remember**: Code is read more often than it's written. Write code that is clear, maintainable, and follows these conventions.

