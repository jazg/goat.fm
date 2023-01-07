import { useState } from "react";
import Header from "./components/Header";
import Tags from "./components/Tags";
import Results from "./components/Results";
import { Artist } from "./lib/types";

function App() {
  const [token, setToken] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);
  const [suggestions, setSuggestions] = useState([] as Artist[]);

  return (
    <>
      <Header
        token={token}
        setToken={setToken}
        setArtists={setArtists}
        setSuggestions={setSuggestions}
      />
      <Tags suggestions={suggestions} />
      <Results token={token} artists={artists} />
    </>
  );
}

export default App;
