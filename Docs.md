# The Izzy Stack Quickstart Guide

This guide provides a step-by-step process for building a full-stack, authenticated CRUD application using the Izzy Stack.

## The Izzy Stack Components

- **Backend**: Java/Spring Boot, Spring Data JPA, Spring Security
- **Database**: Supabase (PostgreSQL)
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Authentication**: Clerk

---

## Part 1: Foundational Setup

### Step 1.1: Create the Monorepo Structure

Create a single root directory for your project and two subdirectories for the frontend and backend.

```bash
mkdir izzy-stack-project
cd izzy-stack-project
mkdir backend
mkdir frontend
```

### Step 1.2: Set Up the Supabase PostgreSQL Database

1.  **Create a Supabase Project**: Go to [Supabase](https://supabase.com/), create a new project, and wait for it to be provisioned.

2.  **Get Connection Details**: Navigate to **Project Settings \> Database**. Note your `Host`, `Port`, `Database name` (usually `postgres`), `User` (`postgres`), and the project-specific `Password`.

3.  **Define the Schema**: Go to the **SQL Editor** in the Supabase dashboard and run a `CREATE TABLE` script. For our To-Do app, this defines the data structure.

    ```sql
    CREATE TABLE todos (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- Auto-incrementing primary key
        task TEXT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE NOT NULL,
        user_id TEXT NOT NULL, -- Will store the Clerk User ID
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
    ```

    > **Key Point**: The `user_id` is `TEXT` because Clerk user IDs are strings.

---

## Part 2: Backend Development (Spring Boot API)

### Step 2.1: Initialize the Spring Boot Project

1.  Go to [start.spring.io](https://start.spring.io).
2.  Select **Maven**, **Java**, and the latest stable Spring Boot version.
3.  Add the following dependencies:
    - **Spring Web**: For building REST APIs.
    - **Spring Data JPA**: For database interaction.
    - **PostgreSQL Driver**: The JDBC driver for your database.
    - **Spring Security**: For securing your API.
    - **OAuth2 Resource Server**: For JWT validation.
4.  Generate the project and place its contents into the `backend` directory.

### Step 2.2: Configure the Database Connection

In `backend/src/main/resources/`, create or modify `application.yml`.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://your-supabase-host:5432/postgres
    username: postgres
    password: "your-supabase-db-password"
  jpa:
    hibernate:
      ddl-auto: update # Use 'update' for development, 'validate' or 'none' for production.
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true
```

### Step 2.3: Define the JPA Entity

Create a `Todo.java` class to map to your `todos` table.

```java
// package...;

import jakarta.persistence.*;

@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String task;
    private boolean isCompleted;
    @Column(name = "user_id") // Maps to the user_id column in the DB
    private String userId;

    // Getters, Setters, Constructors...
}
```

### Step 2.4: Create the Spring Data JPA Repository

Create an interface to handle database operations. Spring Data will implement it automatically.

```java
// package...;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    // This derived query is crucial for isolating user data.
    List<Todo> findByUserId(String userId);
}
```

### Step 2.5: Secure the API with Spring Security & Clerk

1.  **Get Clerk Issuer URI**: Go to your **Clerk Dashboard \> JWT Templates**, select your template, and copy the **Issuer URL**.

2.  **Configure `application.yml` for Security**: Add the security block.

    ```yaml
    spring:
      # ... your datasource and jpa config ...
      security:
        oauth2:
          resourceserver:
            jwt:
              issuer-uri: "https://your-issuer-url-from-clerk.com"
    ```

3.  **Create a `SecurityConfig` Class**: This class defines your API's security rules and enables CORS.

    ```java
    // package...config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.Customizer;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
    import java.util.List;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults()) // Enables CORS with the bean below
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/**").authenticated() // Secure all API endpoints
                    .anyRequest().permitAll()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

            return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Your frontend's origin
            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
            configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);
            return source;
        }
    }
    ```

### Step 2.6: Implement DTOs, Mappers, and Services

Separate concerns by creating dedicated classes for data transfer (`DTOs`), entity-DTO mapping (`Mappers`), and business logic (`Services`). A `Service` should use the `userId` in every method to ensure data isolation.

### Step 2.7: Build the Controller

Expose your service logic via REST endpoints. The controller extracts the `userId` from the validated JWT provided by Clerk.

```java
// package...;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    // ... constructor injection ...

    @GetMapping
    public List<TodoDto> getTodosForUser(@AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject(); // 'sub' claim from JWT is the user ID
        return todoService.getTodosForUser(userId);
    }

    @PostMapping
    public TodoDto createTodo(@RequestBody CreateTodoRequest request, @AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        return todoService.createTodo(request, userId);
    }

    // ... other endpoints for PATCH, DELETE etc. ...
}
```

---

## Part 3: Frontend Development (React App)

### Step 3.1: Initialize the React Project

Inside the `frontend` directory:

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Step 3.2: Set Up Styling & Dependencies

1.  Install Tailwind CSS:

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    ```

    Then follow the official [Tailwind CSS guide for Vite](https://tailwindcss.com/docs/guides/vite).

2.  Install other necessary libraries:

    ```bash
    npm install @clerk/clerk-react axios lucide-react react-router-dom
    ```

### Step 3.3: Configure Clerk Authentication

In `frontend/src/main.tsx`, wrap your application with the `ClerkProvider`.

```typescript
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
```

> Remember to create a `.env.local` file in your `frontend` directory to store `VITE_CLERK_PUBLISHABLE_KEY`.

### Step 3.4: Set Up Protected Routing

In `App.tsx`, use Clerk's components to protect routes that require authentication.

```typescript
// App.tsx
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Todos from "./pages/Todos"; // Example component

const App = () => (
  <Routes>
    {/* ... public routes ... */}
    <Route
      path="/todos"
      element={
        <>
          <SignedIn>
            <Todos />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }
    />
  </Routes>
);

export default App;
```

### Step 3.5: Create the Authenticated API Client

Create a reusable hook to make authenticated API calls. This is the bridge to your backend.

```typescript
// frontend/src/hooks/useApiClient.ts
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const useApiClient = () => {
  const { getToken } = useAuth();

  const makeAuthenticatedRequest = async (config) => {
    // Use your specific Clerk JWT template name
    const token = await getToken({ template: "spring-boot-template" });

    return apiClient({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return { makeAuthenticatedRequest };
};
```

### Step 3.6: Build the UI Component with Logic

Refactor your main component (e.g., `Todos.tsx`) to use a custom hook (e.g., `useTodos.ts`) for all state management and API logic.

- **`useTodos.ts`**: Contains all `useState`, `useEffect`, and handler functions (`handleAddTask`, `deleteTask`, etc.). It calls `makeAuthenticatedRequest` and returns state and functions.
- **`Todos.tsx`**: Calls `const { todos, handleAddTask, ... } = useTodos();` and focuses purely on rendering the JSX.

This completes the full-stack loop, resulting in a secure, functional, and well-structured application. This guide can now serve as your personal template for all future "Izzy Stack" projects.
