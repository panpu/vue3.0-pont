const req = require.context('./svg', false, /\.svg$/)

export default req.keys().map(item => item.replace(/^\.\/(.*)\.\w+$/, '$1'))
