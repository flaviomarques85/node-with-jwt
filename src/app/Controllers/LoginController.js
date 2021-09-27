const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/auth')

class LoginController {

    async index(req, res){
        //FALTA FAZER VALIDACAO COM YUP NO BODY

        const {email, password} =  req.body

        /**
         * validação se o usuario existe na base de dados
         */
       
        const userExist = await User.findOne({email})      
        if(!userExist){
            return res.status(400).json({
                error: true,
                message: "Usuario não encontrato"
            })
        }
        /**
         * validação se a senha passada na request estå correta
         * para isso comparo ela com a senha gravada no banco usando 
         * o methodo compare do pacote bcrypty.js
         */
        const passwordValid = await bcrypt.compare(password, userExist.password)
        if(!passwordValid ){
            return res.status(400).json({
                error: true,
                message: "A senha digitada está incorreta"
            })
        }

        /**
         * Caso passe pelas validacoes acima, retorno as 
         * informacoes do usuario e o token gerado conforme
         * arquivo de configuracao
         */
        return res.status(200).json({
            user:{
                name: userExist.name,
                email: userExist.email
            },
            token: jwt.sign(
                {id: userExist._id},
                config.secret,
                {expiresIn: config.expireIn}
            )
        })

    }
    
}

module.exports =  new LoginController()