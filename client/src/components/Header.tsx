import Search from "./Search";

interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
}

function Header(props: HeaderProps) {
  return (
    <div className="flex justify-center border-b-[1px] border-black pt-3 px-8">
      <Search query={props.query} setQuery={props.setQuery} />
    </div>
  );
}

export default Header;
