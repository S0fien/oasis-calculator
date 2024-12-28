import "./App.css";
import OasisCalculator from "./components/OasisCalculator";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <div>
      <ThemeProvider>
        <ThemeToggle />
        <OasisCalculator />
      </ThemeProvider>
    </div>
  );
}

export default App;
