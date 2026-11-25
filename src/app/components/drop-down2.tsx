"use client";

import React, { useState } from 'react'
import { TypeOfOptions2 } from '../libs/types';
import DynamicSelectField from './select-fields';

type TypeOfPageProps = {
    placeholder?: string;
    list: TypeOfOptions2[];
    handleChange: (name:string, value:string, type:string) => void;
    name: string;
    value: string;
    type: string;
    handleReset?: (name:string) => void;
    disable?: boolean;
}

const DropDown2: React.FC<TypeOfPageProps> = ({placeholder, list, handleChange, name, value, type, handleReset, disable}) => {
    
    const [open, setOpen] = useState<boolean>(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    }

  return (
    <DynamicSelectField
                  placeholder={placeholder ?? ""}
                  background="bg-secondary"
                  selectedBg = "bg-primary"
                  list={list}
                  open={open}
                  handleClose={handleClose}
                  handleOpen={handleOpen}
                  handleChange={(name: string, value: string, type: string) => {
                    handleChange(name, value, type);
                  }}
                  name={name}
                  value={value}
                  type={type}
                  lineColor = "bg-neutralText"
                  handleReset ={handleReset}
                  disable={disable}
                />
  )
}

export default DropDown2;
