package com.izzy.stack.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.izzy.stack.dtos.CreateTodoRequestDto;
import com.izzy.stack.dtos.TaskPatchDTO;
import com.izzy.stack.dtos.TodoDto;
import com.izzy.stack.entities.Todo;
import com.izzy.stack.repositories.TodoRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TodoService {
  private final TodoRepository repository;

  // Constructor
  public TodoService(TodoRepository repository) {
    this.repository = repository;
  }

  // Methods:
  public List<TodoDto> getTodosForUser(String userId) {
    // Fetch todos for the given userId from the repository
    List<Todo> todos = repository.findByUserId(userId);

    // Map the Todo entities to TodoDto objects
    return todos.stream()
        .map(todo -> new TodoDto(
            todo.getId(), todo.getTask(), todo.getIsCompleted()))
        .collect(Collectors.toList());
  }

  public TodoDto createTodo(CreateTodoRequestDto request, String userId) {
    // Create new todo entity
    Todo newTodo = new Todo(request.task(), false, userId);
    // Save entity to repository
    Todo savedTodo = repository.save(newTodo);
    // Return saved entity as TodoDto
    return new TodoDto(
        savedTodo.getId(),
        savedTodo.getTask(),
        savedTodo.getIsCompleted());
  }

  // updateTodoStatus
  public TodoDto updateTask(Long id, TaskPatchDTO patchDTO) {
    // Fetch task
    Todo todo = repository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Task was not found with: " + id));

    // Update task field
    if (patchDTO.task() != null) {
      todo.setTask(patchDTO.task());
    }

    if (patchDTO.isCompleted() != null) {
      todo.setIsCompleted(patchDTO.isCompleted());
    }

    // Save updated Todo
    Todo updatedTodo = repository.save(todo);

    // Return updated Todo
    return new TodoDto(
        updatedTodo.getId(),
        updatedTodo.getTask(),
        updatedTodo.getIsCompleted());
  }

  // deleteTodo
  public void deleteTodo(Long id) {
    repository.deleteById(id);
  }
}