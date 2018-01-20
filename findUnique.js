const sharp = require(`sharp`);
const extractArea = {left: 27, top: 130, width: 1376, height: 415};
const crypto = require(`crypto`);
const fs = require(`fs`);


const inputPath = `./data/`;
const uniquePath = `./output/unique/`;
const duplicatePath = `./output/duplicate/`;


let uniqueImages = [];
let duplicateImages = [];
let hashSet = new Set();

console.log(`Current concurrency: `, sharp.concurrency());

function copy(oldPath, newPath) {
    fs.createReadStream(oldPath).pipe(fs.createWriteStream(newPath));
}


function handle(n, callback) {
    if (n <= 0) {
        callback();
        return;
    }

    let imageName = `${n}.png`;

    console.log(`Handle `, imageName);

    sharp(inputPath + imageName)
        .extract(extractArea)
        .toBuffer(function (err, data, info) {
            if (err) console.log(err);

            let hash = crypto.createHash('sha1').update(data.toString()).digest('hex');
            let inSet = hashSet.has(hash);

            if (!inSet) {
                hashSet.add(hash);

                uniqueImages.push(imageName);
                console.log(`${imageName} is unique`);
                copy(inputPath + imageName, uniquePath + imageName);

            } else {
                duplicateImages.push(imageName);
                console.log(`${imageName} is duplicate`);
                copy(inputPath + imageName, duplicatePath + imageName);
            }


            handle(n-1, callback);

        })
}

handle(2570, () => {
    console.log(`Done!`);
});
