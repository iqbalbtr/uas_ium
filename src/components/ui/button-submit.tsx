import React, { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './button';

function ButtonSubmit({ children, ...props }: { children: ReactNode } & ButtonProps) {

    const { pending } = useFormStatus();

    return (
        <Button {...props} type='submit' disabled={pending}>
            {pending ? "loading" : children}
        </Button>
    )
}

export default ButtonSubmit
