//show info

const express=require('express');
const router=express.Router();
var oracledb=require('oracledb'); 

router.use(express.json());

router.get('/showRINFO/:id',(req, res, next) => {
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
                    res.status(200).render('showRINFO.pug',params);  
                } else {
                    console.log('Connection successful');
                    const p = `select project_name, description from research_info where ID=${req.params.id}`;
                    
                    con.execute(p, [], (e, r) => {
                        if (e) {
                            console.log(e)
                            const params = {'result':'Unsuccessful'}
                            res.status(200).render('showRINFO.pug',params);  
                        } else {                           
                            let projName=[];
                            
                            r.rows.map(a=>{projName.push(a[0]+', '+a[1]+'\n')})
                            
                            // console.log(projName);
                            const params={'items':r.rows};
                            res.status(200).render('showRINFO.pug',params); 
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