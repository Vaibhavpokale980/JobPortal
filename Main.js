require("dotenv").config(); // Load environment variables first


const express = require("express");
const con = require("./dist/connection");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
const { name } = require("ejs");
const { promises } = require("nodemailer/lib/xoauth2");
const mongoose = require('mongoose');


const user = require('./models/user');
// console.log(user + "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
const adminlogin = require('./models/adminlogin');
const adver = require('./models/adver');
const course = require('./models/course');
const courselist = require('./models/course_list');
const employee = require('./models/employee');
const job = require('./models/job');
const joblist = require('./models/job_list');
const login = require('./models/login');

const app = express();
const port = process.env.PORT || 8000;



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true })); //--

// console.log(process.env.PORT,"mich"); // Outputs 3000


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get("/signup-page-user", (req, res) => {
  res.sendfile(__dirname + "/dist/signuppage-user.html");
});

app.get("/login-page-user", (req, res) => {
  res.sendfile(__dirname + "/dist/loginpage-user.html");
});

app.get("/signup-page", (req, res) => {
  res.sendfile(__dirname + "/dist/signuppage.html");
});

app.get("/login-page", (req, res) => {
  res.sendfile(__dirname + "/dist/loginpage.html", "text/html");
});

app.get("/show_job", async (req, res) => {
  try {
    // Fetch jobs from the MongoDB collection
    const result = await job.find(); // Assuming Job is your Mongoose model for the job collection
    // console.log(result + " this is result12");

    // Render the jobs on the show_jobs page
    res.render(__dirname + "/dist/show_jobs", {
      list: result,
      check: 1,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving jobs");
  }
});


app.get("/", async (req, res) => {
  try {
    const results = await job.find(); // Fetch all job listings from MongoDB
    // console.log(results + " this is result12"); // Log the results for debugging

    res.render(__dirname + "/dist/show_job_user", {
      list: results,
      check: 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error"); // Handle errors gracefully
  }
});


app.get("/show_job_after_login", async (req, res) => {
  try {
    // Fetch jobs from the MongoDB collection
    const result = await job.find(); // Assuming Job is your Mongoose model for the job collection
    // console.log(result + " this is result12");

    // Render the jobs on the show_job_after_login page
    res.render(__dirname + "/dist/show_job_after_login", {
      list: result,
      check: 1,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving jobs");
  }
});


app.get("/get-list", async (req, res) => {
  try {
    const adminLogins = await adminlogin.find();
    let id = adminLogins[adminLogins.length - 1].id.toString();

    const jobs = await job.find({ empid: id });


    console.log("hellllolllllllllllllllllllllllllllllllllllllll", id)
    if (jobs.length > 0) {
      // console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", jobs);
      res.render(__dirname + "/dist/show_list", { list: jobs });
    } else {
      res.send("You haven't posted any job");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving job list");
  }
});

app.get("/get-course-list", async (req, res) => {
  try {
    const adminLogins = await adminlogin.find();
    let id = adminLogins[adminLogins.length - 1].id;

    const courses = await course.find({ userid: id });
    if (courses.length > 0) {
      // console.log(courses, "vaibhav")
      res.render(__dirname + "/dist/show_courses1", { list: courses, id });
    } else {
      res.send("You haven't posted any Course");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving course list");
  }
});

let emp_id1;

app.post("/add-sign-data", async (req, res) => {
  const { username, email, password, contact } = req.body;

  try {
    console.log("updating details");

    const employee1 = new employee({
      username,
      email,
      password,
      contactnumber: contact
    });

    // console.log("1 :: mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm " + 'Helooooooooooooooooooooooooooooo');
    const savedEmployee = await employee1.save();
    // console.log("1 :: mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm " + 'Helooooooooooooooooooooooooooooo');

    emp_id1 = savedEmployee._id;
    // console.log("1 :: mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm " + 'Helooooooooooooooooooooooooooooo');


    const adminLogin1 = new adminlogin({ id: emp_id1 });
    await adminLogin1.save();

    res.redirect("/show_job");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding employee");
  }
});

app.post("/add-sign-data-user", async (req, res) => {
  const { username, email, password, contact } = req.body;

  try {
    console.log("updating details");

    let user1 = new user({
      username,
      email,
      password,
      contactnumber: contact
    });

    let use1 = await user.findOne({ email: email });

    if (use1) {
      console.log(use1.email, email);
      res.redirect("/");
      return false;
    }
    else {

      const savedUser = await user1.save();
      emp_id1 = savedUser._id;

      const login1 = new login({ id: emp_id1 });
      await login1.save();

      console.log("1 :: " + emp_id1);
      res.redirect("/show_job_after_login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user");
  }
});


app.post("/check-login-data", async (req, res) => {
  let name = req.body.username;
  let pass = req.body.password;

  try {
    const employee1 = await employee.findOne({ email: name, password: pass });

    console.log(name, pass, employee1);

    if (employee1) {
      emp_id1 = employee1._id.toString(); // Use _id

      const adminlogin1 = new adminlogin({ id: emp_id1 });
      await adminlogin1.save();

      res.redirect("/show_job");
    } else {
      res.redirect("/signup-page");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking login data");
  }
});

app.post("/check-login-data-user", async (req, res) => {
  let name = req.body.username;
  let pass = req.body.password;

  try {
    const user1 = await user.findOne({ email: name, password: pass });

    if (user1) {
      emp_id1 = user1._id.toString(); // Use _id

      const login1 = new login({ id: emp_id1 });
      await login1.save();

      res.redirect("/show_job_after_login");
    } else {
      res.redirect("/signup-page-user");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error checking user login data");
  }
});

let course_id;

app.get("/successful-buy", async (req, res) => {
  course_id = req.query.id;

  try {
    const course1 = await course.findById({ _id: course_id });
    const logins = await login.find();
    let id11 = logins[logins.length - 1].id // Use _id

    const courseList1 = await courselist.findOne({ courseid: course_id, userid: id11 });

    if (courseList1) {
      return res.redirect("/Course");
    } else {
      const newCourseList = new courselist({
        coursename: course1.coursename,
        userid: id11,
        courseid: logins[logins.length - 1].id
      });
      // console.log(newCourseList)
      await newCourseList.save();

      const users1 = await user.find({ _id: id11 });
      const user_mail = users1[0].Email;

      // console.log("Mail : " + user_mail + id11);

      // let transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: "vaibhav801046@gmail.com", // Your email address
      //     pass: "rnpw ayat jpem vhfy", // Your email password
      //   },
      // });

      // // Email options
      // let mailOptions = {
      //   from: "vaibhav801046@gmail.com", // Sender address
      //   to: user_mail, // List of recipients
      //   subject: "Thank You for Your Purchase!", // Subject line
      //   text: `Dear ${users1[0].Username},

      //         Thank you for your recent purchase with us! We appreciate your business and hope you are satisfied with your product.

      //         If you have any questions or need further assistance, please don't hesitate to contact us.

      //         Best regards,
      //         Vaibhav`, // Plain text body
      // };

      // // Sending email
      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.log(error);
      //     return res.status(500).send("Email sending failed");
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });

      // Render the course popup
      const allCourses = await course.find();
      res.render(__dirname + "/dist/show_courses_popup", {
        list: allCourses,
        user: "vaibhav",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing purchase");
  }
});

app.get("/course", async (req, res) => {
  try {
    const course1 = await course.findById(course_id);
    res.render(__dirname + "/dist/course", { list: course1 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving course");
  }
});

app.get("/video", async (req, res) => {
  console.log("This is the future : " + course_id);
  try {
    const course1 = await course.findById(course_id);
    res.render(__dirname + "/dist/video", { list: course1 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving video");
  }
});

app.get("/job_descreption", async (req, res) => {
  let id = req.query.id;

  try {
    const job1 = await job.findById(id);
    const advertisements = await adver.find({ jobid: id });
    // console.log("Till now : ", job1, advertisements);
    res.render(__dirname + "/dist/jobdescription", {
      list: job1,
      list1: advertisements,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving job description");
  }
});

app.get("/job_descreption-admin", async (req, res) => {
  let id = req.query.id;

  try {
    const job1 = await job.findById(id);
    const advertisements = await adver.find({ jobid: id });
    // console.log(job1.jobtitle, advertisements, "This is ader")
    res.render(__dirname + "/dist/job_discription-admin", {
      list: job1,
      list1: advertisements,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving job description for admin");
  }
});


// app.get("/signup-page", (req, res) => {
//   res.sendfile(__dirname + "/dist/signuppage.html", "text/html");
// });

app.get("/show-courses", async (req, res) => {
  // res.sendfile(__dirname + "/dist/homepage.html");

  // Connect to MongoDB (no need to connect each time, can be moved to a separate connection function)

  // Fetch courses from MongoDB
  try {
    let result = await course.find();

    // if (err) console.log(err);

    // console.log(result + " this is result");

    res.render(__dirname + "/dist/show_courses", {
      list: result,
      user: "vaibhav",
    });
  } catch (error) {
    console.log(error);
  }

});

app.get("/show-courses-admin", async (req, res) => {
  // res.sendfile(__dirname + "/dist/homepage.html")

  try {
    // Fetch courses from MongoDB
    let result = await course.find();

    // console.log(result + " this is result");

    res.render(__dirname + "/dist/show_courses_admin", {
      list: result,
      user: "vaibhav",
    })

  } catch (error) {
    console.log(error);
  }
});


// app.get("/after-login", (req, res) => {
//   con.connect((err) => {
//     if (err) console.log(err);
//   });

//   let sql = "select *from job";
//   con.query(sql, (err, result) => {
//     if (err) console.log(err);

//     console.log(result + "this is result12");

//     res.render(__dirname + "/dist/show_jobs", {
//       list: result,
//       check: true,
//     });
//   });
// });

app.get("/show-courses", (req, res) => {
  // res.sendfile(__dirname+"/dist/homepage.html")

  Course.find({}, (err, result) => { // Fetch all courses from MongoDB
    if (err) console.log(err);

    // console.log(result + " this is result");

    res.render(__dirname + "/dist/show_courses", {
      list: result,
      user: "vaibhav",
    });
  });
});

app.get("/show-courses-admin", (req, res) => {
  // res.sendfile(__dirname+"/dist/homepage.html")

  Course.find({}, (err, result) => { // Fetch all courses from MongoDB
    if (err) console.log(err);

    // console.log(result + " this is result");

    res.render(__dirname + "/dist/show_courses_admin", {
      list: result,
      user: "vaibhav",
    });
  });
});

app.get("/add-courses", (req, res) => {
  res.sendfile(__dirname + "/dist/addcoursepage.html", "text/html");
});

app.post("/add-data", async (req, res) => {
  let id11;

  const data = await employee.findOne().sort({ _id: -1 });
  id11 = data.id;

  // adminlogin.find({}, (err, result3) => { // Fetch all admins from MongoDB
  // if (err) console.log(err);

  // id11 = result3[result3.length - 1]._id; // Use _id for MongoDB

  const courseData = {
    coursename: req.body.name,
    teacher: req.body.teacher,
    info: req.body.info,
    date: req.body.date,
    type: req.body.type,
    duration: req.body.duration,
    img: req.body.img,
    url: req.body.videourl,
    userid: id11, // Using _id
  };

  // console.log(courseData, id11, employee);
  try {
    // Create a new instance of YourModel using 'new'
    const course1 = new course(courseData);

    // Save the document to the database
    await course1.save();

    // console.log('Inserted document:', course1);
    res.redirect("/show-courses");

  } catch (error) {
    console.error('Error inserting document:', error);
  }

  // course.create(courseData, (err) => { // Insert course into MongoDB
  //   if (err) console.log(err);
  //   res.redirect("/show-courses");
  // });
});
// });


app.get("/update-job", async (req, res) => {
  let jobid = req.query.id;

  try {
    // Find job and associated adver data from MongoDB
    const job1 = await job.findOne({ _id: jobid }).lean();
    const adver1 = await adver.findOne({ jobid: jobid }).lean();

    if (job1 && adver1) {
      res.render(__dirname + `/dist/update_job`, {
        id: jobid,
        list: [{
          job_title: job1.jobtitle,
          company: job1.company,
          vacancy: job1.vacancy,
          image: job1.image,
          location: job1.location,
          last_date: job1.lastdate,
          experi: adver1.experi,
          descri: adver1.descri,
          salary: adver1.salary,
          additional: adver1.additional
        }],
      });
    } else {
      console.log("Job or Adver not found");
      res.redirect("/show_job"); // Redirect if job not found
    }
  } catch (err) {
    console.log(err);
    res.redirect("/show_job");
  }
});

app.post("/update-job-data", async (req, res) => {
  let job_id = req.query.id;

  const {
    title,
    company,
    vacancy,
    image,
    location,
    lastdate,
    descre,
    experi,
    salary,
    additional,
  } = req.body;

  try {
    // Update job data in MongoDB
    await job.updateOne({ _id: job_id }, {
      jobtitle: title,
      company,
      vacancy,
      image,
      location,
      lastdate: lastdate
    });

    // console.log("Job table updated", job_id,);

    // Update adver data in MongoDB
    await adver.updateOne({ jobid: job_id }, {
      experi,
      descri: descre,
      salary,
      additional
    });

    console.log("Adver table updated");

    res.redirect("/show_job"); // Redirect to home page after updating
  } catch (err) {
    console.log(err);
    // res.redirect("/show_job");
  }
});

app.get("/get-list-user", async (req, res) => {
  let id = req.query.id;

  try {
    const result = await joblist.find({ jobid: id }).lean(); // Fetch job list

    if (result.length > 0) {
      const finalarr = await Promise.all(result.map(async (job) => {
        const user1 = await user.findOne({ _id: job.userid }).lean(); // Fetch user details

        return [
          job.resume, // resume
          job._id, // id
          user1 ? user1.username : 'N/A', // username
          user1 ? user1.email : 'N/A', // email
          user1 ? user1.contactnumber : 'N/A' // contact
        ];
      }));

      res.render(__dirname + "/dist/get_llist", { arr: finalarr, id });
    }
    else {
      res.render(__dirname + "/dist/get_llist", { arr: [], id });
    }
    // {
    //   // res.send()
    // }
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

app.get("/get-list-course", async (req, res) => {
  let id = req.query.id;
  // console.log("Id vaibhav " + id);

  try {
    const result = await courselist.find({ courseid: id }).lean(); // Fetch course list
    const finalarr = [];
    // console.log(result, "course11")

    for (const course of result) {
      const user1 = await user.findOne({ _id: course.userid }).lean(); // Fetch user details
      const user2 = await user.find().lean(); // Fetch user details
      // console.log(user1, course.userid, user2, "hellllloo")

      if (user1) {
        finalarr.push([course.id, user1.username, user1.email]); // Store course details
      }
    }

    res.render(__dirname + "/dist/get_list_course", { arr: finalarr, id });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

app.get("/delete-job", async (req, res) => {
  let id = req.query.id;

  try {
    await job.deleteOne({ _id: id }); // Delete job from MongoDB
    res.redirect("/show_job");
  } catch (err) {
    console.log(err);
    res.redirect("/show_job");
  }
});


// Delete Course
app.get("/delete-course", async (req, res) => {
  try {
    const id = req.query.id;
    await course.deleteOne({ _id: id }); // Assuming ID is unique
    res.redirect("/show_job");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Show File
app.get("/show-file", async (req, res) => {
  const id = req.query.id;

  try {
    const job = await joblist.findById({ _id: id }); // Populate user data
    if (job) {
      const resume = job.resume;
      res.render(__dirname + "/dist/template", { resume });
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add Job
app.get("/add-job", (req, res) => {
  res.sendFile(__dirname + "/dist/input-job.html", { "Content-Type": "text/html" });
});

// Apply Job
app.post("/apply-job", async (req, res) => {
  try {
    const resume = req.body.resume;
    const jobId = req.query.id;

    // Assume you retrieve the logged-in user ID from your session or token
    const lastJob = await login.findOne().sort({ _id: -1 })
    const userid = lastJob.id.toString(); // Replace this with your method to get the current user's ID

    const existingApplication = await joblist.findOne({ userid, jobid: jobId });
    // console.log(existingApplication)

    if (!existingApplication) {
      const newJobApplication = new joblist({ userid, jobid: jobId, resume });
      await newJobApplication.save();

      const user11 = await user.findOne({ _id: userid });
      const userMail = user11.email;

      // Send Email Logic...
      res.redirect("/congrates1");
    } else {
      const user1 = await user.findOne({ _id: userid });
      const user2 = await user.find();
      // console.log(user1, "user1", userid, user2)
      const userMail = user1.email;

      // Send Already Applied Email Logic...
      res.redirect("/sorrypage");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/congrates1", (req, res) => {
  res.sendfile(__dirname + "/dist/congrates1.html", "text/html");
});

app.get("/sorrypage", (req, res) => {
  res.sendfile(__dirname + "/dist/sorrypage.html", "text/html");
});

app.post("/add-job-data", async (req, res) => {
  try {
    // Find the most recent admin (employee) based on creation date
    const latestAdmin = await employee.findOne().sort({ createdAt: -1 });
    const emp_id = latestAdmin._id; // Assuming you need the _id field

    // Log the employee ID
    // console.log("Latest admin ID:", emp_id);

    // Create a new job entry
    const newJob = new job({
      jobtitle: req.body.title,
      company: req.body.company,
      vacancy: req.body.vacancy,
      image: req.body.image,
      location: req.body.location,
      empid: emp_id,
      userid: emp_id,  // Double-check if both empid and userid should be the same
      lastdate: req.body.lastdate,
    });

    // Log the new job details before saving
    // console.log("New job details:", newJob);
    const existingJob = await job.findOne({ jobtitle: req.body.title, empid: emp_id });
    if (existingJob) {
      // console.log("aheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    }


    // Save the new job entry
    await newJob.save();
    // console.log("Saved new job with ID:", newJob._id);

    // Create a new advertisement entry associated with the job
    const newAd = new adver({
      jobid: newJob._id,
      experi: req.body.experi,
      descri: req.body.descre,  // Ensure 'descre' is the correct field
      salary: req.body.salary,
      additional: req.body.additional,
    });

    // Save the advertisement entry
    await newAd.save();

    // Redirect to the job listing page
    res.redirect("/show_job");
  } catch (err) {
    // Log the error and send a 500 status code
    console.error("Error adding job data:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/search-data", async (req, res) => {
  const search = req.body.searchtext;

  try {
    const results = await course.find({ coursename: new RegExp(search, 'i') }); // Case-insensitive search
    res.render(__dirname + "/dist/show_courses", { list: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/search-data1", async (req, res) => {
  let id = req.query.id;
  let search = req.body.searchtext;
  try {
    const results = await course.find({ coursename: new RegExp(search, 'i') });
    // let sql = select * from course where course_name like '%${search}%' and userId = ${ id };

    // con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/show_courses1", { list: results, id });
    // });
  } catch (error) {
    console.log(error);
  }
});

app.post("/search-job-data-before", async (req, res) => {
  const search = req.body.searchtext;

  try {
    const results = await job.find({ jobtitle: new RegExp(search, 'i') });
    res.render(__dirname + "/dist/show_job_user", { list: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/search-job-data-admin", async (req, res) => {
  const search = req.body.searchtext;

  try {
    const results = await job.find({ jobtitle: new RegExp(search, 'i') });
    res.render(__dirname + "/dist/show_jobs", { list: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/search-job-data", async (req, res) => {
  const search = req.body.searchtext;

  try {
    const results = await job.find({ jobtitle: new RegExp(search, 'i') });
    res.render(__dirname + "/dist/show_job_after_login", { list: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/search-job-data-before", async (req, res) => {
  const search = req.body.searchtext;

  try {
    const results = await job.find({ jobtitle: new RegExp(search, 'i') }); // Case-insensitive search
    res.render(__dirname + "/dist/show_job_user", { list: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/search-job-data-admin", async (req, res) => {
  const search = req.body.searchtext;

  try {
    const results = await job.find({ jobtitle: new RegExp(search, 'i') }); // Case-insensitive search
    res.render(__dirname + "/dist/show_jobs", { list: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/search-job-data", async (req, res) => {
  const search = req.body.searchtext;

  try {
    const results = await job.find({ jobtitle: new RegExp(search, 'i') }); // Case-insensitive search
    res.render(__dirname + "/dist/show_job_after_login", { list: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port);
