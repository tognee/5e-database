var fs = require('fs');

fs.readdir('src', (err, fileNames) => {
  if (err) return console.error(err);

  let languageJSON = {}

  fileNames.forEach( fileName => {
    if (fileName.indexOf('.json') == -1) return false;
    const data = fs.readFileSync(`src/${fileName}`, 'utf8');
    const dataJSON = JSON.parse(data);

    const iterateJSON = function(obj){
        if (typeof obj != 'object' || obj == null) return obj;
        const path = Object.keys(obj).indexOf('url') != -1 ? obj['url'].substring(5).split('/') : false;

        for (let key in obj){
          if ((key === 'name' || key === 'full_name' || key === 'desc') && path){
            let languagePath = languageJSON
            path.forEach(step => {
              if (!languagePath[step]) languagePath[step] = {}
              languagePath = languagePath[step]
            });
            let newKey = `LANG-KEY_${path.join('.')}.${key}`
            console.log(newKey)
            languagePath[key] = obj[key]
          }

          obj[key] = iterateJSON(obj[key]);
        }

        return obj;
    }

    iterateJSON(dataJSON);
  });

  fs.writeFile('languages/en.json', JSON.stringify(languageJSON, null, '\t'), 'utf8', err => {
    if (err) return console.log(err);
  });
});
