import './span-form.css'

export default function SpanForm({txt, insert}) {
    return (
      <span className='span-txt-tit'>
        {txt}: <span className='span-ins'>{insert}</span>
      </span>
    );
}