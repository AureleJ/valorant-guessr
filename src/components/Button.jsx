import React from "react";

const Button = ({
                    children,
                    variant = "primary",
                    size = "medium",
                    disabled = false,
                    fullWidth = false,
                    onClick,
                    className = "",
                    type = "button",
                    ...props
                }) => {
    const baseStyles = "font-bold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
        primary: "bg-[var(--secondary-color)] hover:bg-[var(--hover-color)] text-white focus:ring-[var(--secondary-color)]",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
        outline: "bg-transparent border-2 border-[var(--secondary-color)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-white focus:ring-[var(--secondary-color)]",
        ghost: "bg-transparent text-[var(--secondary-color)] hover:bg-[var(--secondary-color)/10] focus:ring-[var(--secondary-color)]"
    };

    // Responsive size styles
    const sizeStyles = {
        small: "py-1 px-3 text-sm",
        medium: "py-2 px-5 text-base",
        large: "py-3 px-6 text-lg",
        responsive: "py-2 px-4 text-sm sm:py-3 sm:px-6 sm:text-base md:py-4 md:px-8 md:text-lg"
    };

    // Disabled state
    const disabledStyles = disabled ?
        "opacity-50 cursor-not-allowed pointer-events-none" :
        "cursor-pointer";

    // Full width
    const widthStyles = fullWidth ? "w-full" : "";

    // Combine all styles
    const buttonClasses = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabledStyles,
        widthStyles,
        className
    ].join(" ");

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;