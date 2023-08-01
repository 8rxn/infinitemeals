# InfiteMeals Code Style Guide

The InfiniteMeals project tries to follow general coding guidelines and standards to ensure consistency and maintainability across the codebase. As a contributor, it's essential to adhere to these guidelines when making changes or adding new features. Please read and follow the guidelines below:

## 1. JavaScript Style

- Always use **const** and **let** instead of **var** for variable declarations.
- Prefer **arrow functions** over traditional function expressions for simplicity and lexical scoping.
- Use **template literals** for string interpolation instead of string concatenation.
- End lines with **semicolons**.

## 2. Indentation and Spacing

- Use **2 spaces** for indentation.
- Put spaces around operators, after commas, and after colons in object literals.

## 3. Naming Conventions

- Use **camelCase** for variable and function names (e.g., `const myVariable = 42;`).
- Use **PascalCase** for class and component names (e.g., `class MyComponent extends React.Component`).
- Use **UPPER_CASE_SNAKE_CASE** for constants and configuration variables (e.g., `const API_KEY = "your_api_key";`).

## 4. React Specific

- Use **JSX syntax** for defining React components.
- Separate JSX tags and attributes onto multiple lines, especially for components with many attributes.
- Always include a **key** prop when rendering an array of components.
- Use **prop-types** or TypeScript for prop validation.

## 5. File and Folder Structure

- Organize files and folders logically, following a modular and component-based structure.
- Avoid deep nesting and long file paths.

## 6. Comments and Documentation

- Add **comments** to complex or non-obvious sections of the code to explain their purpose and functionality.
- Write **clear and concise** documentation for public APIs and important functions.

## 8. Error Handling

- Implement proper **error handling** for asynchronous functions and API calls.
- Avoid using generic catch blocks without meaningful error messages.

## 9. Version Control

- Create **small, focused commits** that encapsulate specific changes.
- Use **descriptive commit messages** that explain the purpose of each commit concisely.

---

Adhering to these guidelines will help maintain a clean and consistent codebase, making it easier for everyone to understand and contribute to the project.
