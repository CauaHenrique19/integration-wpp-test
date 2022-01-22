import { makeWALegacySocket } from '@adiwajshing/baileys'
import express from 'express'
import http from 'http'

import { Server } from 'socket.io'
const app = express()

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connect', (socket) => {
    const sock = makeWALegacySocket({ printQRInTerminal: false })

    sock.ev.on('connection.update', (data) => {
        socket.emit('qrcode', data.qr)
    })
    
    // sock.ev.on('chats.set', (chats) => {
    //     const chatsTransformed = chats.chats.map(chat => ({ ...chat, conversationTimestampString: new Date(Number(chat.conversationTimestamp))  }))
    //     socket.emit('chats', chatsTransformed)
    // })

    //Recebe as mensagens
    sock.ev.on('messages.upsert', (messages) => {
        socket.emit('message', messages)
    })

    socket.on('send_message', async (message) => {
        await sock.sendMessage('5521965538291@s.whatsapp.net', { text: message })
    })
})

server.listen(4000, () => console.log('[BACKEND] Rodando...'))