const datas = require('../services/data.json');
const fs = require('fs');
const path = require('path');
const { WebcastPushConnection } = require('tiktok-live-connector');
let listData = datas;
exports.homeRoutes = (req, res)=>{
    for( let data in listData){
        if(isLive(data.id)){
            data.status = "Đang Live";
        }else{
            data.status = "Offline";
        }
    };
    writeFile("Reload page success"); 
    res.render('index',{listData:listData});
}
exports.createNewUser = async (req,res)=>{
    const idUser = await req.body.idUser;
    let nameUser = "", statusUser = "";
    if(!idUser){
        res.send(`
            <script>
                <div class="alert alert-primary" role="alert">
                    Please Enter ID
                </div>
            </script>
        `);
        return;
    }
    let tiktokLiveConnection = new WebcastPushConnection('@'+idUser,{
        processInitialData: false,
        enableExtendedGiftInfo: true,
        enableWebsocketUpgrade: true,
        requestPollingIntervalMs: 2000,
        clientParams: {
            "app_language": "en-US",
            "device_platform": "web"
        },
        requestHeaders: {
            "headerName": "headerValue"
        },
        websocketHeaders: {
            "headerName": "headerValue"
        },
        requestOptions: {
            timeout: 10000
        },
        websocketOptions: {
            timeout: 10000
        }
    });
    // Connect to the chat (await can be used as well)
    await tiktokLiveConnection.connect().then(state => {
        statusUser = "Đang Live";
    }).catch(err => {
        statusUser= "Offline";
    });
    await tiktokLiveConnection.getRoomInfo().then(roomInfo => {
        nameUser =  roomInfo.owner.nickname;
    }).catch(err => {
        nameUser = "";
    }); 
    let dataUser = {
        id: idUser,
        name: nameUser,
        status: statusUser
    };
    listData.push(dataUser);
    writeFile("Add user id :"+idUser+" sucess !");
    res.redirect('/');
}
exports.deleteUser = async (req,res) =>{
    const idUser = await req.query.id;
    if(idUser){
        listData = listData.filter(data => data.id != idUser);
        writeFile("Delete user id :"+idUser+" sucess !");        
        res.redirect('/');
    }else{
        res.send(`
            <script>
                <div class="alert alert-primary" role="alert">
                    Error
                </div>
            </script>
        `);
        return;
    }
}

async function isLive(id){
    let tiktokLiveConnection = new WebcastPushConnection('@'+id,{
        processInitialData: false,
        enableExtendedGiftInfo: true,
        enableWebsocketUpgrade: true,
        requestPollingIntervalMs: 2000,
        clientParams: {
            "app_language": "en-US",
            "device_platform": "web"
        },
        requestHeaders: {
            "headerName": "headerValue"
        },
        websocketHeaders: {
            "headerName": "headerValue"
        },
        requestOptions: {
            timeout: 10000
        },
        websocketOptions: {
            timeout: 10000
        }
    });
    // Connect to the chat (await can be used as well)
    await tiktokLiveConnection.connect().then(state => {
        return true;
    }).catch(err => {
        return false;
    });
}
async function writeFile(mess){
    let pathJson = await path.resolve(__dirname, 'data.json');
    fs.writeFile(pathJson, JSON.stringify(listData),(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log(mess);
        }
    });    
    
}