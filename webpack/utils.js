const glob = require('glob');
const path = require('path');
const fs = require('fs');

/**
 * getEntries('./src/pages/', 'index', 'js');
 * 
 * result to:
 * 
 * { main: 'C:/Libs/projects/bereza-portfolio/src/pages/main/index.js', otherTestPage: 'C:/Libs/projects/bereza-portfolio/src/pages/otherTestPage/index.js' }
 */
exports.getEntries = function (entriesDir, entryName, extension) {
    if (entriesDir[entriesDir.length - 1] !== '/') {
        entriesDir += '/';
    }

    extension = `.${extension}`;

    const pattern = `${entriesDir}/**/${entryName}${extension}`;

    const files = glob.sync(pattern);
    const entries = {};

    files.forEach((file) => {
        entries[path.basename(path.dirname(file))] = file;
    });

    return entries;
};

exports.rootDir = function (pathFromRoot) {
    if (path.isAbsolute(pathFromRoot)) return pathFromRoot;
    return path.resolve(__dirname, '..', pathFromRoot);
};

const _siteDataCache = {};

exports.getSiteData = function(dataPath, name, lang) {
    return {}
    const [ block, field ] = name.split(".");

    if (!_siteDataCache.hasOwnProperty(block)) {
        let filePath;
        if (lang) {
            filePath = `${dataPath}/${block}.${lang}.json`;
        } else {
            filePath = `${dataPath}/${block}.json`;
        }

        const fileStr = fs.readFileSync(filePath, 'utf8');
        if (!fileStr) {
            throw new Error(`failed read file from ${dataPath}`);
        }
        _siteDataCache[block] = JSON.parse(fileStr);
    }

    const value = field ? _siteDataCache[block][field] : _siteDataCache[block];

    if (!value) {
        throw new Error(`value not found! dataPath=${dataPath}, name=${name}`);
    }

    return value;
};