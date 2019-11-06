// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!22'),
//     };
//     return response;
// };

console.log('function starts');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});

exports.handler = function(event, context, callback){
    //console.log('processing event: %j', event);

    let scanningParameters = {
        TableName: 'TABLE_NAME',
        Limit: 100 //maximum result of 100 items
    };

    //In dynamoDB scan looks through your entire table and fetches all data
    docClient.scan(scanningParameters, function(err,data){
        if(err){
            callback(err, null);
        }else{
            // for(var i=0; i<3; i++) { 
            //     console.log(data.Items[i]);
            // }
            
            for(var i=0; i<data.Items.lenght; i++) {
              var newItem = data.Items[i];
              var oldPass = newItem.Password;
              console.log("...OldPass:" + oldPass);
              var newPass = oldPass.toString();
              for(var j=newPass.length; j<4; j++) {   newPass = "0" + newPass;  }
              console.log("...NewPass:" + newPass);
              newItem.Password = newPass

              let params =  {
                    Item: newItem,
                    TableName: 'TABLE_NAME'
                };
            
                docClient.put(params, function(err,data){
                    if(err) {
                        callback(err, null)
                    }else{
                        callback(null, data)
                    }
                });
            } 
            
            

        }
    });
}
