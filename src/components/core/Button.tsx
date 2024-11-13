import React, { ButtonHTMLAttributes, ReactNode } from 'react'

function Button({ child, ...props }: { child: ReactNode } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button {...props}>
            {child}
        </button>
    )
}

export default Button
