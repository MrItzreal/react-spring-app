package com.izzy.stack.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.izzy.stack.dtos.CreateTodoRequestDto;
import com.izzy.stack.dtos.TodoDto;
import com.izzy.stack.services.TodoService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  // GET /api/todos
  @GetMapping
  public List<TodoDto> getTodosForUser(
      @RequestHeader("X-User-ID") String userId) {
    return todoService.getTodosForUser(userId);
  }

  // POST /api/todos
  @PostMapping
  public TodoDto createTodo(
      @RequestHeader("X-User-ID") String userId,
      @RequestBody CreateTodoRequestDto request) {
    return todoService.createTodo(request, userId);
  }

  // PUT /api/todos/{id}
  // DELETE /api/todos/{id}

}