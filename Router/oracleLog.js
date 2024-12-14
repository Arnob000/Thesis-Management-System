const express=require('express');
var fs=require('fs')
//const { autoCommit } = require('oracledb');
const router=express.Router();
var oracledb=require('oracledb');

router.use(express.json());

router.post('/login',(req,res,next)=>{
    console.log(req.body);
    //get the data from req
    const {username,password}=req.body;
    //coneect with db
    try{
        oracledb.getConnection(
            {
                user: 'RNET',
                password: 'rnet',
                tns:'localhost:1521/ORCL',
            },
            (err,connection)=>{
                if(err){
                    console.log('db connection failed: ',err);
                    const params = {'result':'Unsuccessful'}
                    res.status(200).render('login.pug',params);  
                }
                else{
                      //do require operation
                    console.log('Connection succesful');
                    const sq=`select password, type, id from person where username='${username}' `;
                    console.log(sq);
                    connection.execute(sq, [], (e,r)=>{
                                       
                        console.log(r);
                     
                        if(r && r.rows && r.rows[0] && password == r.rows[0][0]){
                            fs.writeFileSync("logUser.txt",username)
                            console.log(r.rows[0][2])
                            var iden=r.rows[0][2];
                            //fs er file e only text rakha jai
                            fs.writeFileSync("logUserID.txt",(iden).toString())
                           //isNaN(file_output) ? file_output : parseInt(file_output) //number e convert
                            
                            let a=fs.readFileSync("logUserID.txt","utf-8")
                            a=isNaN(a) ? a : parseInt(a) //number e convert
                            console.log('->>>',a)
                            if(r.rows[0][1]=='Teacher'){
                                const params = {'result':'Unsuccessful'}
                                res.status(200).render('TeacherHome.pug');
                            }
                            else if(r.rows[0][1]=='Student')
                                res.status(200).render('home.pug');
                        }
                        else
                        {
                            const params = {'result':'Unsuccessful'}
                            res.status(200).render('login.pug',params);  
                        }
                    });   
                   
                }
            }
        );
    }catch(e){
        console.log(e)
    }
})
module.exports=router;