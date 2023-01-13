import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

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
    <div
      className={`flex items-center border-[1px] border-black mx-4 pl-4 ${
        props.query ? "border-b-0 text-sm h-12 w-80" : "text-md h-16 w-[640px]"
      }`}
    >
      <BiSearch className="mr-2" />
      <input
        type="text"
        className={`bg-transparent outline-none w-full h-full pr-4`}
        value={query}
        placeholder="Search for an artist..."
        onChange={handleQuery}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default Search;
