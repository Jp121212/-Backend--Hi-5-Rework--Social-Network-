const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();
router.use(cors());


//POST FACULTAD
router.post('/follows', async (req, res) => {
   
    const result = await prisma.follows.create({
        follower: req.body.follower,
        following: req.body.following,
    });

    if (!follower || !following) {
        return res.status(400).json({
            message: 'No puedo crear seguidor repetido'
        });
    } else {
        res.json(result);
    }
  })

//GET TODO DE CADA FACULTAD
router.get('/follows', async (req, res) => {
    const userss = await prisma.follows.findMany({
        select:{
            follower: {
              select:{
                id : true,
                email: true,
                username: true,
                imagen: true,
                
              }
            },
            following: {
              select:{
                id : true,
                email: true,
                username: true,
                imagen: true,

              }
            }
          }
    });
    res.json(userss);
  })

  //GET TODO DE CADA FACULTAD
router.delete('/follow/:id', async (req, res) => {
 
  try{ const userss = await prisma.follows.delete({
    where: { following : { id: req.body.following } }
  });
   if (userss) {
    res.json({
      message: 'Se ha eliminado correctamente'
    }); 
    res.json(userss); 
  }else{
    res.json({
      message: 'No se ha eliminado correctamente'
    });}
  }catch(error){
    res.json({error: error});
  }
  })
 
  router.get('/follows/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.follows.findMany({
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
                post: true,
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
              }
            }
          
        

      }
    });
    res.json(user);
  })

  
  




  module.exports = router;