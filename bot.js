require('dotenv').config();
const { Telegraf } = require('telegraf');
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
    const interval = setInterval(setIntervalAndExecute, 5000)
    ctx.reply(`Welcome ${ctx.message.from.first_name}`)
})
bot.help((ctx) => ctx.reply('Enter a symbol'))
bot.on('text',  (ctx) => {
    
axios.get(`https://api.coingecko.com/api/v3/coins/${ctx.message.text.toLowerCase()}`)
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
        formatData = `${err.response?.data.error} - ${ctx.message.text}`
        ctx.reply(formatData)
    })

})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
