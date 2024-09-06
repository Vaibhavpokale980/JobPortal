const express = require("express");
const con = require("./dist/connection");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
const { name } = require("ejs");
const { promises } = require("nodemailer/lib/xoauth2");

const app = express();
const port = 3001;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true })); //--

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

app.get("/show_job", (req, res) => {
  con.connect((err) => {
    if (err) console.log(err);
  });

  let sql = "select *from job";
  con.query(sql, (err, result) => {
    if (err) console.log(err);

    console.log(result + "this is result12");

    res.render(__dirname + "/dist/show_jobs", {
      list: result,
      check: 1,
    });
  });
});

app.get("/", (req, res) => {
  con.connect((err) => {
    if (err) console.log(err);
  });

  let sql = "select *from job";
  con.query(sql, (err, result) => {
    if (err) console.log(err);

    console.log(result + "this is result12");

    res.render(__dirname + "/dist/show_job_user", {
      list: result,
      check: 1,
    });
  });
});

app.get("/show_job_after_login", (req, res) => {
  con.connect((err) => {
    if (err) console.log(err);
  });

  let sql = "select *from job";
  con.query(sql, (err, result) => {
    if (err) console.log(err);

    console.log(result + "this is result12");

    res.render(__dirname + "/dist/show_job_after_login", {
      list: result,
      check: 1,
    });
  });
});

app.get("/get-list", (req, res) => {
  let sql = `select *from admin_login`;

  con.query(sql, (err, result1) => {
    let id = result1[result1.length - 1].id;

    let sql1 = `select *from job where emp_id=${id}`;
    con.query(sql1, (err, result) => {
      if (result.length > 0) {
        console.log(result.length);
        res.render(__dirname + "/dist/show_list", { list: result });
      } else res.send("You haven't posted any job");
    });
  });
});

app.get("/get-course-list", (req, res) => {
  let sql = `select *from admin_login`;

  con.query(sql, (err, result1) => {
    let id = result1[result1.length - 1].id;

    let sql1 = `select *from course where userId=${id}`;

    con.query(sql1, (err, result) => {
      if (result.length > 0) {
        res.render(__dirname + "/dist/show_courses1", { list: result, id });
      } else res.send("You haven't posted any Course");
    });
  });
});

let emp_id1;

app.post("/add-sign-data", (req, res) => {
  //--
  var user = req.body.username; //this username is the name in the html input
  var email = req.body.email;
  var password = req.body.password;
  var mno = req.body.contact;

  con.connect((err, res) => {
    if (err) console.log(err);
  });

  console.log("updating details");

  con.query(
    `insert Employee  (username,email,password,contactnumber) values("${user}","${email}","${password}","${mno}")`,
    (err, result) => {
      if (err) throw err;

      let sql1 = `select *from employee`;

      con.query(sql1, (err, result1) => {
        emp_id1 = result1[result1.length - 1].emp_id;
        let sql2 = `insert admin_login (id) values(${emp_id1})`;
        con.query(sql2, (err, result1) => {
          if (err) console.log(err);
          console.log("1 :: " + emp_id1);
          res.redirect("/show_job");
        });
      });
    }
  );
});

app.post("/add-sign-data-user", (req, res) => {
  //--
  var user = req.body.username; //this username is the name in the html input
  var email = req.body.email;
  var password = req.body.password;
  var mno = req.body.contact;

  con.connect((err, res) => {
    if (err) console.log(err);
  });

  console.log("updating details");

  con.query(
    `insert users  (username,email,password,contactnumber) values("${user}","${email}","${password}","${mno}")`,
    (err, result) => {
      if (err) throw err;

      let sql1 = `select *from users`;

      con.query(sql1, (err, result1) => {
        emp_id1 = result1[result1.length - 1].UserID;
        let sql2 = `insert login (id) values(${emp_id1})`;
        con.query(sql2, (err, result1) => {
          if (err) console.log(err);
          console.log("1 :: " + emp_id1);
          res.redirect("/show_job_after_login");
        });
      });
    }
  );
});

