1. instalar dependecias en /frontend

3. Ejecutar /backend/src/main/com.farukgenc.boilerplate.srpingboot/SpringbootboilerplateApplication

4. ejecutar npm run build en /frontend para crear el archivo /dist
   - cd frontend
   - npm run build
   - cd ..

4. ejecutar "docker-compose up -d" en consola en /ProyectoDocker

5. posibles errores: 
   - role = "postgres" is not found
     - revisa archivo .env en /ProyectoDocker debes cambiar DB_USER=*Usuario que tengas creado en PostgreSQL*
     - de igual manera haz lo mismo con el campo DB_PASSWORD=*Contraseña configurada por elñ usuario* 