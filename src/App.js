import Header from "./components/header/header";
import Map from "./components/map/map";

function App() {
  return (
    <div className="App">
      <Header/>
      <div className="app__body">
        <h1 className="app_title container">
          Green Cyprus
        </h1>
        <Map/>
      </div>
    </div>
  );
}

export default App;
