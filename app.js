const express=require("express");
const app=express();
const request=require("request");
const bodyParser=require("body-parser");
const https=require("https");
app.use(bodyParser.urlencoded({extended:true}));

/*to access static files*/
app.use(express.static("public"));
app.get("/",function(req,res)
{
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res)
{
  const fname=req.body.fname;
  const lname=req.body.lname;
  const email=req.body.email;

  const data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:fname,
          LNAME:lname
        }

      }
    ]
  }
  const jsonData=JSON.stringify(data);
  const url="https://usX.api.mailchimp.com/3.0/lists/yourListId";
  const options={
    method:"POST",
    auth:"anyname:your api key"
  }
  const request=https.request(url,options,function(response)
{
  if(response.statusCode==200)
  {
    res.sendFile(__dirname+"/success.html");
  }
  else {
    {
      res.sendFile(__dirname+"/failure.html");
    }
  }
  response.on("data",function(data)
{
  console.log(JSON.parse(data));
});

});
request.write(jsonData);
request.end();
});

//to redirect to home page on Failure
app.post("/failure",function(req,res)
{
  res.redirect("/");
});


app.listen(process.env.PORT || 7000,function()
{
  console.log("server started on port 7000");
});
//heroku : https://dry-crag-21132.herokuapp.com/
