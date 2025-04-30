import Header from "./components/header/header";
import Map from "./components/map/map";

function App() {
  return (
    <div className="App">
      <Header/>
      <div className="app__body">
        <Map/>
      </div>
    </div>
  );
}

export default App;
