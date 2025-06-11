package com.izzy.stack.dtos;

// For sending data to the client
public record TodoDto(
    Long id,
    String task,
    boolean isCompleted) {

}