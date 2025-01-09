const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../model/fileModel');
const { v4 : uuid4 } = require('uuid');
const { error } = require('console');


let storage = multer.diskStorage({
          destination: (req, file, cb) => cb(null, 'uploads/'),
          filename: (req, file, cb)=>{
                    const uniqueName = `${Date.now()}-${Math.round(Math.random()+ 1E9)}${path.extname(file.originalname)}`;
                    cb(null, uniqueName);
          }
})


let upload = multer({
          storage,
          limit : { fileSize: 1000000 * 100}
}).single('myfile');



router.post('/', (req, res)=>{
          // Store Files

            upload(req, res, async(err)=>{
              
              // Validate request

              if(!req.file){
                return res.json({error : "All fields are required"});
}

              if(err){
                    return res.status(500).send({error: err.message});
              }

              // Store into DB
              const file = new File({
                    filename: req.file.filename,
                    uuid: uuid4(),
                    path: req.file.path,
                    size: req.file.size
                  });
                  const response = await file.save();
                  return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
            });

});


router.post('/send', async(req, res)=>{
  const {uuid, emailTo, emailFrom} = req.body;

  // Validate Request
  if(!uuid || !emailTo || !emailFrom){
      return res.status(422).send({error : "All fields are required"})
      
  }


  // Get data from database
  const file = await File.findOne({ uuid : uuid });
  if(file.sender){
        return res.status(422).send({error : "Email Already Sent!!!"});  
  }

  file.sender = emailFrom;
  file.reciever = emailTo;

  const response = await file.save();


  // Send email 

  const sendMail = require('../Services/emailService');

  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: 'WeShare File Sharing',
    text: `${emailFrom} shared a file with you.`,
    html: require('../Services/emailTemplate')({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size/1000) + ' KB',
      expires: '24 Hours'
    })
  });

  return res.send({success: 'true'});



})


module.exports = router;
