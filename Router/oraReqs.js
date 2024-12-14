const express=require('express');
//const { autoCommit } = require('oracledb');
const router=express.Router();
var oracledb=require('oracledb');
var fs=require('fs');
const { finished } = require('stream');

router.use(express.json());

router.get('/reqs',(req, res) => {
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
                    res.status(200).render('req_approved.pug',params);  
                } else {
                    console.log('Connection successful');
                    let id=fs.readFileSync("logUserId.txt","utf-8")
                    id=isNaN(id)? id: parseInt(id)
                    console.log('id',id)

                    var p=`
                    select r.project_name, r.id
                    from teacher_does_research tr join research_info r on(tr.research_id=r.id)
                    where tr.teacher_id=${id} and r.status='New' `;
                    
                    con.execute(p, [], (e, r) => {
                        if (e) {
                            console.log(e);
                        } else {
                            console.log(r);
                            let projName=[];
                            r.rows.map(a=>{projName.push(a[0]+', '+a[1]+'\n')})
                            const params = { 'items': r.rows };
                            
                            res.status(200).render('req_approved.pug', params);
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
