const express=require('express');
//const { autoCommit } = require('oracledb');
const router=express.Router();
var oracledb=require('oracledb');
var fs=require('fs');
const { finished } = require('stream');

router.use(express.json());

router.get('/reqs3/:id',(req, res) => {
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
                    res.status(200).render('req_approved2.pug',params);  
                } else {
                    console.log('Connection successful');
                    let id=fs.readFileSync("researchid.txt","utf-8")
                    id=isNaN(id)? id: parseInt(id)
                    console.log('id',id)
                    console.log(req.params.id)

                    var p=`begin
                    student_par_in(${req.params.id},${id});
                    end; `;
                    
                    con.execute(p, [], (e, r) => {
                        if (e) {
                            console.log(e);
                        } else {
                            console.log(r);
                            let projName=[];
                            //r.rows.map(a=>{projName.push(a[2]+', '+a[3]+'\n')})
                            const params = { 'result':'Successful' };
                            
                            //res.status(200).render('req_approved3.pug', params);
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
