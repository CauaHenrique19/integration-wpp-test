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
    
    //Recebe as mensagens
    sock.ev.on('messages.upsert', async (messages) => {
        if(messages.messages[0].key.remoteJid.includes('@s.whatsapp.net')){
            const url = await sock.profilePictureUrl('5521982705373@s.whatsapp.net');
            console.log(url)
            socket.emit('message', messages)

            sock.ev.on('contacts.update', (contacts) => console.log(contacts))
        }
    })

    sock.ev.on('contacts.set', (contact) => {
        const contacts = contact.contacts.filter(contact => contact.name !== undefined && contact.id.includes('@s.whatsapp.net'))
        console.log('contact', contacts)
    })

    socket.on('send_message', async (message) => {
        await sock.sendMessage('5521982705373@s.whatsapp.net', { text: message })
    })
})

server.listen(4000, () => console.log('[BACKEND] Rodando...'))