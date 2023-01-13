import Search from "./Search";

interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
}

function Header(props: HeaderProps) {
  return (
    <div
      className={`flex ${
        props.query
          ? "justify-center border-b-[1px] border-black pt-3 px-8"
          : "flex-col items-center h-screen"
      }`}
    >
      {!props.query && <h1 className="mt-72 mb-12">goat.fm</h1>}
      <Search query={props.query} setQuery={props.setQuery} />
    </div>
  );
}

export default Header;
