require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
// *********************************
let formatData = ``
let USER_ID = ''
let coins = []

const getDataPerHour = async () => {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    coins = data
}
getDataPerHour()

const bot = new Telegraf(process.env.BOT_TOKEN)
const setIntervalAndExecute = () => {
    const getCoin = coins.find(coin => coin.symbol === 'xlm')
    formatData = `  💰 Coin : ${getCoin.name}
🏷️ Current price : ${getCoin.current_price.toLocaleString() + '$'}
🟢 High24h : ${getCoin.high_24h.toLocaleString() + '$'}
🔴 Low24h : ${getCoin.low_24h.toLocaleString() + '$'}
📈 Price chage 24h : ${getCoin.price_change_24h.toLocaleString() + '$'}
    `
    bot.telegram.sendMessage(USER_ID, formatData)  
}

bot.start((ctx) => {
    USER_ID = ctx.message.from.id
    const interval = setInterval(setIntervalAndExecute, 3600000)
    ctx.reply(`Welcome ${ctx.message.from.first_name}`)
})
bot.help((ctx) => ctx.reply('Enter a symbol'))

bot.on('text', async (ctx) => {
    const getCurrentCoin = await coins.find(coin => coin.symbol === ctx.message.text.toLowerCase())
   if(getCurrentCoin){
formatData = `💰 Coin : ${getCurrentCoin.name}
🏷️ Current price : ${getCurrentCoin.current_price.toLocaleString() + '$'}
🟢 High24h : ${getCurrentCoin.high_24h.toLocaleString() + '$'}
🔴 Low24h : ${getCurrentCoin.low_24h.toLocaleString() + '$'}
📈 Price chage 24h : ${getCurrentCoin.price_change_24h.toLocaleString() + '$'}
`
   }
   else {
       formatData = `"${ctx.message.text}" is unknown`
   }
    ctx.reply(formatData)
})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
