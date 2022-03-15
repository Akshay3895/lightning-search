const puppeteer = require('puppeteer');

const searchGoogle = async (searchQuery,pagenumber) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(`https://www.google.com/search?q=${searchQuery}&start=${pagenumber*10}`)
    
    await page.waitForSelector('div[class="kWxLod"]');

    const searchResults = await page.$$eval('div[class="kWxLod"]', results => {
        let data = [];
        results.forEach(parent=>{
            const url_parent = parent.querySelector('div[class="yuRUbf"]')
            const url = url_parent.querySelector('a').getAttribute('href')
            const title = url_parent.querySelector('h3').innerText

            const text = parent.querySelector('.VwiC3b').querySelector('span').innerText

            data.push({url:url,title:title,desc:text});
        })
        return data
    });

    await browser.close();
    return searchResults

};

// To test the function 
// searchGoogle("cat",4)

module.exports = searchGoogle;