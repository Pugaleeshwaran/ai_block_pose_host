const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OFFLINE_DIR = path.join(__dirname, 'offline_libs');
const JS_DIR = path.join(OFFLINE_DIR, 'js');
const MODELS_DIR = path.join(OFFLINE_DIR, 'models');

const jsLibs = [
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.5.4/dist/speech-commands.min.js',
    'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.10.0/dist/tf-backend-webgl.min.js'
];

const models = {
    mobilenet: {
        url: 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1/model.json?tfjs-format=file',
    },
    movenet: {
        url: 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4/model.json?tfjs-format=file',
    },
    speech_commands: {
        url: 'https://storage.googleapis.com/tfjs-models/tfjs/speech-commands/v0.3/browser_fft/18w/model.json',
        extra: ['https://storage.googleapis.com/tfjs-models/tfjs/speech-commands/v0.3/browser_fft/18w/metadata.json']
    }
};

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchJson(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function downloadTfjsModel(modelInfo, dirName) {
    const modelDir = path.join(MODELS_DIR, dirName);
    if (!fs.existsSync(modelDir)) fs.mkdirSync(modelDir, { recursive: true });

    console.log(`Downloading ${dirName} model.json...`);
    let modelJsonUrl = modelInfo.url;
    let urlWithoutQuery = modelJsonUrl.split('?')[0];
    let queryParams = modelJsonUrl.split('?')[1] ? '?' + modelJsonUrl.split('?')[1] : '';
    let baseUrl = urlWithoutQuery.substring(0, urlWithoutQuery.lastIndexOf('/'));

    const getFinalUrl = (url) => new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) resolve(getFinalUrl(res.headers.location));
            else resolve(url);
        }).on('error', reject);
    });

    const finalModelUrl = await getFinalUrl(modelJsonUrl);
    const modelJson = await fetchJson(finalModelUrl);
    fs.writeFileSync(path.join(modelDir, 'model.json'), JSON.stringify(modelJson, null, 2));

    const weightsManifest = modelJson.weightsManifest;
    if (weightsManifest) {
        for (const manifest of weightsManifest) {
            for (const p of manifest.paths) {
                console.log(`Downloading ${p}...`);
                const finalBinUrl = await getFinalUrl(`${baseUrl}/${p}${queryParams}`);
                await downloadFile(finalBinUrl, path.join(modelDir, p));
            }
        }
    }

    if (modelInfo.extra) {
        for (const extraUrl of modelInfo.extra) {
            const extraFinal = await getFinalUrl(extraUrl);
            const fileName = extraFinal.substring(extraFinal.lastIndexOf('/') + 1);
            console.log(`Downloading extra ${fileName}...`);
            await downloadFile(extraFinal, path.join(modelDir, fileName));
        }
    }
}

async function main() {
    if (!fs.existsSync(JS_DIR)) fs.mkdirSync(JS_DIR, { recursive: true });
    if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR, { recursive: true });

    for (const lib of jsLibs) {
        const fileName = lib.substring(lib.lastIndexOf('/') + 1);
        console.log(`Downloading ${fileName}...`);
        await downloadFile(lib, path.join(JS_DIR, fileName));
    }

    for (const [name, info] of Object.entries(models)) {
        await downloadTfjsModel(info, name);
    }

    console.log('All downloads completed!');
}

main().catch(console.error);