app.post("/check-login-data", (req, res) => {
  let name = req.body.username;
  let pass = req.body.password;

  let sql = `select *from employee where username="${name}" and password="${pass}"`;

  con.query(sql, (err, result) => {
    if (err) console.log(err);

    if (result.length > 0) {
      emp_id1 = result[0].emp_id;

      let sql2 = `insert admin_login (id) values(${emp_id1})`;

      con.query(sql2, (err, result1) => {
        res.redirect("/show_job");
      });
    } else res.redirect("/signup-page");
  });
});

app.post("/check-login-data-user", (req, res) => {
  let name = req.body.username;
  let pass = req.body.password;

  let sql = `select *from users where username="${name}" and password="${pass}"`;

  con.query(sql, (err, result) => {
    if (err) console.log(err);

    if (result.length > 0) {
      emp_id1 = result[0].UserID;

      let sql2 = `insert login (id) values(${emp_id1})`;

      con.query(sql2, (err, result1) => {
        res.redirect("/show_job_after_login");
      });
    } else res.redirect("/signup-page-user");
  });
});

let idmain;
let course_id;

app.get("/successful-buy", (req, res) => {
  course_id = req.query.id;

  let sql = `select *from course where id=${course_id}`;
  let id11;

  con.query(sql, (req, result1) => {
    let sql1 = `select *from login`;
    con.query(sql1, (err, result3) => {
      id11 = result3[result3.length - 1].id;
      let sql3 = `select *from course_list where courseid=${course_id} and userId=${id11}`;

      con.query(sql3, (err, result3) => {
        if (err) console.log(err);
        if (result3.length > 0) {
          res.redirect("/Course");
        } else {
          let sql2 = `insert course_list (course_name,userId,courseid) values("${result1[0].course_name}",${id11},${course_id});`;
          con.query(sql2, (err, result2) => {
            if (err) console.log(err);

            let sql = "select *from course";
            con.query(sql, (err, result) => {
              if (err) console.log(err);

              //auto mail on successful buy//
              let sql123 = `select *from Users where UserID=${id11}`;

              con.query(sql123, (err, result123) => {
                let user_mail = result123[0].Email;
                console.log("Mail : " + user_mail + id11);
                let transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "vaibhav801046@gmail.com", // Your email address
                    pass: "rnpw ayat jpem vhfy", // Your email password
                  },
                });

                // Email options
                let mailOptions = {
                  from: "vaibhav801046@gmail.com", // Sender address
                  to: user_mail, // List of recipients
                  subject: "Thank You for Your Purchase!", // Subject line
                  text: `Dear ${result123[0].Username},
                
                Thank you for your recent purchase with us! We appreciate your business and hope you are satisfied with your product.
                
                If you have any questions or need further assistance, please don't hesitate to contact us.
                
                Best regards,
                Vaibhav`, // Plain text body
                };

                // Sending email
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log(error);
                    res.status(500).send("Email sending failed");
                  } else {
                    console.log("Email sent: " + info.response);
                    res.status(200).send("Email sent successfully");
                  }
                });

                // ------------------------------
              });

              res.render(__dirname + "/dist/show_courses_popup", {
                list: result,
                user: "vaibhav",
              });
            });

            // res.sendfile(__dirname + "/dist/congrates.html", "text/html");
          });
        }
      });
    });
  });
});

app.get("/course", (req, res) => {
  // res.send(req.query.id);

  con.connect((err) => {
    if (err) console.log(err);
  });

  idmain = req.query.id;
  let sql = `select *from course where id=${course_id}`;
  con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/course", { list: result });
  });
});

app.get("/video", (req, res) => {
  console.log("This is the future : " + course_id);
  let sql = `select *from course where id=${course_id}`;

  con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/video", { list: result });
  });
});

app.get("/job_descreption", (req, res) => {
  let id = req.query.id;
  let sql = `select *from job where job_id=${id}`;
  let sql1 = `select *from adver where job_id=${id}`;

  con.query(sql, (err, result) => {
    con.query(sql1, (err, result1) => {
      console.log("This is vaibhav : " + result1);
      res.render(__dirname + "/dist/jobdescription", {
        list: result,
        list1: result1,
      });
    });
  });
});

