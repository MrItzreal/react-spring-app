package com.izzy.stack.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.izzy.stack.entities.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
  List<Todo> findByUserId(String userId);
}
