package com.izzy.stack.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.izzy.stack.services.TodoService;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  // GET /api/todos
  // POST /api/todos
  // PUT /api/todos/{id}
  // DELETE /api/todos/{id}
}