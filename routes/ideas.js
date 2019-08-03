var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

require('../models/idea');
const Idea = mongoose.model('ideas');

require('../models/comment');
const Comment = mongoose.model('comment');

const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', ensureAuthenticated, async(req, res) => {
    console.log("/", req.user.firstUser);
    let ideas=await Idea.find({}) .sort({date: 'desc'});
    let comments=await Comment.find({});
    res.render('ideas/index', {
        ideas: ideas,
        comments:comments
    });



});

router.get('/add', ensureAuthenticated, (req, res) => {
    console.log("/add", req.user.firstUser);
    let errors = [];
    res.render('ideas/add', {
        errors: errors,
        title: req.body.title,
        details: req.body.details
    });

});

router.post('/add_comment', ensureAuthenticated, async(req, res) => {
    let errors = [];
    if (!req.body.comment) {
        console.log("no comment");
        errors.push({text: "comment required"});
    }
    if (errors.length > 0) {
        console.log(errors);
        let ideas=await Idea.find({}) .sort({date: 'desc'});
        let comments=await Comment.find({});
        res.render('ideas/', {
            errors: errors,
            comment: req.body.comment,
            comments:comments,
            ideas:ideas
        });
    }
    else {
        const newComment = {
            text: req.body.comment,
            idea: req.body.idea_id,
            user: req.user.id,
            name:req.user.name//from passport.js
        };
        console.log(req.user.name);

        new Comment(newComment).save().then(() => {

            req.flash("success_msg", "comment Successfully Added");
            res.redirect('/ideas');
        })


    }


});

router.post('/delete_comment', ensureAuthenticated, async(req, res) => {
    let id=req.body.comment_id;
    await Comment.findOneAndDelete({
        _id: id,
        user: req.user.id
    })
        .then(() => {
            req.flash("success_msg", "successfully deleted");
            res.redirect('/ideas');
        })
});

router.post('/edit_comment', ensureAuthenticated, async (req, res) => {

    await Comment.findOne({
        _id: req.body.comment_id,
        user: req.user.id
    })
        .then(comment => {
            comment.text = req.body.comment;
            comment.save()
                .then(() => {
                    req.flash("success_msg", "successfully updated");
                    res.redirect('/ideas');
                })
        })

});

router.post('/add', (req, res) => {

    let errors = [];
    if (!req.body.title) {
        errors.push({text: "title required"});
    }
    if (!req.body.details) {
        errors.push({text: "details required"});
    }
    if (errors.length > 0) {

        console.log(errors);
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {

        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id,
            name:req.user.name
            //from passport.js
        };

        new Idea(newUser).save().then(() => {

            req.flash("success_msg", "Successfully Added");

            res.redirect('/ideas');
        })
    }

});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id,
        user: req.user.id
    })
        .then(idea => {


            res.render('ideas/edit', {
                idea: idea
            });
        })

});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    let ideas=await  Idea.findOne({
        _id: req.params.id,
        user: req.user.id

    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(() => {
                    req.flash("success_msg", "successfully updated");
                    res.redirect('/ideas');
                })
        })
});

router.delete('/:id', ensureAuthenticated, async(req, res) => {
    let id = req.params.id;
    let comment = await Comment.find({
        idea: id
    });
    //deleting all comments
    for (let i = 0; i < comment.length; i++)
    {
        await Comment.findOneAndDelete({
            _id: comment[i]._id,
        })

    }
    console.log(comment);
    await Idea.findOneAndDelete({
        _id: id,
        user: req.user.id
    })
        .then(() => {
            req.flash("success_msg", "successfully deleted");
            res.redirect('/ideas');
        })

});

module.exports = router;
