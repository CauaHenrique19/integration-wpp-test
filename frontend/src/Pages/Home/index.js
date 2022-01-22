import { useCallback, useEffect, useMemo, useState } from 'react'
import QRCode from "react-qr-code";
import socket from 'socket.io-client'

import './style.css'

const Home = () => {

    const [qrCode, setQrCode] = useState('')
    const [message, setMessage] = useState('')
    const io = useMemo(() => socket('http://localhost:4000'), [])

    const conectToSocket = useCallback(() => {
        
        io.on('qrcode', (data) => {
            console.log(qrCode)
            setQrCode(data)
        })

        // io.on('chats', (chats) => {
        //     console.log(chats)
        // })

        io.on('message', (messages) => {
            console.log(messages)
        })
    }, [])

    useEffect(() => conectToSocket(), [conectToSocket])

    return (
        <div className="home-container">
            {
                qrCode &&
                <div className="qr">
                    <QRCode value={qrCode} />
                </div>
            }
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button 
                onClick={(e) => { io.emit('send_message', message) }}
            >
                Enviar Mensagem
            </button>
        </div>
    )
}

export default Home