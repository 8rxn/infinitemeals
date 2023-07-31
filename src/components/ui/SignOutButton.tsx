"use client"
import { FC } from "react"
import Button, { ButtonProps } from "./Button"
import { signOut } from "next-auth/react"




const SignOutButton:FC<ButtonProps> = ({children, ...props}) => {
  return (
    <Button {...props} onClick={()=>{signOut()}} >
        {children}
    </Button>
  )
}

export default SignOutButton