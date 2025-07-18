import './Dice.css'; // CSS local dentro da pasta Home
import Menu from '../../components/Menu/Menu'; // ajuste conforme estrutura real
import { useNavigate } from 'react-router-dom';

export default function Dice() {
  const navigate = useNavigate();

  return (
    <div className="dice-page">
      <Menu>
        <button onClick={() => (window.location.href = '/')}>Inicio</button>
        <button onClick={() => (window.location.href = '/system')}>Sistema</button>
        <button onClick={() => (window.location.href = '/equipment')}>Equipamento</button>
        <button onClick={() => (window.location.href = '/character')}>Personagem</button>
        <button onClick={() => (window.location.href = '/dice')}>Dados</button>
        <button onClick={() => (window.location.href = '/map')}>Mapa</button>
      </Menu>
      {/* Conteúdo da página de dados vai aqui */}
    </div>
  );
}