import './secciones.css'

export default function Secciones({ img , txt , clase }) {
    return(
        <div className={clase}>
            <img src={img} className="img-seccion"/>
            <span className="text-seccion">{txt}</span>
        </div>
    )
}