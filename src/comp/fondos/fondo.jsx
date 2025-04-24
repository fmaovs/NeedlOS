import './fondo.css'

const video = '/public/media/video/background.mp4'

export default function Fondo() {
  return (
    <video autoPlay muted loop className="fondo-fronPage">
      <source src={video} type="video/mp4" />
    </video>
  );
}