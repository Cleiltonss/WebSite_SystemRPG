import './Home.css'; // CSS local dentro da pasta Home
import Menu from '../../components/Menu/Menu'; // ajuste conforme estrutura real

export default function Home() {
  return (
    <div className="home-page">
      <header className="header-content">
        <img src="./images_home/rpg.png" alt="RPG Logo" className="header-image" />
        <h1>Bem-vindo ao Sistema NEMO!</h1>
      </header>

      {/* Cabeçalho roxo universal */}
      <Menu>
        <button onClick={() => (window.location.href = '/')}>Início</button>
        <button onClick={() => (window.location.href = '/system')}>Sistema</button>
        <button onClick={() => (window.location.href = '/equipment')}>Equipamento</button>
        <button onClick={() => (window.location.href = '/character')}>Personagem</button>
        <button onClick={() => (window.location.href = '/dice')}>Dados</button>
        <button onClick={() => (window.location.href = '/map')}>Mapa</button>
      </Menu>

      {/* ... resto da página ... */}
    </div>
  );
}