app.get("/job_description-admin", (req, res) => {
  let id = req.query.id;
  let sql = `select *from job where job_id=${id}`;
  let sql1 = `select *from adver where job_id=${id}`;

  con.query(sql, (err, result) => {
    con.query(sql1, (err, result1) => {
      console.log("This is vaibhav : " + result1);
      res.render(__dirname + "/dist/job_discription-admin", {
        list: result,
        list1: result1,
      });
    });
  });
});

// app.get("/signup-page", (req, res) => {
//   res.sendfile(__dirname + "/dist/signuppage.html", "text/html");
// });

app.get("/show-courses", (req, res) => {
  // res.sendfile(__dirname+"/dist/homepage.html")

  con.connect((err) => {
    if (err) console.log(err);
  });

  let sql = "select *from course";
  con.query(sql, (err, result) => {
    if (err) console.log(err);

    console.log(result + "this is result");

    res.render(__dirname + "/dist/show_courses", {
      list: result,
      user: "vaibhav",
    });
  });
});

app.get("/show-courses-admin", (req, res) => {
  // res.sendfile(__dirname+"/dist/homepage.html")

  con.connect((err) => {
    if (err) console.log(err);
  });

  let sql = "select *from course";
  con.query(sql, (err, result) => {
    if (err) console.log(err);

    console.log(result + "this is result");

    res.render(__dirname + "/dist/show_courses_admin", {
      list: result,
      user: "vaibhav",
    });
  });
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

app.get("/add-courses", (req, res) => {
  res.sendfile(__dirname + "/dist/addcoursepage.html", "text/html");
});

app.post("/add-data", (req, res) => {
  con.connect((err) => {
    if (err) console.log(err);
  });

  let id11;
  let sql1 = `select *from admin_login`;
  con.query(sql1, (err, result3) => {
    id11 = result3[result3.length - 1].id;
    let sql = `insert course (course_name,teacher,info,date,type,duration,img,url,userId) values("${req.body.name}","${req.body.teacher}","${req.body.info}","${req.body.date}","${req.body.type}","${req.body.duration}","${req.body.img}","${req.body.videourl}",${id11});`;
    con.query(sql, (err, result) => {
      if (err) console.log(err);
      res.redirect("/show-courses");
    });
  });
});

app.get("/update-job", (req, res) => {
  let jobid = req.query.id;
  let sql = `create or replace view v2 as select job.job_title,job.company,job.vacancy,job.image,job.location,job.last_date,adver.experi,adver.descri,adver.salary,adver.additional from job,adver where job.job_id=${jobid} and adver.job_id=${jobid}`;

  con.query(sql, (err, result) => {
    if (err) console.log(err);
    let sql1 = `select *from v2`;
    con.query(sql1, (err, result2) => {
      if (err) console.log(err);
      // console.log(result2);
      res.render(__dirname + `/dist/update_job`, {
        id: jobid,
        list: result2,
      });
    });
  });
});

app.post("/update-job-data", (req, res) => {
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

  const jobUpdateQuery = `UPDATE job SET company=?, vacancy=?, image=?, location=?,last_date=? WHERE job_id=?`;
  const jobParams = [company, vacancy, image, location,lastdate, job_id];

  con.query(jobUpdateQuery, jobParams, (err, result) => {
    if (err) console.log(err);
    console.log("Job table updated");
  });

  const adverUpdateQuery = `UPDATE adver SET experi=?, descri=?, salary=?, additional=? WHERE job_id=?`;
  const adverParams = [experi, descre, salary, additional, job_id];

  con.query(adverUpdateQuery, adverParams, (err, result) => {
    // if (err) console.log(err);
    console.log("Adver table updated");
  });

  // let sql2 = `delimeter // 
  // CREATE or replace TRIGGER backup_job_adver_data AFTER UPDATE ON job
  // FOR EACH ROW
  // BEGIN
  //     INSERT INTO job_backup (job_id, job_title, company, vacancy, image, Location, emp_id, userId, last_date, experi, descri, salary, additional)
  //     SELECT j.job_id, j.job_title, j.company, j.vacancy, j.image, j.Location, j.emp_id, j.userId, j.last_date, a.experi, a.descri, a.salary, a.additional
  //     FROM job AS j
  //     JOIN adver AS a 
  //     ON j.job_id = a.job_id;
  // END; //`;

  // con.query(sql2, (err, result) => {
  //   if (err) console.log(err);
  //   console.log("Trigger created");

  //   res.redirect("/show_job"); // Redirect to home page after updating
  // });

  res.redirect("/show_job"); // Redirect to home page after updating
});

app.get("/get-list-user", async (req, res) => {
  let id = req.query.id;
  let sql = `SELECT * FROM job_list WHERE job_id=${id}`;
  let finalarr = [];

  const result = await new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  }).catch((err) => {
    console.log(err);
    res.send("Error occurred");
  });

  // console.log("Id :: "+id);

  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      let arr = [];
      let re = result[i].resume;
      arr.push(re);
      // let sql1 = `SELECT * FROM Users WHERE UserID=${result[i].userId}`;

      let sql2 = `CREATE OR REPLACE VIEW v1 AS SELECT username, email, ContactNumber FROM users WHERE UserID=${result[i].userId}`;
      let result2 = await new Promise((resolve, reject) => {
        con.query(sql2, (err, result2) => {
          if (err) console.log(err);
          resolve(result2);
        });
      }).catch((err) => {
        console.log(err);
        res.send("Error occurred");
      });

      let sql1 = `select *from v1`;
      const result1 = await new Promise((resolve, reject) => {
        con.query(sql1, (err, result1) => {
          if (err) reject(err);
          resolve(result1);
        });
      }).catch((err) => {
        console.log(err);
        res.send("Error occurred");
      });

      // console.log(result1);

      if (result1.length == 0) res.send("No One");

      let id1 = result[i].id;
      let name = result1[0].username;
      let email = result1[0].email;
      let contact = result1[0].ContactNumber;

      console.log("id1 :: " + id1);
      arr.push(id1);
      arr.push(name);
      arr.push(email);
      arr.push(contact);

      console.log("Email :: " + email);
      finalarr.push(arr);
    }
    res.render(__dirname + "/dist/get_llist", { arr: finalarr, id });
  } else {
    res.render(__dirname + "/dist/get_llist", { arr: finalarr, id });
  }
});

