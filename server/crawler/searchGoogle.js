const puppeteer = require('puppeteer');

const searchGoogle = async (searchQuery,pagenumber) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(`https://www.google.com/search?q=${searchQuery}&start=${pagenumber*10}&tbs=li:1`)
    
    // Selector class keeps changing need to check google for correct div
    await page.waitForSelector('div[class="jtfYYd"]');

    const searchResults = await page.$$eval('div[class="jtfYYd"]', results => {
        let data = [];
        
        results.forEach(parent=>{
            
            const url_parent = parent.querySelector('div[class="yuRUbf"]')
            const url = url_parent.querySelector('a').getAttribute('href')
            const title = url_parent.querySelector('h3').innerText

            let text = parent.querySelector('.VwiC3b').querySelector('span') 

            if (text == null) text = parent.querySelector('.VwiC3b').innerText
            else text = parent.querySelector('.VwiC3b').querySelector('span').innerText

            data.push({address:url,title:title,description:text}); // push the results to test
        })
        
        return data
    });

    await browser.close();
    // console.log(searchResults)
    return searchResults

};

// To test the function 
// searchGoogle("facebook",0)

module.exports = searchGoogle;