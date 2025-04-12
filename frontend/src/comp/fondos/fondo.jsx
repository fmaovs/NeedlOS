import './fondo.css'

import video from '../../assets/video/background.mp4'

export default function Fondo() {
  return (
    <video autoPlay muted loop className="fondo-fronPage">
      <source src={video} type="video/mp4" />
    </video>
  );
}