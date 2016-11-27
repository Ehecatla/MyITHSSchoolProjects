Project teamworkers:
Ella Einarsen - responsible for user and guest account coding&design
Christian Heina
Magdalena Erliksson
Bartek Svaberg
Filip Winbo
Monika Svensson
Roy Josefsson

Short information:

Project Find Parking was a school teamwork mobile application written with JavaScript and Angular2. In this project our team created platform independent mobile friendly application using API to show parking’s and their prices nearby chosen address. Application used Firebase to store permanent data and user profiles. I was responsible for user profile creation which included coding, database design on Firebase and UI design. User functionality extended from guest users, through new user creation in application, password retrieval, password change and persistent user trip data on database.
_________________________________________________________________


To install and run project

(Mac, Linux)
In terminal:
sudo npm install
sudo typings install

No dependencies (Typings)?
sudo npm uninstall -g typings
sudo npm install -g typings@^0.8.1

To run project:
sudo ng serve 
(if port taken sudo ng serve --port port-number)
in browser enter localhost:port-number (default 4200)
To properly close serve ctrl + c

(Windows)
In terminal:
npm install
typings install

No dependencies (Typings)?
npm uninstall -g typings
npm install -g typings@^0.8.1

To run project:
ng serve 
(if port taken ng serve --port port-number)
in browser enter localhost:port-number (default 4200)
To properly close serve ctrl + c

If errors occur:
Typings not installed
(Mac, Linux) sudo npm install typings --global (or sudo npm install -g typings)
(Windows) npm install typings --global (or npm install -g typings)

When serving cant find assets
(Mac, Linux) sudo ng build
(Windows) ng build

If none of these work refer to https://github.com/angular/angular-cli/issues for more information

Clean install:
(Mac, Linux)
Node:
Delete node_modules at /usr/local/lib
download at [https://nodejs.org/dist/latest-v5.x/node-v5.11.1.pkg](Link URL)
after installing run sudo npm update

(Windows)
Node:
Delete node_modules in root folder
x64 download at [https://nodejs.org/dist/latest-v5.x/node-v5.11.1-x64.msi](Link URL)
[x86 download at https://nodejs.org/dist/latest-v5.x/node-v5.11.1-x86.msi](Link URL)
after installing run npm update