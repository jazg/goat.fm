import { useEffect, useState } from "react";

interface SearchProps {
  query: string;
  setQuery: (query: string) => void;
}

function Search(props: SearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(props.query);
  }, [props.query]);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.setQuery(query);
    }
  };

  return (
    <input
      type="text"
      className="h-9 border-[1px] border-b-0 border-black outline-none w-80 text-xs px-4"
      value={query}
      placeholder="Search for an artist..."
      onChange={handleQuery}
      onKeyDown={handleKeyDown}
    />
  );
}

export default Search;
