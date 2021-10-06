# Building a drag-and-drop file uploader app for Angular 11 and Firebase

# Overview
1. Create a Firebase app
1. Create a nearly empty Angular app
1. Connect Firebase authentication to the Angular app
1. Add the drag-and-drop code
1. Build for production

# Please note...
* this tutorial isn't meant for real world use!
* ...but it's not far off... a real-world version needs to add the following:
1. allow for signup/login/logout 
1. configure Firebase Storage to only let logged-in users upload files
1. have an admin component that grants/revokes upload privilege to users
* my original version of this tutorial had all these features, but it was 95% prep work to get to the 5% of the code that
deals with drag-and-drop!

# Create your Firebase App
The Firebase website changes fairly often, so the exact wording below might change a little.

* firebase.google.com > (login) > "Go to console" > "Add project" > name: "dnd" >
    Continue > (we're not going to enable Google Analytics) > "Create project" 
    
* when the project is created, you'll be taken to its dashboard, click the small "</>" Web logo > 
    enter "dnd" for "My web app" name > (no need to set up Firebase hosting) > "Register app"

* you'll be taken to a page with Firebase SDK code. keep this tab open! we'll work with the 
`firebaseConfig` variable in a later step when we connect our Firebase and Angular apps

## Set up Firebase Storage
* open a duplicate browser tab and in the left column, browse to Build > Storage > Rules

* set the rule to: `allow read, write: if true;` and keep in mind this is INSECURE! For testing only!

## Set up the Cloud Firestore database
* we're going to use Cloud Firestore to build a NoSQL database to store details about our uploaded files

* in the left column, browse to Build > Cloud Firestore > click "Create database" > "Start in test mode" > "Next" > (choose a location close to you) > "Enable"

## Cloud Firestore test data
* you don't have to set up any data, collections, or documents manually! Everything will be automatically built from our Angular app

* for this project, I have 1 collection of documents called `uploads`
    
* documents inside the `uploads` collection contain the fields 
`{downloadURL<string>, originalName<string>, storagePath<string>, timestamp<number>}`

# Create your Angular App

## Make sure your coding environment is up to date
> ng version            
* make sure you're at least using Angular 11
* note that Angular CLI version 12.0.0 has a bug running @angular/fire
* see: https://stackoverflow.com/questions/67580649/ng-add-angular-fire-the-package-that-you-are-trying-to-add-does-not-support-sc

> npm -v                
* make sure you're at least using npm version 6

## Create the Angular project
> npm install -g @angular/cli

> ng new drag-and-drop
* Enforce stricter type checking? No
* Add Angular routing? Yes
* Which stylesheet? CSS

> cd drag-and-drop

## Add the Firebase and Angular Material libraries

> ng add @angular/fire
* Please select a project: (the newly created Firebase "dnd" app)

> ng add @angular/material
* Choose a prebuilt theme: (any)
* Typography: Yes
* Browser animations: (yes or no; I'll be choosing yes)

Note: you can choose "No", but even if you choose "Yes" and end up
    not using it, when you build your app for production, all unused libraries will be removed

## Start the Server
> ng serve --port 4202 --open

## Remove boilerplate code
* in `drag-and-drop/src/app/app.component.html`, only keep the `<router-outlet></router-outlet>` tag at the very bottom of the file

## Add components, services, Firebase auth, and Angular page guards

> ng generate component home
* home is a normal page where we'll add the drag-and-drop functionality inside

> ng generate component uploadManager          
* uploadManager contains the active dropzone, it's the parent that manages all of the files that are uploaded

> ng generate component uploadTask              
* an uploadTask component is added for every file that's dragged and dropped in the uploadManager - each child task will control the actual upload of that given file

> ng generate directive directives/dropzone
* the dropzone listens for actions and emits events when an action happens
   


## Link the pages (Set up page routing)
* open `drag-and-drop/src/app/app-routing.module.ts`
    * import each component
    * add each component to the `routes:[...]` array

# Connect Firebase authentication to the Angular app

## Use the Firebase App credentials
* open `drag-and-drop/src/environments/environment.ts` and `environment.prod.ts`
* in your browser, return to the tab with the Firebase SDK code and the `firebaseConfig` variable; copy the snippet of code to both `environment` files, renaming `firebaseConfig` to `firebase`
* in case you're using `git`, you won't want to publish this information, so open your `.gitignore` file, make sure to include the line `/src/environments/**`
* note: since these files are not part of my GitLab project, here's what my `environment.ts` file generally looks like:

```
export const environment = {
    production: false,
    firebase: {
        apiKey: "MY_DATA_HERE",
        authDomain: "MY_DATA_HERE",
        projectId: "MY_DATA_HERE",
        storageBucket: "MY_DATA_HERE",
        messagingSenderId: "MY_DATA_HERE",
        appId: "MY_DATA_HERE"
    }
};
```

* keep in mind that Firebase often changes what info is put inside the `firebaseConfig = {...}` variable, so if Firebase supplies you with slightly different info, that's fine

## Add basic navigation to each component
* open `drag-and-drop/src/app/app.module.ts`
    * import the additional modules that we'll be using (see my code)
    * add these modules to the `imports:[...]` array
    * this lets us use Angular Material in our components and it imports our Firebase environment variables

* open `drag-and-drop/src/app/home/home.component.ts`, `.html`, and `.css`
    * import the code

* do the same for:
    * `drag-and-drop/src/app/home/home.component.ts`, `.html`, and `.css`
    * `drag-and-drop/src/app/upload-manager/upload-manager.component.ts`, `.html`, and `.css`
    * `drag-and-drop/src/app/upload-task/upload-task.component.ts`, `.html`, and `.css`
    * `drag-and-drop/src/app/directives/dropzone.directive.ts`


# Build for production 
> ng build --prod

* building for production will take a little time, but all of the unused libraries will be removed!

* you can take the contents of your `drag-and-drop/dist/drag-and-drop` folder and upload it to the `html` folder of your website




