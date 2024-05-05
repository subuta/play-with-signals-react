import { TodoList } from "./components/TodoList.tsx";

function App() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Todos</h2>

      <TodoList />
    </div>
  );
}

export default App;
