import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Bunny Fonts entrega cada peso en woff2 y en woff, y el plugin de Laravel
 * declara un @font-face por formato con los descriptores identicos. En la
 * cascada de CSS gana el ultimo declarado, asi que el navegador terminaba
 * bajando el .woff, que pesa ~25% mas. Los .woff solo los necesitan
 * navegadores de 2014, asi que se sacan del build junto con su regla.
 */
function soloWoff2() {
    return {
        name: 'disfruta-solo-woff2',
        enforce: 'post',
        generateBundle(_options, bundle) {
            for (const [nombre, archivo] of Object.entries(bundle)) {
                if (nombre.endsWith('.woff')) {
                    delete bundle[nombre];
                } else if (nombre.endsWith('.css') && archivo.type === 'asset') {
                    const fuente = String(archivo.source);
                    if (fuente.includes('format("woff")')) {
                        archivo.source = fuente.replace(
                            /@font-face\s*\{[^}]*\.woff"\)\s*format\("woff"\);[^}]*\}/g,
                            '',
                        );
                    }
                }
            }
        },
    };
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', { weights: [400, 500, 600, 700], optimizedFallbacks: false }),
                bunny('Fraunces', { weights: [400, 600, 700], optimizedFallbacks: false }),
            ],
        }),
        react(),
        tailwindcss(),
        soloWoff2(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, 'resources/js'),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
