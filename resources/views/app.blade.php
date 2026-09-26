<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" sizes="64x64" />
    <link rel="icon" href="/images/favicon.png" type="image/png" />
    <link rel="apple-touch-icon" href="/images/favicon.png" />
    <meta name="theme-color" content="#14532d" />
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
  </head>
  <body class="bg-crema text-tinta antialiased">
    @inertia
    <div id="app"></div>
  </body>
</html>
