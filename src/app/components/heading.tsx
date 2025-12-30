
type TypeOfPageProps = {
    text: string;
    marginTop?: string;
    parentSubTitle?: string;
}


const Heading: React.FC<TypeOfPageProps> = ({text, marginTop, parentSubTitle}) => {
  return (
    <div className={`${marginTop} w-[400px] h-[77px] flex items-center whitespace-nowrap`}>

          <h1 className='text-heading2  text-primary'>{text}</h1>

          {
            parentSubTitle && <p className="text-bodyRegular text-primary mt-[20px]">
              {" "}{parentSubTitle}
            </p>
          }

    </div>
  )
}

export default Heading
