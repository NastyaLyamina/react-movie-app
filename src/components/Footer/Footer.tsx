import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="social-links">
          <a className="social-link" href="https://vk.ru" target="_blank" rel="noreferrer" >
            <img src="/vk-icon.svg" alt="ВКонтакте" />
          </a>
          <a className="social-link" href="https://www.youtube.com" target="_blank" rel="noreferrer" >
            <img src="/youtube-icon.svg" alt="YouTube" />
          </a>
          <a className="social-link" href="https://ok.ru" target="_blank" rel="noreferrer" >
            <img src="/ok-icon.svg" alt="Одноклассники" />
          </a>
          <a className="social-link" href="https://t.me" target="_blank" rel="noreferrer" >
            <img src="/telegram-icon.svg" alt="Telegram" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;