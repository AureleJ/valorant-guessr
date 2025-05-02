import React from "react";

const EnhancedButton = ({
                            children,
                            variant = "primary",
                            size = "medium",
                            disabled = false,
                            fullWidth = false,
                            onClick,
                            className = "",
                            type = "button",
                            icon = null,
                            iconPosition = "left",
                            color = "red",
                            ...props
                        }) => {
    const baseStyles = "font-bold rounded-md transition-all duration-300 ease-in-out border-none relative overflow-hidden group";

    const colorStyles = {
        red: "bg-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-secondary/50",
        blue: "bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50",
        green: "bg-green-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50",
        yellow: "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50",
        purple: "bg-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
    };

    const variantStyles = {
        primary: colorStyles[color],
        secondary: "bg-gray-800/50 hover:bg-gray-800 text-white shadow-lg shadow-gray-700/50",
        success: "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30",
        danger: "bg-secondary-hover hover:bg-secondary text-white  shadow-lg shadow-secondary-hover/30",
        outline: "bg-transparent border-2 border-secondary-hover text-secondary-hover hover:bg-secondary-hover/10 ",
        ghost: "bg-transparent text-secondary-hover hover:bg-secondary-hover/10 ",
    };

    const sizeStyles = {
        small: "py-1 px-3 text-sm",
        medium: "py-2 px-5 text-base",
        large: "py-3 px-6 text-lg",
        responsive: "py-2 px-4 text-sm sm:py-3 sm:px-6 sm:text-base md:py-4 md:px-8 md:text-lg",
        square: "p-3 aspect-square",
    };

    const disabledStyles = disabled ?
        "opacity-50 cursor-not-allowed pointer-events-none" :
        "cursor-pointer";

    const widthStyles = fullWidth ? "w-full" : "";

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
            <span className="relative flex items-center justify-center gap-2 h-full w-full">
                {icon && iconPosition === "left" && <span>{icon}</span>}
                {children}
                {icon && iconPosition === "right" && <span>{icon}</span>}
            </span>
        </button>
    );
};

export default EnhancedButton;