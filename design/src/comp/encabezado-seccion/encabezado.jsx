import './encabezado.css'

export default function Encabezado({ titEncabezado }) {
    return(
        <div className='cont-encabezado'>
            <span>{titEncabezado}</span>
            
        </div>
    )
}