All the files builded  are created under ./build/ (added to .gitignore)

A Makefile at the root of the project is used to buid and deploy the project. (one entry to build/deploy per lambda, one entry to build/deploy the frontend, one entry to build/deploy the whole project).

The makefile will contains an help entry, listing all the entries. If you dont specify anything, the help entry is played. 

When the frontend is builded, it extract from the opentofu outputs : 
* the url endpoint of the API Gateway
* the key 
and store that in a config.json file that will read by the frontend app. 

When the backend is builded, I cant use goproxy. Please preprend `GOPROXY=direct ` in front of each go commands. 