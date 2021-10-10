const User =  require('../Models/User')
const bcrypt = require('bcryptjs')
const yup =  require('yup')

class UserController {
    /**
     * Rota para mostrar os usuarios  
     */
    async show(req, res){
        let users = await User.find({})
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
    /**
     * Atuaização de password de usuario.
     * valida autenticacao via token no middleware da request
     */
    async update(req, res){
        try {
            /**
             * recupera id passado via paramentro na URL
             */
            const  { id } = req.query
            if(id){
                /**
                 * consulta se o usuario do id correspondente existe na base de dados
                 */
                const userExist = await User.findOne({_id : id})

                if(userExist){
                    /**
                     * caso o usuario esteja ativo recupera o novo password para tratativa e persistencia.
                     */
                    let { newPassword } = req.body
                    if(newPassword && newPassword.length >= 6){
                        /**
                         * faz a criptaçao do password
                         */
                        newPassword = await bcrypt.hash(newPassword, 8)
                        /**
                         * realiza updata na base. 
                         */
                        await User.updateOne({ _id: id }, { $set : {password : newPassword }}, (error, retono) => {
                            if (error){
                                throw error
                            }else { 

                                console.log("--> Retorno: ",retono)
                                return res.status(200).json({
                                    error: false,
                                    massage: "Usuario atualizado com suscesso!"
                                })
                            }
                        })
                    }else{
                        return res.status(400).json({
                            error: true,
                            massage: "Obrigatorio informar o novo password com 6 caracter no minimo!"  
                        })
                    }

                }else{
                    return res.status(400).json({
                        error: true,
                        massage: "Usuario nao encontrado!"  
                    })
                }


            }else{
                return res.status(400).json({
                    error: true,
                    massage: "Obrigatorio informar o id do usuario"  
                })
            }
        } catch (error) {
            console.log(error)
        }
        
    }
}

module.exports = new UserController()