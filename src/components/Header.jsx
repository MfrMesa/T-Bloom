import { useLocation, useNavigate } from 'react-router-dom';
import styles from '/src/style/Header.module.css';
import ArrowLeftIcon from '../assets/ArrowLeft.svg';
import logo from '../assets/LogoFlor.png';


export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    if (location.pathname === "/cliente") return null;


  const showBack = location.pathname !== '/' && location.pathname !== "/login" && location.pathname !== "/inicio" && location.pathname !== "/empresa" && location.pathname !== "/cliente"; // Mostrar flecha si no estás en inicio

    return (
        <header className={styles.header}>
        {showBack ? (
            <button className={styles.backButton} onClick={() => navigate(-1)}>
            <img src={ArrowLeftIcon} alt="Atrás" />
            </button>
        ) : (
            <div className={styles.placeholder} />
        )}

            <div className={styles.logo}>
                <img src={logo}/>
            </div>

            <div className={styles.placeholder} />
        </header>
    );
}
