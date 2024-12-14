//teacher registration

const express=require('express');
const router=express.Router();
var oracledb=require('oracledb');
//dropdown theke data nite
var data= require('../data/data.json'); 
var fs=require('fs');
const { finished } = require('stream');

router.use(express.json());

router.post('/regTeacher',(req,res,next)=>{
    console.log(req.body);
    //get the data from req
    const {firstname, lastname, phone, dob, email, address, username, password, department, designation}=req.body;

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
                    res.status(200).render('regTeacher.pug',params);  
                }
                else{
                      //do require operation
                    let flag=0;
                    console.log('Connection succesful');
                    const sq=`insert into person(first_name, last_name, phone, email_id, address,date_of_birth, username, password, type) values('${firstname}', '${lastname}', ${phone}, '${email}', '${address}', '${dob}', '${username}', '${password}', 'Teacher')`;
                    connection.execute(sq, [], {autoCommit: true}, (e,r)=>{
                    if(e){
                        console.log('Error: ',r);
                        //dropdown buton
                        const params = {'result':'Unsuccessful','types': data['types']}
                        res.status(200).render('regTeacher.pug',params);  
                    }
                    else{
                        //send response
                        console.log(r);
                        fs.writeFileSync("logUser.txt",username)
                        flag=1;
                        const params = {'result':'Successful'}
                        res.status(200).render('home.pug',params);                               
                    }

                    if(flag==1){ 
                        const slq=`select ID from person where username='${username}' `;
                        connection.execute(slq, [], (e,r)=>{
                            console.log(r);
                            fs.writeFileSync("logUserID.txt",(r.rows[0][0]).toString())
                            const teain=`insert into teacher(ID, DEPARTMENT, DESIG, FIELD) values( ${r.rows[0][0]}, '${department}', '${designation}', '${req.body.dropDown}' )`;
                            connection.execute(teain, [], {autoCommit: true}, (e,r)=>{
                                if(e){
                                    console.log('Error: ',r);
                                }
                                else{
                                    console.log('output',r);                            
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

//geting the values of category
router.get('/regTeacher',(req, res, next) => {
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
                    res.status(200).render('regTeacher.pug',params);  
                } else {
                    console.log('Connection successful');
                    const p = 'select field from category';
                    
                    con.execute(p, [], (e, r) => {
                         if(e){
                            console.log('Error: ',r);
                            //dropdown buton
                            const params = {'result':'Unsuccessful','types': data['types']}
                            res.status(200).render('regTeacher.pug',params);  
                        }
                        else{
                            //send response
                            let fields=[];
                           
                            r.rows.map(a=>{fields.push(a[0])})
                            
                            console.log(fields);
                            data.types=fields;
                            const params = {'result':'','types': data['types']}
                            res.status(200).render('regTeacher.pug',params);  
                      
                           }
                    });
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
});

//at now does not need
// router.get('/TeacherHome',(req, res, next) => {
//     try {
//         oracledb.getConnection(
//             {
//                 user: 'Rnet',
//                 password: 'rnet',
//                 tns: 'localhost:1521/ORCL',
//             },
//             (err, con) => {
//                 if (err) {
//                     console.log('db connection failed: ',err);
//                     const params = {'result':'Unsuccessful'}
//                     res.status(200).render('login.pug',params);  
//                 } else {
//                     let id=fs.readFileSync("logUserId.txt","utf-8")
//                     id=isNaN(id)? id: parseInt(id)
//                     console.log('id',id)
//                     console.log('Connection successful');
//                     //change to num--id
//                     // const p = `select r.project_name, r.description 
//                     // from teacher_does_research tr  join research_info r on(tr.research_id=r.id)
//                     // where tr.teacher_id=${id}`;
                    
//                     var p=`declare
//                     tid number;
//                     pname varchar2(100);
//                     des varchar2(1000);
//                     ret varchar2(2000);
//                     begin
//                     teadoesresearch(tid, pname, des);
//                     :ret := pname ||' '|| des;
//                     end;`;
                    
//                     con.execute(p, { ret: {dir: oracledb.BIND_OUT,type: oracledb.STRING} }, (e, r) => {
//                         if (e) {
//                             console.log(e);
//                         } else {
//                             console.log("result:", r.outBinds.ret);

//                              let projName = [];
//                              r.rows.map(a => { projName.push(a[0] + ', ' + a[1] + '\n'); });

//                              console.log(projName);
//                              const params = { 'items': r.rows };
//                             res.status(200).render('TeacherHome.pug', params);
//                         }
//                     });
//                 }
//             }
//         );
//     } catch (e) {
//         console.log(e);
//     }finally {
//         if (con) {
//           try {
//             con.close();
//           } catch (e) {
//             console.error(e);
//           }
//         }
//       }
// });


module.exports=router;

//to solve err
// https://stackoverflow.com/questions/55976578/node-oracledb-execute-pl-sql-function