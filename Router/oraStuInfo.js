//show info
var fs=require('fs')
const express=require('express');
const router=express.Router();
var oracledb=require('oracledb'); 

router.use(express.json());

router.get('/newShow/:id',(req, res, next) => {
    console.log('req',req.params)
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
                    res.status(200).render('newshow.pug',params);  
                } else {
                    let flag=0;
                    console.log('Connection successful');
                    
                    const p = `select * from table(show_new(${req.params.id}))`;
                                    
                    //const p = `select id, project_name, description from research_info where ID=${req.params.id}`;
                    
                    con.execute(p, [], (e, r) => {
                        if (e) {
                            console.log(e)
                            const params = {'result':'Unsuccessful'}
                            res.status(200).render('newshow.pug',params);  
                        } else {          
                            fs.writeFileSync("researchid.txt",(req.params.id).toString())                 
                            let projName=[];
                            r.rows.map(a=>{projName.push(a[0]+', '+a[1]+', '+a[2])})
                            console.log(projName);
                            const param2={'items':r.rows};
                           
                  
                            console.log(r);                                    
                            res.status(200).render('newshow.pug',param2);                         
                        }
                    });

                   
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
});

router.get('/newShow2/:id',(req,res,next)=>{
    console.log(req.params.id);
    //get the data from req
    
    
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
                    res.status(200).render('newshow2.pug',params);  
                }
                else{
                      //do require operation
                    
                    console.log('Connection succesful');
                    let a=fs.readFileSync("logUserID.txt","utf-8")
                    a=isNaN(a) ? a : parseInt(a)
                    console.log('a',a)      
                    const sq=`begin
                    student_req(${a},${req.params.id});
                    end;`;
                    connection.execute(sq, [], {autoCommit: true}, (e,r)=>{
                    if(e){
                        console.log('Error: ',r);
                        //dropdown buton
                        const params = {'result':'Unsuccessful'}
                        res.status(200).render('newshow2.pug',params);  
                    }
                    else{
                        //send response
                        console.log(r);
                        flag=1;
                        const params = {'result':'Successful'}
                        res.status(200).render('newshow2.pug',params);                               
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
