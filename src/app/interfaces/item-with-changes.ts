// EDIT BUTTON
import { TodoItem } from "./todo-item";

export interface ItemWithChanges {
  item: TodoItem;
  changes: Partial<TodoItem>
}
