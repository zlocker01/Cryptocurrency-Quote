const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

const obtenerCriptomondedas = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', ()=> {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url).then(respuesta => respuesta.json()).then(resultado => obtenerCriptomondedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas));
};

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
};

function submitFormulario(e){
    e.preventDefault();
    //validar
    const {moneda, criptomoneda} = objBusqueda;
    if( moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    };
    //consultar la API con los resultados
    consultarAPI();
};

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    objBusqueda[e.target.name] = e.target.value;
};

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error');
    if(!existeError){

        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
        //mensaje de error
        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje);
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    };
};

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    //Spinner
    mostrarSpinner();

    fetch(url).then(respuesta => respuesta.json()).then(cotizacion => mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]));
};

function mostrarCotizacionHTML(cotizacion){
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El preico es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `Preci más alto del día: <span>${HIGHDAY}</span>`;

    
    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `Preci más bajo del día: <span>${LOWDAY}</span>`;

    
    const variacion = document.createElement('P');
    variacion.innerHTML = `Variación en las ultimas 24 hrs: <span>${CHANGEPCT24HOUR}%</span>`;

    
    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;
    limpiarHTML();
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacion);
    resultado.appendChild(ultimaActualizacion);
};

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    };
};

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
        </div>
    `;

    resultado.appendChild(spinner);
};