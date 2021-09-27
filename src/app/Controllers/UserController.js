const User =  require('../Models/User')
const bcrypt = require('bcryptjs')
const yup =  require('yup')

class UserController {
    /**
     * Rota para mostrar o usuario 
     */
    async show(req, res){
        let users = ['Celio', 'Leticia', 'Andrezza']
        return res.status(200).json({
            error:false,
            users
        })
    }

    /**
     * Rota para criacao de usuario no banco de dados
     * recebe parametros obrigatorios do requisiçao.
     */
    async store(req, res) {
        /**
         * validacao dos dados pasados na request com o pacote YUP schema.
         */
        let schema =  yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required()
        })
        /**
         * Caso os dados nao passe na validação será retornado 
         * status 400 e message de erro.
         */
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({
                error:true,
                massage: "Dados invalidos."
            })
        }
        /** Validacao se o email ja existe na base de dados */
        let userExist =  await User.findOne({email: req.body.email})
        if(userExist){
            return res.status(400).json({
                error:true,
                massage: "Usuario já existe na base de dados."
            })
        }

        /**
         * Caso os dados passe pela validação 
         * realizo destruturacao do body, depois encriptação da senha e 
         * insert no banco de dados MongoDB com method Create('data',callback)
         */
        const { name, email, password } = req.body
        const data = { name, email, password }
        data.password = await bcrypt.hash(data.password, 8)

        await User.create(data, (error) => {
            if(error){
                return res.status(400).json({
                    error:true,
                    massage: "Erro ao inserir usuario no Banco."
                })
            }

            return res.status(200).json({
                error:false,
                massage: "Usuario criando com sucesso!"
            })
        })
        
    }
}

module.exports = new UserController()