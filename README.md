# Building a drag-and-drop file uploader app for Angular 11 and Firebase
## Project Url: https://app-drag-and-drop.web.app/home

# Feature
1. Drag and Drop File to Upload in Firebase Store
2. Select which type of file you want to upload by selecting checkbox
3. Choose the size by using slider
4. Use of Ant Design Component
5. Preview the Files once uploading is finish
6. You can Pause, Cancel and Resume the file
7. Download % is visible in progress bar

## How to install
1. Clone the project and make the environments folder in src
2. and make environment.ts file

```
export const environment = {
  production: false,
  firebase: {
    apiKey: "your api key",
    authDomain: "app-drag-and-drop.firebaseapp.com",
    projectId: "app-drag-and-drop",
    storageBucket: "app-drag-and-drop.appspot.com",
    messagingSenderId: "###",
    appId: "###",
  },
};
