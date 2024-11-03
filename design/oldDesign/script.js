document.querySelector('.iniciar-sesion').addEventListener('click', function handleClick() {
    /* Selección de los elementos a colocar dentro del div*/
    const marca = document.querySelector('.marca');
    const sepHorizontal = document.querySelector('.sep-horizontal-frontPage');
    const eslogan = document.querySelector('.eslogan');
    const footer = document.querySelector('.footer');

    // Creamos un nuevo div con la clase definida
    const newDiv = document.createElement('div');
    newDiv.classList.add('nuevo-div'); // Aquí puedes cambiar el nombre de la clase si lo deseas

    // Insertamos el nuevo div en el DOM
    marca.parentNode.insertBefore(newDiv, marca);
    
    // Movemos los elementos dentro del nuevo div
    newDiv.appendChild(marca);
    newDiv.appendChild(sepHorizontal);
    newDiv.appendChild(eslogan);
    newDiv.appendChild(footer);

    // Eliminamos el controlador de eventos para que no se ejecute de nuevo
    document.querySelector('.iniciar-sesion').removeEventListener('click', handleClick);

    //Eliminar texto del boton
    document.querySelector('.iniciar-sesion').textContent = '';

    /*CAMBIAR BUTTON > DIV*/
    // Selecciona el botón
    let button = document.querySelector('.iniciar-sesion');

    // Crea un nuevo div
    let div = document.createElement('div');

    // Copia las clases y atributos del botón al div
    div.className = button.className;
    div.innerHTML = button.innerHTML; // Si quieres mantener el contenido interno del botón

    // Reemplaza el botón por el div
    button.replaceWith(div);

    /*AGREGAR ELEMENTOS DEL LOGIN*/
    //Seleccionar el elemento div que va contener lo elementos de login
    const login = document.querySelector('.iniciar-sesion');

    //Agregar contenido html
    login.innerHTML = `
        <div class="gradient">
            <form class="form">
                <h1 class="welcome">Bienvenido de nuevo</h1>
                <h2 class="credenciales">Porfavor ingrese sus credenciales</h2>
                <p class="datos">Usuario</p>
                <input type="text" class="input" placeholder="admin@ejemplo.com">
                <p class="datos">Password</p>
                <input type="password" class="input" placeholder=". . . . . . . .">
                    <div class="cont">
                        <input type="checkbox" class="check" id="custom-checkbox">
                        <label for="custom-checkbox">Recuerdame</label>
                        <a href="" class="remember-pass">¿Haz olvidado tu contraseña?</a>
                    </div>
                <button class="login">Log in</button>
            </form>
        </div>
    `

    // Selecciona el enlace CSS actual
    var oldStylesheet = document.getElementById('stylesheet');
            
    // Elimina el enlace CSS actual
    oldStylesheet.parentNode.removeChild(oldStylesheet);

    // Crea un nuevo elemento <link>
    var newStylesheet = document.createElement('link');
    newStylesheet.rel = 'stylesheet'; // Establece el tipo de relación
    newStylesheet.href = '/css/login.css'; // Cambia por el nuevo archivo CSS

    // Agrega el nuevo enlace CSS al <head>
    document.head.appendChild(newStylesheet);
});

