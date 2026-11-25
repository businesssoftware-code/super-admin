

type TypeOfPageProps = {
    width: string;
    background: string;
}

const HorizontalLine: React.FC<TypeOfPageProps> = ({width, background}) => {

  return (
    <div className={`${width} h-[1px] ${background} drop-shadow-custom`}>

    </div>
  );
};

export default HorizontalLine;