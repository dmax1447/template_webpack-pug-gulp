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

const dataCache = {};

exports.getSiteData = function(lang, dataPath, name) {
    const [block, field] = name.split(".");
    //console.log(block, field);
    if (!dataCache.hasOwnProperty(block)) {
        dataCache[block] = JSON.parse(fs.readFileSync(`${dataPath}/${block}.${lang}.json`, 'utf8'));
    }
    return field ? dataCache[block][field] : dataCache[block];
};