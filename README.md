# SpO2Analysis
Analyze the Fitbit data to identify the Sleep patterns of a patient

Health Tracking and Vitals Analysis
Our application helps user track their Spo2 Data. We have provided infrastructure so that users can upload their Spo2 data and perform analysis on that data. We have fitbit api Integration which allows to track the historical fitbit data. User can perform analytics on both fitbit data and spo2 data with tools provided to derive patterns. Alerts system integrated to provide alerts based on analytics and also risk level. 

Setting Up the Application:
1.	Setup Client : Angular App
2.	Setup Server : node.js App
3.	Setup Spo2 Analysis : Python Flask App
Requirements
●	Amazon S3
●	Amazon EC2
●	ELK Stack : [http://www.websightdesigns.com/wiki/ELK_Stack_on_Mac_OS_X_Yosemite]
●	Twilio API : instructions at [https://www.twilio.com/docs/quickstart/node]
●	MongoDB instructions at [http://docs.mlab.com/]
●	Fitbit API : Integration and Registration at [https://dev.fitbit.com/]
Instructions for Running the Client
It is a node.js application which helps patients suffering with sleep apnea. It will have an integration with the Spo2 oximeter and Fitbit API. The user can upload historical spo2 to our app as csv files. This will help them to rack their Spo2 data and provide tools to perform analytics and alert based on the predictive analytics. 


Setup MongoDB

Setup ELK Stack
http://www.websightdesigns.com/wiki/ELK_Stack_on_Mac_OS_X_Yosemite
Use the file elasticsearch.yml  provided in package for setting the elastic search
Use the files logstash.conf, spo2logstash.conf in package for setting the kibana, logstash


Install Required Node Modules simply by the below command

npm install 

when asked for options by bower components

enter 6.

Once everything has been setup. Run client by

npm start


Instructions for Running the Server

Our Server is a simple node application. We have used it for the authentication services.

Our server dependencies will automatically installed by the following command

npm install

Start the Server by using the following command

node index.js

Instructions for Running Spo2Analysis Flask Application

The flask application performs Fitbit data analysis as part of our application. This Part of the application helps in gathering the Sleeping condition and Physical Activity parameters of a patient.  we have the analysed various sleeping behaviors using fitbit data. this web application use Flask MVC to present the graphs on the dashboard, making it easy for the users to analyze their sleeping behavior over a period of time.


Setup Instructions.

Install all the Dependencies by using command


pip install *requirements

Run the App by using command

python spO2.py