app.get("/get-list-course", async (req, res) => {
  let id = req.query.id;
  console.log("Id vaibhav " + id);
  let sql = `SELECT * FROM course_list WHERE courseid=${id}`;
  let finalarr = [];

  const result = await new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  }).catch((err) => {
    console.log(err);
    res.send("Error occurred");
  });

  // console.log("Id :: "+id)

  // if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      let arr = [];
      // let sql1 = `SELECT * FROM Users WHERE UserID=${result[i].userId}`;

      let sql2 = `CREATE or replace VIEW v1 AS SELECT Username, Email FROM users WHERE UserID=${result[i].userId}`;

      let result2 = await new Promise((resolve, reject) => {
        con.query(sql2, (err, result2) => {
          if (err) console.log(err);
          resolve(result2);
        });
      }).catch((err) => {
        console.log(err);
        res.send("Error occurred");
      });

      let sql1 = `select *from v1`;

      const result1 = await new Promise((resolve, reject) => {
        con.query(sql1, (err, result1) => {
          if (err) reject(err);
          resolve(result1);
        });
      }).catch((err) => {
        console.log(err);
        res.send("Error occurred");
      });

      if (result1.length == 0) res.render(__dirname + "/dist/get_list_course", { arr: {}, id });
      else {
      let id1 = result[i].id;
      let name = result1[0].Username;
      let email = result1[0].Email;
      console.log("id1 :: " + id1);
      arr.push(id1);
      arr.push(name);
      arr.push(email);
      // console.log("Email :: " + result1);
      finalarr.push(arr);
      }
    }
    res.render(__dirname + "/dist/get_list_course", { arr: finalarr, id });
  // } else {
  //   res.send("Not Found!!");
  // }
});

