import Link from "next/link";
const Navbar = () => {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/imagegeneration">Image</Link>
      </li>
      <li>
        <Link href="/speech">Speech</Link>
      </li>
      <li>
        <Link href="/record">record</Link>
      </li>
      <li>
        <Link href="/text">text</Link>
      </li>
      <li>
        <Link href="/voice">voice</Link>
      </li>
    </ul>
  );
};

export default Navbar;
