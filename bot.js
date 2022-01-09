require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
// *********************************
let formatData = ``
let USER_ID = ''
let currentToken = {}

const getChosenToken = async () => {
   const {data} =  await axios.get('https://api.coingecko.com/api/v3/coins/stellar');
   currentToken = data
}
getChosenToken()

const bot = new Telegraf(process.env.BOT_TOKEN)
const setIntervalAndExecute = () => {
    
    formatData = `  💰 Coin : ${currentToken.id}
💲  Symbol : ${currentToken.symbol}
🏷️ Current price : ${currentToken.market_data.current_price.usd + '$'}
🟡 Binance : ${currentToken.tickers.find(coin => coin.market.name === 'Binance').last + "$"}
🟢 MEXC Global : ${currentToken.tickers.find(coin => coin.market.name === 'MEXC Global').last + "$"}
🔵 CEX.IO : ${currentToken.tickers.find(coin => coin.market.name === 'CEX.IO').last + "$"}
🟠 OKEx : ${currentToken.tickers.find(coin => coin.market.name === 'OKEx').last + "$"}
    `
    bot.telegram.sendMessage(USER_ID, formatData)  
}

bot.start((ctx) => {
    USER_ID = ctx.message.from.id
    const interval = setInterval(setIntervalAndExecute, 3600000)
    ctx.reply(`Welcome ${ctx.message.from.first_name}` ,Markup.keyboard([
        ['🚀 Stellar 🚀','🔰 Ripple 🔰',],
        ['🅱 Bitcoin 🅱','🐷 Pig-finance 🐷'],
        [,'♦ Ethereum ♦','⚛ Cardano ⚛'],
        ['🌗 Solana 🌓','💠 FTX-token 💠'],
        ['➰ Chainlink ➰','🐕 Akita-inu 🐕']
    ]))
})
bot.help((ctx) => {ctx.reply('Enter valid coin id : Example - btc -> Bitcoin')})
bot.on('text',  (ctx) => {
const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
const messege = ctx.message.text.replace(regex,'').toLowerCase().trim()
axios.get(`https://api.coingecko.com/api/v3/coins/${messege}`)
.then(res => {
     if(res.status == '200'){
        formatData = `
💰 Coin : ${res.data.id}
💲  Symbol : ${res.data.symbol}
🏷️ Current price : ${ res.data.market_data.current_price.usd + '$'}
🟡 Binance : ${res.data.tickers.find(coin => coin.market.name === 'Binance') ? res.data.tickers.find(coin => coin.market.name === 'Binance').last + "$" : 'Not listing yet'}
🟢 MEXC Global : ${res.data.tickers.find(coin => coin.market.name === 'MEXC Global') ? res.data.tickers.find(coin => coin.market.name === 'MEXC Global').last + "$" : 'Not listing yet'}
🔵 CEX.IO : ${res.data.tickers.find(coin => coin.market.name === 'CEX.IO') ? res.data.tickers.find(coin => coin.market.name === 'CEX.IO').last + "$" : 'Not listing yet'}
🟠 OKEx : ${res.data.tickers.find(coin => coin.market.name === 'OKEx') ? res.data.tickers.find(coin => coin.market.name === 'OKEx').last + "$" : 'Not listing yet'}
            `
            ctx.reply(formatData)
        }
    })
    .catch(err => {
        formatData = `${err.response?.data.error} - ${messege}`
        ctx.reply(formatData)
    })

})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
