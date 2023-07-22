"use client"
import { FC } from "react"
import Button, { ButtonProps } from "./Button"
import { signIn } from "next-auth/react"




const SignInButton:FC<ButtonProps> = ({children, ...props}) => {
  return (
    <Button {...props} onClick={()=>{signIn("discord")}} >
        {children}
    </Button>
  )
}

export default SignInButton