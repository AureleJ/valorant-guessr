import React from "react";

const Button = ({children, onClick, ...props}) => {
    return (
        <button className="bg-[var(--secondary-color)] hover:bg-[var(--hover-color)] text-white font-bold py-2 px-5 rounded" onClick={onClick} {...props}>
            {children}
        </button>
    )
};

export default Button;
