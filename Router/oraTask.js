//teacher registration
var fs=require('fs')
const express=require('express');
const router=express.Router();
var oracledb=require('oracledb');
//dropdown theke data nite
var data= require('../data/data.json'); 
var fs=require('fs');
const { finished } = require('stream');

router.use(express.json());

router.post('/createTask',(req,res,next)=>{
    console.log(req.body);
    //get the data from req
    const {taskname, deadline, des}=req.body;
    
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
                    res.status(200).render('createTask.pug',params);  
                }
                else{
                      //do require operation
                    
                    console.log('Connection succesful');
                    let a=fs.readFileSync("logUserID.txt","utf-8")
                    a=isNaN(a) ? a : parseInt(a)
                    let rid=fs.readFileSync("researchid.txt","utf-8")
                    rid=isNaN(rid)? rid: parseInt(rid)
                   
                    const sq=`begin
                    new_task(${a},${rid},'${taskname}','${deadline}','${des}');
                    end;`;
                    connection.execute(sq, [], {autoCommit: true}, (e,r)=>{
                    if(e){
                        console.log('Error: ',r);
                        //dropdown buton
                        const params = {'result':'Unsuccessful'}
                        res.status(200).render('createTask.pug',params);  
                    }
                    else{
                        //send response
                        console.log(r);
                        flag=1;
                        const params = {'result':'Successful'}
                        res.status(200).render('createTask.pug',params);                               
                    }

                                                    
                });

                    
                }
            }
        );
    }catch(e){
        console.log(e)
    }
})

//geting the values of category
router.get('/createTask',(req, res, next) => {
    try {
        oracledb.getConnection(
            {
                user: 'Rnet',
                password: 'rnet',
                tns: 'localhost:1521/ORCL',
            },
            (err, con) => {
                if (err) {
                    console.log('db connection failed: ',err);
                    const params = {'result':'Unsuccessful'}
                    res.status(200).render('createTask.pug',params);  
                } else {
                    console.log('Connection successful');
                    console.log('Connection succesful');
                    let a=fs.readFileSync("logUserID.txt","utf-8")
                    a=isNaN(a) ? a : parseInt(a)
                    let rid=fs.readFileSync("researchid.txt","utf-8")
                    rid=isNaN(rid)? rid: parseInt(rid)
                    const params = {'result':''}
                    res.status(200).render('createTask.pug',params);  
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
});

module.exports=router;