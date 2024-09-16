import Link from 'next/link';

const HeaderMain = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/admin">Admin</Link></li>
          <li><Link href="/user">User</Link></li>
        </ul>
      </nav>
    </header>
  );
};
export default HeaderMain;