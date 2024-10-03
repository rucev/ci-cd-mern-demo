import useUser from '../hooks/useUser';

const Home = () => {
  const { username, logout } = useUser();

  if (username) return (
    <section className="home">
      <h2 className="home__welcome">Hello, {username}</h2>
      <div className="home__buttons">
        <button onClick={logout}>Logout</button>
      </div>
    </section>
  );
}

export default Home;

