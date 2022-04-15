const { removeStopwords, eng } = require('stopword')
const custom_stopword = [...eng].filter(word => (word!="and") && (word!="or") )


const stopWordRemove = (text) => {
    const tokenized_text = text.split(' ');
    const word_list = removeStopwords(tokenized_text,custom_stopword)

    return word_list

}

module.exports = {
    stopWordRemove
}