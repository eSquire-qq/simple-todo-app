const API_URL = "http://localhost:4000/todos";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

async function loadTodos() {
  const response = await fetch(API_URL);
  const todos = await response.json();

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${todo.title}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">
        Видалити
      </button>
    `;

    todoList.appendChild(li);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = input.value.trim();

  if (!title) {
    alert("Введи задачу");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  input.value = "";
  loadTodos();
});

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  loadTodos();
}

loadTodos();
