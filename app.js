const express=require('express')
const path = require('path')
const app=express();    
const port=8000

//oralceCon theke file nibe
var oracleRouter=require('./Router/oracleCon.js');
var oraclelog=require('./Router/oracleLog.js');
var oraTea=require('./Router/oracleTea.js');
var oraINFO=require('./Router/oraINFO.js');
var oraProfile=require('./Router/oraProfile.js');
var oraTeaINFO=require('./Router/oraTeaReInfo.js');
var oraCreatePro=require('./Router/oraCreatePro.js');
var oraCreateTask=require('./Router/oraTask.js');
var oraTeaInfo2=require('./Router/oraTeaInfo.js');
var oraStuInfo=require('./Router/oraStuReInfo.js');
var oraStuInfo2=require('./Router/oraStuInfo.js');
var oraReq=require('./Router/oraReqs.js');
var oraReq2=require('./Router/oraReqs2.js');
var oraReq3=require('./Router/oraReq3.js');

const data= require('./data/data.json');

//app.use('./static', express.static('static'))
 app.use(express.static('static'))
app.use(express.urlencoded())

//oracle k use korbe
app.use(oracleRouter);
app.use(oraclelog);
app.use(oraTea);
app.use(oraINFO);
app.use(oraProfile);
app.use(oraTeaINFO);
app.use(oraCreatePro);
app.use(oraCreateTask);
app.use(oraTeaInfo2);
app.use(oraStuInfo);
app.use(oraStuInfo2);
app.use(oraReq);
app.use(oraReq2);
app.use(oraReq3);
//PUG RELATED STUFF
app.set('view engine', 'pug')

//set  the views directory
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)=>{
    res.status(200).render('mainHome.pug');  
})

app.get('/about', (req,res)=>{
    res.status(200).render('mainAbout.pug');  
})

app.get('/home', (req,res)=>{
    const params = {}
    res.status(200).render('home.pug',params);  
})


//info stu
app.get('/reinfoStu',(req,res)=>{
    res.status(200).render('reinfoStu.pug')
})

//QA
app.get('/QA',(req,res)=>{
    res.status(200).render('QA.pug')
})

//contact3
app.get('/contact3',(req,res)=>{
    res.status(200).render('contact3.pug')
})


//np
app.get('/newProject',(req,res)=>{
    oraStuInfo.get();
})

app.get('/newShow/:id',(req,res)=>{
    oraStuInfo2.get();
})

app.get('/newShow2/:id',(req,res)=>{
    oraStuInfo2.get();
})
// app.post('/newShow2/:id',(req,res)=>{
//     oraStuInfo2.get();
// })

//teacher
app.get('/teacherHome',(req,res)=>{
    res.status(200).render('teacherHome.pug')
})



app.get('/createProject',(req,res)=>{
    oraCreatePro.get();
})

app.post('/createProject',(req,res)=>{
    oraCreatePro.post();
})

app.get('/createTask',(req,res)=>{
    oraCreateTask.get();
})

app.post('/createTask',(req,res)=>{
    oraCreateTask.post();
})

app.get('/reqs',(req,res)=>{
    oraReq.get();
})

app.get('/reqs/:id',(req,res)=>{
    oraReq.get();
})
app.get('/reqs2/:id',(req,res)=>{
    oraReq2.get();
})

app.get('/reqs3/:id',(req,res)=>{
    oraReq3.get();
})


app.get('/QAT',(req,res)=>{
    res.status(200).render('QAT.pug')
})





//drop down list theke input
// app.get('/registration', (req,res)=>{
//     res.status(200).render('registration.pug',{
//         types: data['types'],
//     });  
// })

app.get('/registration',(req,res)=>{
    res.status(200).render('registration.pug')
})

//database e data save korte
app.post('/registration', (req,res)=>{  
    oracleRouter.post();
})

app.get('/regTeacher',(req,res)=>{
    oraTea.get();
    // res.status(200).render('regTeacher.pug',{
    //             types: dt['types'],
    //         })
})

//database e data save korte
app.post('/regTeacher', (req,res)=>{  
    oraTea.post();
})

// app.get('/TeacherHome',(req,res)=>{
//     oraTea.get();
// })
//teacher's research info
app.get('/treinfo', (req,res)=>{
    oraTeaINFO.get(); 
})

app.get('/tshowRINFO/:id', (req,res)=>{
    oraTeaInfo2.get(); 
})

app.get('/TeacherHome',(req,res)=>{
    res.status(200).render('TeacherHome.pug'); 
})
app.get('/reinfo', (req,res)=>{
    res.status(200).render('reinfo.pug');  
    oracleRouter.get();
})

app.get('/showRINFO/:id', (req,res)=>{
    oraINFO.get(); 
})


app.get('/contact1', (req,res)=>{
    res.status(200).render('contact1.pug');  
})

app.get('/contact2', (req,res)=>{
    res.status(200).render('contact2.pug');  
})


app.get('/login', (req,res)=>{
    res.status(200).render('login.pug');  
})

app.post('/login', (req,res)=>{
    res.status(200).render('login.pug'); 
    oraclelog.post(); 
})

app.get('/profile', (req,res)=>{
    oraProfile.get();
})

app.get('/profileTeacher', (req,res)=>{
    oraProfile.get();
})

//START THE SERVER
app.listen(port, ()=>{
    console.log(`this application started on port ${port}`)
})


