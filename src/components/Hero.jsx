import { useEffect, useRef, useState } from "react";
import { useTextos } from "../hooks/useTextos";
import "./Hero.css"

export default function Hero ({
    textos,
    cargando, 
    error,
    idioma
}){
    const hero = textos?.paginas
    const ingles = idioma === "en"

    return (
        <section className="hero">
            <h1 className="titular-gigante">Hola</h1>            
        </section>
    )
}