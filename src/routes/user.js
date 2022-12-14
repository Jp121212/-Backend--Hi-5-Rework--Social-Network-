

const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();
var { expressjwt: jwt } = require("express-jwt");
var jwt1 = require('jsonwebtoken');
const secretKey = "8ae350cc8b9ae710042d44353d7551f662a3b340a382e30b878670a5ec287a13e182d71aa9a1b93183b14bd742955b58b860f6c4b2b65c74a90d27bf683b5a50fae7344dbb004f3a954c00d689f1df0d4bdd5e4e339782759008591a893cfb7de8cb9b239de0b99815b2b68b129987a80893bbdea98e4ac6fb3a2b6fffaa68";

router.use(cors());
router.use(express.json());
router.use(
  jwt({
      secret: secretKey,
      algorithms: ["HS256"],
    })
  .unless(({path: ['/api/v1/login','/Signup']})));

  function AccessTkn(username){
    return jwt1.sign({
      username: username,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, secretKey);
  } 
 

  
  router.post('/login', async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      }
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email"
      });
    }
    if (user.password !== req.body.password) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }
    const token = AccessTkn(user.email);
    res.status(200).json({
      message: "Login successful",
      token: token,
      id: user.id,
      imagen: user.imagen

    });
  })


//CRUD FACULTAD

//POST FACULTAD
router.post('/Signup', async (req, res) => {
    const result = await prisma.user.create({
      // req.body es la info que manda el usuario para crear
      data: req.body
    });
    res.json(result);
  })

  router.get('/user/post/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findMany({
      where: { id: Number(id)},
      select:{
        id: true,
        username: true,
        imagen: true,
        email: true,
        post: {
          select:{
                id : true,
                content: true,
                createdAt: true,
                likes: true,
                comments: {
                  select:{
                    id : true,
                 
                    content: true,
                    createdAt: true,
                    user: {
                      select:{
                        id : true,
                        username: true,
                        imagen: true,
                        email: true,
                      }
                    }
                }
                
                }

              }
            },comments: {
              select:{
                id : true,
                content: true,
                createdAt: true,
                userId: true,
                postId: true, 
                user: {
                  select:{
                    username: true,
                    imagen: true,
                    email: true,
                  }
                },
              }
            }

      }
    });
    res.json(user);
  })

  router.get('/user/following/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findMany({
      where: { id: Number(id)},
     
      select:{ 
      id : true,
      username: true,
      imagen: true,
      email: true,
        following: {
          select:{
            following : {
              select:{
                id : true,
                email: true,
                username: true,
                post: {
                  select:{
                    id : true,
                    content: true,
                    createdAt: true,
                    likes: true,
                    comments: {
                      select:{
                        id : true,
                        content: true,
                        createdAt: true,
                        user: {
                          select:{
                            id : true,
                            username: true,
                            imagen: true,
                            email: true,
                            
                          }
                        }
                    }}
                  }
                },
                imagen: true,
                comments: true,
              }
            }
          }
        }

      }
    });
    res.json(user);
  })
 router.put('/user/:id', async (req, res) => {
    
    try {
      const { id } = req.params;
      const updateuser = await prisma.user.update({
        where: { id: Number(id)},
        data:{
            imagen: req.body.imagen,
        }
      });
      res.json(updateuser);
    } catch(e) {
      res.json({error: `User con la id: ${id} no existe`})
    }
  })
//GET TODO DE CADA FACULTAD
router.get('/users', async (req, res) => {
    const userss = await prisma.user.findMany({
      select:{
        id: true,
        username: true,
        imagen: true,
        email: true,
        password: true,
        followers: {
          select:{
            follower : {
              select:{
                id : true,
                email: true,
                username: true,
              }
            }
          }
        },
        following: {
          select:{
            following : {
              select:{
                id : true,
                email: true,
                username: true,
                post: {
                  select:{
                    id : true,
                    content: true,
                  }
                },
                imagen: true,
                comments: true,

              }
            }
          }
        },
        post: {
          select:{
                id : true,
                content: true,
                createdAt: true,
                likes: true,
                comments: true,
              }
            },comments: {
              select:{
                id : true,
                content: true,
                createdAt: true,
                user: {
                  select:{
                    id : true,
                    username: true,
                    imagen: true,
                    email: true,
                  }
                },
              }
            }
          
        

      }
    });
    res.json(userss);
  })



  router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findMany({
      where: { id: Number(id)},
      select:{
        id: true,
        username: true,
        imagen: true,
        email: true,
        password: true,
        followers: {
          select:{
            follower : {
              select:{
                id : true,
                email: true,
                username: true,
                comments: true,
              }
            }
          }
        },
        following: {
          select:{
            following : {
              select:{
                imagen: true,
                id : true,
                email: true,
                username: true,
                post: {
                  select:{
                    user:{
                      select:{
                        username: true,
                        imagen: true,}
                    },
                    content: true,
                    }
                },
                comments: true,
              }
            }
          }
        },
        post: {
          select:{
                id : true,
                content: true,
                createdAt: true,
                likes: true,
                comments: true,
                user: {
                  select:{
                    username: true,
                    imagen: true,
                    email: true,
                  }
                }
              }
            },comments: {
              select:{
                id : true,
                content: true,
                createdAt: true,
                user: {
                  select:{
                    username: true,
                    imagen: true,
                    email: true,
                  }
                }
              }
            }
          
        

      }
    });
    res.json(user);
  })

  router.delete(`/user/:id`, async (req, res) => {
    const { id } = req.params;
    try{
    const user = await prisma.user.delete({
      where: { id: Number(id)},
    });
    if(user){
      res.json({Completado: `User con el id ${id} borrado exitosamente` })
      res.json(user);
  
    }else{
      res.json({error: `User con el id ${id} no se puede borrar ya que no existe`})
    }
  }catch(e){
    res.json({error: `User con el id  ${id} no se puede borrar ya que no existe`})
  }})
  

  router.get('/following/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findMany({
      where: { id: Number(id)},
      select:{
        following: {
          select:{
            following : {
              select:{
                imagen: true,
                id : true,
                email: true,
                username: true,
                post: true,
                comments: true,
              }
            }
          }
        },
      
        

      }
    });
    res.json(user);
  })





     
      
      

  

module.exports = router;