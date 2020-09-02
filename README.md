# LibQuality
RESTFull API for collect metrics from GitHub projects.

### Read the Documentation
Access all the Sistem Analisis and Documentation in: `.\_documentation\`

## Installation

* Clone LibQuality Repository;

* Execute `npm install` in both api repositories;
  - `.\backend\`
  - `.\updateServer\`
* Execute `npm start` in both for iniciate the servers;
  > Default ports will be: backend:3000 and updateServer:3001  
* Import the Workspece file in Insomnia Application;
  > [Download and Install](https://insomnia.rest/download/core/?)
  >> Import File: `.\_documentation\Tests and Implementation\Insommnia.json`
* In Insomnia, go for the Authentication Folder, will be a pre setted post requisition;
* In the body of requisition inform a valid GitHub account and click in Send, you'll get a `result: success` if OK;
```json
  {
	  "gitUser": "valid GitHub user",
          "gitPassword": "valid GitHub pass"
  }
```
* Insert a new Project, so the sistem can start collecting data.
  > All Projects requisition wll be in Insomina Projects Folder
  >> Use `post` to create
* Call a `forceupdate` to push all information from the registereds Projects;
>This process can take from 1 to 3 minutes per Project
* Now, you can see the **Statistics** and **Dashboard** informations using the Statistics Folder requests

### Auto Update
The **updateServer** will, by default, realize an update every 12 hous. You can call a `forceupdate` using the `Force Update` request,
or can change the `Timer Variable` in project;

> To chance the `Time Variable`, access `./updateServer/index.js`, and change the value of `var interval` in miliseconds;
