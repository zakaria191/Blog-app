const express = require('express');
const router = express.Router();
const post = require('../MODELS/post');
const User = require('../MODELS/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminlayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

// check login middlewar
const authMiddleware = (req,res,next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({ message: 'unauthorized'});
    }
}


// admin- login page route
router.get('/admin', async (req, res) => {
  try {

    const locals = {
        title: "admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }

    res.render('admin/index', { locals, layout:  adminlayout});
  } catch (error) {
    console.log(error);
  }

});

// Post/admin- check login
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne( { username });
        if (!user) {
            return res.status(401).json({ message: 'invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'invalid credentials'});
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token,{httpOnly: true});
        res.redirect('/dashbord');

    } catch (error) {
      console.log(error);
    }
  });

// dashbord route

router.get('/dashbord', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "dashbord",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      const data = await post.find();
      res.render('admin/dashbord', {
        locals,
        data,
        layout: adminlayout
      });
    } catch (error) {
      console.log(error);
      res.render('admin/dashbord', { error }); // Render with an error message or handle the error as needed
    }
  });
  




  // Post/admin- register
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 5);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User created', user});
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use'});
            }
            res.status(500).json({ message: 'internal server' })
        }
    } catch (error) {
      console.log(error);
    }
  
  });


//  GET / Create a new post
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "add post",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      const data = await post.find();
      res.render('admin/add-post', {
        locals,
        data,
        layout: adminlayout
      });
    } catch (error) {
      console.log(error);
      res.render('admin/dashbord', { error }); // Render with an error message or handle the error as needed
    }
  });

//  POST / Create a new post
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new post({
                title: req.body.title,
                body: req.body.body
            });

            await post.create(newPost);
            res.redirect('/dashbord');
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
      console.log(error);
      
    }
  });


  /**
    * get /
    * Admin - Create New Post
    */
  router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "add post",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }
       const data = await post.findOne({ _id: req.params.id });

       res.render('admin/edit-post',{
       data,
       locals,
       layout: adminlayout
    })

    } catch (error) {
      console.log(error);
    }
  });






    /**
    * PUT /
    * Admin - Create New Post
    */
    router.put('/edit-post/:id', authMiddleware, async (req, res) => {
        try {
           await post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
           });

           res.redirect(`/edit-post/${req.params.id}`)
    
        } catch (error) {
          console.log(error);
        }
      });

      /**
    * DELETE /
    * Admin - Delete Post
    */

      router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

        try {
            await post.deleteOne({_id: req.params.id});
            res.redirect('/dashbord');
        } catch (error) {
            console.log(error);
        }
      });

    /**
    * GET /
    * Admin - Log Out
    */

    router.get('/logout', (req, res) => {
        res.clearCookie('token');
        res.redirect('/admin');
    });
module.exports = router;