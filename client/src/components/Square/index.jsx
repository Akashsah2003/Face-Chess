import { useEffect, useState } from "react";

const Square = ({colour, icon, keyy, setTile}) => {
  return (
   <>
        <div className={`h-[9vmin] w-[9vmin]`} key={keyy} style={{background: colour}} onClick={(e)=>{
          setTile(keyy);
        }}>
            <img className="h-[9vmin] w-[9vmin]" src={icon} alt="" />
        </div>
    </>
  )
};

export default Square;
