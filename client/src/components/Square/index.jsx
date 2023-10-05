const Square = ({colour, icon}) => {
  return (
    <>
        <div className={`h-[9vmin] w-[9vmin] bg-[${colour}]`}>
            <img className="h-[9vmin] w-[9vmin]" src={icon} alt="" />
        </div>
    </>
  )
};

export default Square;
