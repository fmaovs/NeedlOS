import './crearN.css'

const CrearNuevo = '../../../../public/media/img/crear.png'

export default function CrearNSec({ visible }) {
    return(
        <button className='cont-crear-nuevo' id={visible}>
            <img src={CrearNuevo} className='img-crear-nuevo'/>
        </button>
    )
}