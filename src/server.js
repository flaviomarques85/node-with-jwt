const app = require( './app')

var PORT =  process.env.PORT || 3004
app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}`)
})