app.get("/delete-job", (req, res) => {
  let id = req.query.id;
  let sql = `delete from job where job_id=${id}`;
  con.query(sql, (err, result) => {
    if (err) console.log(err);
    res.redirect("/show_job");
  });
});

app.get("/delete-course", (req, res) => {
  let id = req.query.id;
  let sql = `delete from course where ID=${id}`;
  con.query(sql, (err, result) => {
    if (err) console.log(err);
    res.redirect("/show_job");
  });
});

// app.get("/show-file", async (req, res) => {
//   const id = req.query.id;

//   try {
//     // Connect to the database

//     // Query to retrieve the binary data
//     let sql = `SELECT resume FROM job_list WHERE id = ${id}`;

//     con.query(sql, (err, result) => {
//       if (result.length > 0) {
//         // Get the binary data from the first row
//         const resumeBinary = result[0].resume;

//         // Convert binary data to Base64
//         const resumeBase64 = Buffer.from(resumeBinary).toString("base64");

//         // Pass the Base64-encoded data to the EJS template
//         res.render(__dirname + "/dist/template", { resumeBase64 });
//       } else {
//         res.status(404).send("File not found");
//       }
//     });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/show-file", async (req, res) => {
  const id = req.query.id;
  let sql = `SELECT resume FROM job_list WHERE id = ${id}`;

  con.query(sql, (err, result) => {
    if (result.length > 0) {
      const resume = result[0].resume;

      res.render(__dirname + "/dist/template", { resume });
    }
  });
});

app.get("/add-job", (req, res) => {
  res.sendfile(__dirname + "/dist/input-job.html", "text/html");
});

app.post("/apply-job", (req, res) => {
  con.connect((err) => {
    if (err) console.log(err);
  });

  let resume = req.body.resume;
  id1 = req.query.id;

  let id11;
  let sql1 = `select *from login`;
  con.query(sql1, (err, result3) => {
    id11 = result3[result3.length - 1].id;
    console.log("2:::: " + id11);
    let sql2 = `select *from job_list where userId=${id11} and job_id=${id1}`;
    console.log("User Id : " + id11 + " -> jo id : " + id1);
    con.query(sql2, (err, result2) => {
      if (result2.length == 0) {
        // const resumeHex = Buffer.from(resume).toString("hex");
        const sql = `INSERT INTO job_list (userId, job_id, resume) VALUES (${id11}, ${id1}, "${resume}");`;

        con.query(sql, (err, result) => {
          if (err) console.log(err);

          let sql123 = `select *from Users where UserID=${id11}`;

          con.query(sql123, (err, result123) => {
            let user_mail = result123[0].Email;
            console.log("Mail : " + user_mail);

            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "vaibhav801046@gmail.com", // Your email address
                pass: "rnpw ayat jpem vhfy", // Your email password
              },
            });

            // Email options
            let mailOptions = {
              from: "vaibhav801046@gmail.com", // Sender address
              to: user_mail, // List of recipients
              subject: "Congratulations on Your Successful Job Application!", // Subject line
              text: `Dear ${result123[0].Username},
            
            Congratulations on successfully applying for the job opportunity with us! We appreciate the time and effort you put into your application, and we are pleased to inform you that your application has been received and is currently being reviewed by our hiring team.
            
            We understand that applying for a job can be a challenging process, and we want to assure you that we will carefully consider your qualifications and experience. Should your application meet our requirements, we will be in touch to discuss the next steps in the hiring process.
            
            In the meantime, if you have any questions or require further information, please feel free to reach out to us.
            
            Best regards,
            Vaibhav`, // Plain text body
            };

            // Sending email
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                res.status(500).send("Email sending failed");
              } else {
                console.log("Email sent: " + info.response);
                res.status(200).send("Email sent successfully");
              }
            });
          });
          res.redirect("/congrates1");
        });
      } else {
        //auto mail on successful buy//
        let sql123 = `select *from Users where UserID=${id11}`;

        con.query(sql123, (err, result123) => {
          let user_mail = result123[0].Email;
          console.log(
            "Mail : " + user_mail + id11 + " " + result123[0].Username
          );
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "vaibhav801046@gmail.com", // Your email address
              pass: "rnpw ayat jpem vhfy", // Your email password
            },
          });

          // Email options
          let mailOptions = {
            from: "vaibhav801046@gmail.com", // Sender address
            to: user_mail, // List of recipients
            subject: "Notification: Already Applied for This Job", // Subject line
            text: `Dear ${result123[0].Username},
          
          This is to inform you that you have already submitted an application for the job position with us. Our records indicate that you have previously applied for this role.
          
          Please note that each applicant is allowed only one application per job opening. As you have already applied, there is no need to submit another application for the same position.
          
          Thank you for your interest in joining our team. Should you have any questions or require further assistance, please feel free to contact us.
          
          Best regards,
          Vaibhav`, // Plain text body
          };

          // Sending email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.status(500).send("Email sending failed");
            } else {
              console.log("Email sent: " + info.response);
              res.status(200).send("Email sent successfully");
            }
          });

          // ------------------------------
        });
        res.redirect("/sorrypage");
      }
    });
  });
});

