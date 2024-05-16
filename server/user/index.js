const express = require('express')

const PORT = 7000

const app = express()

app.get('/', (req, res) => res.json({ msg: 'hey from my own server' }));


app.listen(PORT, () => console.log(`Server Strted on port ${PORT}`))



















                                    
