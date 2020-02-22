const express = require('express')
const line = require('@line/bot-sdk')

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
}

const app = express()
const client = new line.Client(config)

// debug
app.get('/',(req,res) =>{
    res.send('Get!!')
})

// main
app.post('/webhook',line.middleware(config),(req,res)=>{

    // debug
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('OK');
        return; 
    }

    // return same message
    Promise.all(req.body.events.map(handleEvent))
        .then((result)=>{ res.json(result)})
        .catch((err) => {
            console.error(err);
            res.status(500).end();
          });

})

// service
function handleEvent(event){
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null)
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text　// return message txt
    })
}



(process.env.NOW_REGION) ? module.exports = app : app.listen(8000);

