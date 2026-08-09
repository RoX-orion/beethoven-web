import {fileURLToPath, URL} from 'node:url';
import {defineConfig, type Plugin} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from "path";
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons';
import vueDevTools from 'vite-plugin-vue-devtools';
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
// import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/

function emitRootServiceWorker(): Plugin {
    return {
        name: 'emit-root-service-worker',
        apply: 'build',
        enforce: 'post',
        generateBundle(_options, bundle) {
            const worker = Object.values(bundle).find(
                output => output.type === 'asset' && /(?:^|\/)sw-[^/]+\.js$/.test(output.fileName),
            );

            if (!worker || worker.type !== 'asset') {
                return;
            }

            this.emitFile({
                type: 'asset',
                fileName: 'sw.js',
                source: worker.source,
            });
        },
    };
}

export default defineConfig({
    plugins: [
        vue(),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [resolve('public', 'assets/icons')],
            // 指定symbolId格式
            symbolId: 'icon-[name]',
        }),
        vueDevTools(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false,
                }),
            ],
        }),
        emitRootServiceWorker(),
        // VitePWA({
        //   registerType: 'autoUpdate',
        //   devOptions: {
        //     enabled: true,
        //   },
        //   manifest: {
        //     name: 'Beethoven Music Web',
        //     short_name: 'Beethoven Music',
        //     description: 'Beethoven music for web',
        //     theme_color: '#ffffff',
        //   },
        //   strategies: 'injectManifest',
        //   srcDir: 'src/serviceWorker',
        //   filename: 'index.service.ts',
        //   workbox: {
        //     globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        //     cleanupOutdatedCaches: true,
        //     clientsClaim: true,
        //   },
        // }),
    ],
    server: {
        host: '0.0.0.0',
        port: 12345,
        headers: {
            'Service-Worker-Allowed': '/',
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        outDir: 'build',
        assetsDir: 'static',
    },
});
