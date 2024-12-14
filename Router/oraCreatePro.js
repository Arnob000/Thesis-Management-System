//teacher registration

const express=require('express');
const router=express.Router();
var oracledb=require('oracledb');
//dropdown theke data nite
var data= require('../data/data.json'); 
var fs=require('fs');
const { finished } = require('stream');

router.use(express.json());

router.post('/createProject',(req,res,next)=>{
    console.log(req.body);
    //get the data from req
    const {projectname, minstu, des}=req.body;
    console.log('minstu',minstu)
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
                    const params = {'result':'Unsuccessful','types': data['types']}
                    res.status(200).render('createProject.pug',params);  
                }
                else{
                      //do require operation
                    let flag=0;
                    console.log('Connection succesful');
                    let a=fs.readFileSync("logUserID.txt","utf-8")
                    a=isNaN(a) ? a : parseInt(a)
                    console.log(minstu);
                    const sq=`begin
                    New_proj(${a},'${projectname}','${des}','${req.body.dropDown}',${minstu});
                    end;`;
                    connection.execute(sq, [], {autoCommit: true}, (e,r)=>{
                    if(e){
                        console.log('Error: ',r);
                        //dropdown buton
                        const params = {'result':'Unsuccessful','types': data['types']}
                        res.status(200).render('createProject.pug',params);  
                    }
                    else{
                        //send response
                        console.log(r);
                        flag=1;
                        const params = {'result':'Successful','types': data['types']}
                        res.status(200).render('createProject.pug',params);                               
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
router.get('/createProject',(req, res, next) => {
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
                    const params = {'result':'Unsuccessful','types': data['types']}
                    res.status(200).render('createProject.pug',params);  
                } else {
                    console.log('Connection successful');
                    const p = 'select field from category';
                    
                    con.execute(p, [], (e, r) => {
                         if(e){
                            console.log('Error: ',r);
                            //dropdown buton
                            const params = {'result':'Unsuccessful','types': data['types']}
                            res.status(200).render('createProject.pug',params);  
                        }
                        else{
                            //send response
                            let fields=[];
                           
                            r.rows.map(a=>{fields.push(a[0])})
                            
                            console.log(fields);
                            data.types=fields;
                            const params = {'result':'','types': data['types']}
                            res.status(200).render('createProject.pug',params);  
                      
                           }
                    });
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
});

module.exports=router;