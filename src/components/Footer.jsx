import logoInverso from "../assests/iconos/logo-inverso.svg";
import "./Footer.css";
import { interpolar } from "../utils/interpolar";

const DESTINOS = {
  inicio: "#inicio",
  mundos: "#mundos",
  ingresar: "#ingresar",
  crearCuenta: "#registro",
  terminos: "#terminos",
  accesibilidad: "#accesibilidad"
};

export default function Footer({ textos }) {
    const f = textos?.footer;
    const columnas = Object.values(f?.columnas ?? {});

    return (
        <footer className="pie">
            <div className="pie-marca">
                <img src={logoInverso} alt={textos?.navbar?.logo?.aria ?? "Cromoverso"} />
                <p>{f?.lema}</p>
            </div>

            <div className="pie-columnas">
                {columnas.map((columna) => (
                <div key={columna.titulo}>
                    <h3>{columna.titulo}</h3>
                    <ul>
                    {Object.entries(columna.enlaces).map(([clave, texto]) => (
                        <li key={clave}>
                        <a href={DESTINOS[clave] ?? "#"}>{texto}</a>
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>

            <p className="pie-legal">
                {interpolar(f?.legal?.derechos, { anio: new Date().getFullYear() })}
            </p>
        </footer>
    );
}