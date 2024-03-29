// const firebase = require('firebase');
import * as firebase from "firebase/app";
const firebaseConfig = {
  project_info: {
    project_number: "415546642092",
    project_id: "ashes-3d1a1",
    storage_bucket: "ashes-3d1a1.appspot.com",
  },
  client: [
    {
      client_info: {
        mobilesdk_app_id: "1:415546642092:android:10a6df27d9d6a351ca9909",
        android_client_info: {
          package_name: "com.example.ashes",
        },
      },
      oauth_client: [
        {
          client_id:
            "415546642092-im6dup1tob3ihmannbogijskno6fej96.apps.googleusercontent.com",
          client_type: 1,
          android_info: {
            package_name: "com.example.ashes",
            certificate_hash: "fb78b309286d23b7676040401d590ce7da7d3a54",
          },
        },
        {
          client_id:
            "415546642092-qble9jd53oedgsngeu5nb4og4qr2qvu9.apps.googleusercontent.com",
          client_type: 3,
        },
      ],
      api_key: [
        {
          current_key: "AIzaSyBRN8B9hj89R1Zghjj64plxAfRn3rIlhKM",
        },
      ],
      services: {
        appinvite_service: {
          other_platform_oauth_client: [
            {
              client_id:
                "415546642092-qble9jd53oedgsngeu5nb4og4qr2qvu9.apps.googleusercontent.com",
              client_type: 3,
            },
            {
              client_id:
                "415546642092-d2ialflqglqnedee4jolh6im3u7j00lv.apps.googleusercontent.com",
              client_type: 2,
              ios_info: {
                bundle_id: "com.example.ashes",
              },
            },
          ],
        },
      },
    },
  ],
  configuration_version: "1",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
