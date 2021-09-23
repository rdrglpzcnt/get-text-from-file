# Get text from file
Script para obtener en terminal el texto de el archivo que indiques.

## Requerimientos
- Para utilizar el script, debes instalar localmente: **poppler, imagemagick, ghostscript**.

`brew install poppler imagemagick ghostscript`

 - Node.js 6.* o mayor.

## Como usar

 1. `npm install`
 2. Coloca en `/files` los archivos de los necesitas extraer texto (pdf,
    png, jpg)
 3. Correr `npm getTextFrom [ ./files/archivo.ext ] [ eng || esp]`
 4. El resultado se imprimirá en la consola.