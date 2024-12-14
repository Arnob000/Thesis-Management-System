//student registration

const express=require('express');
//const { autoCommit } = require('oracledb');
const router=express.Router();
var oracledb=require('oracledb');
var fs=require('fs');
const { finished } = require('stream');

router.use(express.json());

router.post('/registration',(req,res,next)=>{
    console.log('all info:',req.body);
    //get the data from req
    const {firstname, lastname, phone, dob, email, address, username, password, department, level, term}=req.body;

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
                    res.status(200).render('registration.pug',params);  
                }
                else{
                        //do require operation
                    let flag=0;
                    console.log('Connection succesful');
                    const sq=`insert into person(first_name, last_name, phone, email_id, address,date_of_birth, username, password, type) values('${firstname}', '${lastname}', ${phone}, '${email}', '${address}', '${dob}', '${username}', '${password}', 'Student')`;
                    connection.execute(sq, [], {autoCommit: true}, (e,r)=>{
                    if(e){
                        console.log('Error: ',r);
                        const params = {'result':'Unsuccessful'}
                        res.status(200).render('registration.pug',params);  
                    }
                    else{
                        //send response
                        console.log(r);
                        const params = {'result':'Successful'}
                        fs.writeFileSync("logUser.txt",username)
                        const slq=`select ID from person where username='${username}' `;
                        connection.execute(slq, [], (e,r)=>{
                            console.log(r);
                            fs.writeFileSync("logUserID.txt",(r.rows[0][0]).toString())
                            const studentin=`insert into student(ID, DEPARTMENT, LEVEL_NO, TERM) values( ${r.rows[0][0]}, '${department}', '${level}', '${term}' )`;
                            connection.execute(studentin, [], {autoCommit: true}, (e,r)=>{
                                if(e){
                                    console.log('Error: ',r);
                                }
                                else{
                                    console.log(r);  
                                    res.status(200).render('home.pug',params);                               
                                }                   
                            });
                        }); 
                                                      
                    }
                                                    
                    });

                                       
                }
            }
        );
    }catch(e){
        console.log(e)
    }
})

router.get('/reinfo',(req, res, next) => {
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
                    res.status(200).render('reinfo.pug',params);  
                } else {
                    console.log('Connection successful');
                    const p = 'select * from research_info ';
                    
                    con.execute(p, [], (e, r) => {
                        if (e) {
                            res.send(e);
                        } else {
                            console.log("rrrr", r.rows);
                            // console.log(r.rows);
                            
                            let projName=[];
                            r.rows.map(a=>{projName.push(a[1]+', '+a[2]+'\n')})
                            
                            // console.log(projName);
                            const params={'items':r.rows};
                            res.status(200).render('reinfo.pug',params); 
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