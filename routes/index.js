const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ashes-2d5e1.firebaseio.com",
  apiKey: "AIzaSyBRN8B9hj89R1Zghjj64plxAfRn3rIlhKM",
  authDomain: "ashes-3d1a1.firebaseapp.com",
  projectId: "ashes-3d1a1",
  storageBucket: "ashes-3d1a1.appspot.com",
  messagingSenderId: "415546642092",
  appId: "1:415546642092:android:10a6df27d9d6a351ca9909",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedFiles = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedFiles.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    await admin.auth().signInWithEmailAndPassword(email, password);

    res.redirect("/");

  } catch (error) {
    console.error("Login error:", error);
    res.send("Login error");
    res.render("login.hbs", { loginErr: true });
  }
});


router.get("/", function (req, res, next) {
  res.render("/public/index.html");
});

router.post(
  "/",
  upload.fields([
    { name: "ThumbNail", maxCount: 1 },
    { name: "Image", maxCount: 1 },
    { name: "ImagePlayer", maxCount: 1 },
    { name: "Team1", maxCount: 1 },
    { name: "Team2", maxCount: 1 },
  ]),
  async function (req, res, next) {
    try {
      const { category } = req.body;
      let collection;
      switch (category) {
        case "category1":
          collection = "articles";
          break;
        case "category2":
          collection = "images";
          break;
        case "category3":
          collection = "players";
          break;
        case "category4":
          collection = "fixtures";
          break;
        default:
          collection = "unknown";
          break;
      }

      const formData = {
        Date: "",
        Image: "",
        Location: "",
        MatchLink: "",
        Name: "",
        SubTitle: "",
        Team1: "",
        Team2: "",
        articleTitle: "",
        body: "",
        playerImageField2: "",
        subtitle: "",
        thumbNail: "",
      };

      for (const key in req.body) {
        if (key !== "category") {
          formData[key] = req.body[key];
        }
      }

      for (const fileField of [
        "ThumbNail",
        "Image",
        "ImagePlayer",
        "Team1",
        "Team2",
      ]) {
        if (req.files && req.files[fileField]) {
          const file = req.files[fileField][0];
          const fileExtension = path.extname(file.originalname);
          const fileName = `${fileField}/${Date.now()}${fileExtension}`;
          const fileUpload = bucket.file(fileName);
          const blobStream = fileUpload.createWriteStream({
            metadata: { contentType: file.mimetype },
          });
          blobStream.end(file.buffer);
          formData[
            fileField
          ] = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }
      }

      await db.collection(collection).add(formData);
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/feedbacks", async (req, res) => {
  try {
    console.log("Fetching feedbacks...");
    const data = [];
    const snapshot = await db.collection("feedback").get();
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    console.log("Fetched data:", data);
    res.render("feedbacks.hbs", { data }); // Pass data to the template
  } catch (e) {
    console.error("Error fetching feedbacks:", e);
    res.status(500).send("Error");
  }
});

router.get('/contents', async (req, res) => {
  try {
    const data = [];
    const snapshot = await db.collection("articles").get();
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    res.render('view-contents.hbs', { data, layout: false }); // Pass data to the template
  } catch (e) {
    console.error("Error fetching contents:", e);
    res.status(500).send("Error");
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('articles').doc(docId);
    await docRef.delete();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).send('Error deleting document');
  }
});



// router.get("/analytics", (req, res) => {
//   res.render("analytics.hbs");
// });

module.exports = router;