app.get("/congrates1", (req, res) => {
  res.sendfile(__dirname + "/dist/congrates1.html", "text/html");
});

app.get("/sorrypage", (req, res) => {
  res.sendfile(__dirname + "/dist/sorrypage.html", "text/html");
});

app.post("/add-job-data", (req, res) => {
  con.connect((err) => {
    if (err) console.log(err);
  });

  let id1;

  let id11;
  let sql1 = `select *from admin_login`;
  con.query(sql1, (err, result3) => {
    id11 = result3[result3.length - 1].id;
    console.log("Last date" + req.body.lastdate);
    let sql = `insert job (job_title,company,vacancy,image,location,emp_id,userID,last_date) values("${req.body.title}","${req.body.company}",${req.body.vacancy},"${req.body.image}","${req.body.location}",${id11},${id11},"${req.body.lastdate}");`;
    let sql1 = `select *from job`;

    con.query(sql, (err, result) => {
      if (err) console.log(err);

      con.query(sql1, (err, result1) => {
        if (err) console.log(err);
        id1 = result1[result1.length - 1].job_id;
        let sql2 = `insert adver (job_id,experi,descri,salary,additional) values(${id1},"${req.body.experi}","${req.body.descre}","${req.body.salary}","${req.body.additional}");`;

        con.query(sql2, (err, result3) => {
          if (err) console.log(err);
          res.redirect("/show_job");
        });
      });
      console.log("Added successfully..");
    });
  });
});

app.post("/search-data", (req, res) => {
  let search = req.body.searchtext;

  let sql = `select *from course where course_name like '%${search}%'`;

  con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/show_courses", { list: result });
  });
});

app.post("/search-data1", (req, res) => {
  let id = req.query.id;
  let search = req.body.searchtext;

  let sql = `select *from course where course_name like '%${search}%' and userId=${id}`;

  con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/show_courses1", { list: result, id });
  });
});

app.post("/search-job-data-before", (req, res) => {
  let search = req.body.searchtext;

  let sql = `select *from job where job_title like '%${search}%'`;

  con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/show_job_user", { list: result });
  });
});

app.post("/search-job-data-admin", (req, res) => {
  let search = req.body.searchtext;

  let sql = `select *from job where job_title like '%${search}%'`;

  con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/show_jobs", { list: result });
  });
});

app.post("/search-job-data", (req, res) => {
  let search = req.body.searchtext;

  let sql = `select *from job where job_title like '%${search}%'`;

  con.query(sql, (err, result) => {
    res.render(__dirname + "/dist/show_job_after_login", { list: result });
  });
});

app.listen(port);
