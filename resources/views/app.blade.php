<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {{-- El ?v= fuerza a refetch: el favicon anterior estaba vacio y los
         navegadores cachean el icono por URL, no por contenido. --}}
    <link rel="icon" href="/favicon.ico?v=2" sizes="64x64" />
    <link rel="icon" href="/images/favicon.png?v=2" type="image/png" sizes="180x180" />
    <link rel="apple-touch-icon" href="/images/favicon.png?v=2" />

    <meta name="theme-color" content="#14532d" />
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
  </head>
  <body class="bg-crema text-tinta antialiased">
    @inertia
    <div id="app"></div>
  </body>
</html>
