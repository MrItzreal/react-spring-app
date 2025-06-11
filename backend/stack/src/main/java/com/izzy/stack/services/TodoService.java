package com.izzy.stack.services;

import org.springframework.stereotype.Service;
import com.izzy.stack.repositories.TodoRepository;

@Service
public class TodoService {
  private final TodoRepository repository;

  // Constructor
  public TodoService(TodoRepository repository) {
    this.repository = repository;
  }

  // Methods:
  // getTodosForUser(String userId) -> returns List<TodoDto>
  // createTodo(CreateTodoRequest request, String userId) -> returns TodoDto
  // updateTodoStatus(Long todoId, boolean isCompleted, String userId) -> returns
  // deleteTodo(Long todoId, String userId)
}
