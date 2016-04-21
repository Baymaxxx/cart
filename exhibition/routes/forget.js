var nodemailer = require("nodemailer");
var crypto = require("crypto");
module.exports = function(app){
    app.get('/forget', function (req, res) {
        //var user = req.session.user;
        //if(user){
        //    return res.redirect('/');
        //}
        res.render('forget', {
            title : 'OMinds - 找回密码'
          });
    });
    app.post('/sendmail',function(req,res){
        var User = global.dbHelper.getModel("user");
        var email = req.body.uemail;
        if(!email){
            req.session.error = "请填写邮箱";
            res.send(404);
        }else {
            User.findOne({email:email},function(err,doc){
                console.log(doc);
                var transporter = nodemailer.createTransport({
                    host: "smtp.163.com",
                    port: 25,
                    auth: {
                        user: 'wangyiyun167@163.com',
                        pass: 'zhongshuai123'
                    }
                });
                var mailOptions = {
                    from: {
                        name: '展览馆',
                        address: 'wangyiyun167@163.com'
                    }, // sender address
                    to: email, // list of receivers
                    name: '用户密码找回',
                    subject: '用户密码找回', // Subject line
                    text: "用户:" + doc.name
                    + "，请点击（复制）此链接进行密码更新:<a href=http://"
                    + req.headers.host + "/usersetting?uid="
                    + doc.password + "  >" + req.headers.host
                    + "/usersetting?uid=" + doc.password
                    + "</a><br>请勿回复。", // plaintext body
                    html: "用户:" + doc.name
                    + "，请点击（复制）此链接进行密码更新:<a href=http://"
                    + req.headers.host + "/usersetting?uid="
                    + doc.password + "  >" + req.headers.host
                    + "/usersetting?uid=" + doc.password
                    + "</a><br>请勿回复。" // html body
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                res.render('forgetsend', {
                    title : '邮件发送完成',
                    email : email,
                    user : null
                });
            })
        }
    });
    app.get('/usersetting',function(req,res){
        var User = global.dbHelper.getModel("user");
        var password = req.query.uid;
        User.findOne({password:password},function(err,doc){
            res.render('usersetting',{title:"123",user:doc});
            console.log(doc);
        });
    });
    app.post('/cpwd',function(req,res){
        var User = global.dbHelper.getModel('user');
        var name = req.body.name;
        var password = req.body.password;
        var md5 = crypto.createHash('md5'),
            password = md5.update('password').digest('hex');
        User.update({name:name},{$set:{password:password}},function(err,doc){
            if(err){
                req.session.error = err;
            }else {
                req.session.user = doc;
                res.send({status:'success'})
            }
        })

    })
}