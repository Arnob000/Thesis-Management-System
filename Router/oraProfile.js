//show profile

const express=require('express');
const router=express.Router();
var oracledb=require('oracledb'); 
var fs=require('fs')

router.use(express.json());

router.get('/profile',(req, res, next) => {
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
                    // const params = {'result':'Unsuccessful'}
                    // res.status(200).render('profile.pug',params);  
                } else {
                    console.log('Connection successful');
                    let a=fs.readFileSync("logUser.txt","utf-8")    //let is added
                    const p = `select * from person where username='${a}'`;
                   
                    con.execute(p, [], (e, r) => {
                        if (e) {
                            console.log(e)
                            // const params = {'result':'Unsuccessful'}
                            // res.status(200).render('profile.pug',params);  
                        } else {                           
                            // const params={'items':r.rows};
                            
                            var idnum=r.rows[0][6]
                            var type=r.rows[0][8]
                            console.log(r.rows)
                            const q = `select * from ${type} where id=${idnum}`;
                   
                            con.execute(q, [], (er, rr) => {
                                if (er) {
                                    console.log(er)
                                } else {     
                                    console.log(rr.rows)                      
                                    const params={'items':r.rows,'others':rr.rows};
                                    res.status(200).render('profile.pug',params); 
                                }
                            }); 
                        }
                    });
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
});



router.get('/profileTeacher',(req, res, next) => {
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
                    // const params = {'result':'Unsuccessful'}
                    // res.status(200).render('profile.pug',params);  
                } else {
                    console.log('Connection successful');
                    let a=fs.readFileSync("logUser.txt","utf-8")    //let is added
                    const p = `select * from person where username='${a}'`;
                   
                    con.execute(p, [], (e, r) => {
                        if (e) {
                            console.log(e)
                            // const params = {'result':'Unsuccessful'}
                            // res.status(200).render('profile.pug',params);  
                        } else {                           
                            // const params={'items':r.rows};
                            
                            var idnum=r.rows[0][6]
                            var type=r.rows[0][8]
                            console.log(r.rows)
                            const q = `select * from ${type} where id=${idnum}`;
                   
                            con.execute(q, [], (er, rr) => {
                                if (er) {
                                    console.log(er)
                                } else {     
                                    console.log(rr.rows)                      
                                    const params={'items':r.rows,'others':rr.rows};
                                    res.status(200).render('profileTeacher.pug',params); 
                                }
                            }); 
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