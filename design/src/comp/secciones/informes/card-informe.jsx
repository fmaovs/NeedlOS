import './card-informe.css'

export default function CardInforme({txt, txt2, img, onClick}){
    return(
        <div className='card-informe' onClick={onClick}>
            <span className='spam-informe'>
            {txt}
            <br/>
            {txt2}
            </span>
            <img src={img} className='img-informe'/>
        </div>
    )
}