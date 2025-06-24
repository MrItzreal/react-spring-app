package com.izzy.stack.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.izzy.stack.dtos.CreateTodoRequestDto;
import com.izzy.stack.dtos.TaskPatchDTO;
import com.izzy.stack.dtos.TodoDto;
import com.izzy.stack.services.TodoService;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
      @AuthenticationPrincipal Jwt principal) {
    String userId = principal.getSubject();
    return todoService.getTodosForUser(userId);
  }

  // POST /api/todos
  @PostMapping
  public TodoDto createTodo(
      @RequestBody CreateTodoRequestDto request,
      @AuthenticationPrincipal Jwt principal) {
    String userId = principal.getSubject();
    return todoService.createTodo(request, userId);
  }

  // PATCH /api/todos/{id}
  @PatchMapping("/{id}")
  public TodoDto updateTask(@PathVariable("id") Long id,
      @RequestBody TaskPatchDTO patchDTO) {
    return todoService.updateTask(id, patchDTO);
  }

  // DELETE /api/todos/{id}
  @DeleteMapping("/{id}")
  public void deleteTodo(@PathVariable("id") Long id) {
    todoService.deleteTodo(id);
  }

}