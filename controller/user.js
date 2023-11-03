const { request, response } = require("express")
const modelUser = require("../models/index").user
const md5 = require(`md5`)
const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"
const Op = require('sequelize').Op

exports.login = async (request, response) => {
    try{
        const params = {
            email: request.body.email,
            password: md5(request.body.password),
        };

        const findUser = await modelUser.findOne({where:params});
        if (findUser == null){
            return response.status(404).json({
                message: "email or password doesn't match",
                err: error,
            });
        }
        let tokenPayload = {
            id: findUser.id,
            email: findUser.email
        };
        tokenPayload = JSON.stringify(tokenPayload);
        let token =  jsonwebtoken.sign(tokenPayload, SECRET_KEY);
        
        return response.status(200).json({
            message: "success login",
            data: {
                token: token,
                id: findUser.id,
                email: findUser.email
            },
        });
    }
    catch(error){
        return response.status(500).json({
            message: "internal error",
            err: error,
        });
    }
};

exports.addUser = (request, response) => {
    let newUser = {
        username: request.body.username,
        email: request.body.email,
        password: md5(request.body.password),
    }
    if (newUser.username === '' || newUser.email==='' ||newUser.password==='') {
        return response.json({
            success: false,
            message: 'Semua data harus diisi'
        })
    }
    
    modelUser.create(newUser).then(result => {
        return response.json({
            success: true,
            email: result.email,
            username: result.username,
            message: `User telah ditambahkan`
        })
    })
    
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.getAllUser = async (request, response) => {
    let users = await modelUser.findAll({
        order : [['createdAt', 'DESC']],
    })
    if (users.length === 0) {
        return response.json({
          success: true,
          data: [],
          message: `Data tidak ditemukan`,
        });
      }
    return response.json({
    success: true,
    data: users,
    message: `ini adalah semua data usernya kanjeng ratu`
})
}

exports.findUser = async (request, response) => {
    let keyword = request.body.keyword

    let users = await modelUser.findAll({
        where: {
            [Op.or]: [
                { username: { [Op.substring]: keyword } },
                { email: { [Op.substring]: keyword } },
            ]
        }
    })

    if (users.length === 0) {
        return response.status(404).json({
            success: false,
            message: 'Data tidak ditemukan'
        });
    }
    
    return response.json({
        success: true,
        data: users,
        message: `berikut data yang anda minta yang mulia`
    })
}