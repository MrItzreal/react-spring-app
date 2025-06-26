// .TodoDto
export interface Todo {
  id: number;
  task: string;
  isCompleted?: boolean;
}
// .CreateTodoRequestDto
export interface CreateTodoRequest {
  task: string;
}

// .TaskPatchDTO
export interface TaskPatch {
  // Both optional, since PATCH allows partial updates
  task?: string;
  isCompleted?: boolean;
}
