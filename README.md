# SPDC-REST-API
The app is using three API controllers. Those are Accounts, Products, &amp; Orders. The names suggest what interaction they are going to handle. When the app is connected to the server through the enterprise integrator, all will be forwarded to the server except one special case, that is the payment handling scenario.


Installing Prerequisites
1. Install JDK
   1. Set JAVA_HOME system variable to your jdk folder (Example:  “C:\Program Files (x86)\Java\jdk1.8.0_131”)
1. Install JRE (1.8 or up)
   1. Add your jre/bin folder into PATH variables under ENVIRONMENT VARIABLES (Example:  “C:\Program Files\Java\jdk1.8.0_131\jre\bin”)
1. Install “WSO2-EI”
2. Install “Developer Studio EI Eclipse”
   1. Increase memory for eclilpse IDE by changing the following configuration values in “eclipse.ini” file to appropriate values.
      1. -Xms
      2. -Xmx
1. Install XAMPP with 
   1. Apache
   2. Mysql
   3. Phpmyadmin
   4. Then remove contents inside htdocs folder (Example: “C:\xampp\htdocs”)
1. While running the project on localhost, make sure you have an active internet connection for emaiing and SMS to work properly.


Configuring the project
1. Start XAMPP with Apache & MySQL.
   1. Copy contents from “Deliverables\Client” into htdocs folder
   2. Copy contents from “Deliverables\Services” into htdocs folder
1. Open “http://localhost/phpmyadmin” on a web browser and create a database with the name “pharmacy”.
   1. Go to import tab in “pharmacy” database and browse for “pharmacy.sql” inside Services folder. Click on “Go” after you picked the correct file.
1. Open your favorite text editor and open “C:/xampp/htdocs” folder with it.
   1. Open “/backend/application/config/database.php”
      1. Edit the values as follows
      2. Key
	Preferred Value
	Description
	hostname
	localhost
	

	username
	root
	The mysql user that should login for transcations
	password
	<empty string>
	

	database
	pharmacy
	Name of the database you created
	

   1. Open “/backend/application/config.php”
      1. Edit ‘LoyalityPointsPerRupee’ value to the number of points that the customer will gain per each rupee spent on an invoice.
   1. Go to twilio.com and obtain api keys and a SMS number.
      1. Open “/backend/application/twilio.php” and edit the following values
         1. Account_sid (from console)
         2. Auth_token (from console)
         3. Number (the number you bought on twilio for sms)
   1. Create an “app password” from your google account for this system. (you need to have 2-factor-auth enabled)
      1. Open “/backend/application/email.php” and edit the following
         1. For “smtp_pass”, paste that generated code.
         2. For “smtp_user”, type your GMail address including “@gmail.com”
   1. Open Eclipse
      1. File -> Import -> Existing WSO2 Projects into workspace -> Select Archive File -> Browse -> “/WSO2 Enterprise Integrator Eclipse Project/wso2eiProject.zip” -> [check] copy projects into workspace -> Finish.
      2. Under “Servers” tab
         1. Create a new WSO2 Enterprise Integrator server if such a server doesn’t exist.
            1. Select server type “WSO2 Enterprise Integrator 6.0.0.”
            2. Next
            3. JRE: 1.8.XXXXX
            4. Browse CARBON_HOME to “C:/Program Files/WSO2/Enterprise Integrator/6.X.X”
            5. Next
            6. Add PharmacyServicesCompositeApplication and FINISH.


Running the project
If you are planning to use the REST endpoints directly without going through WSO2 EI, then
* Open “/frontend/js/app.js” and set useConnector to “false”,
Or else, set it to “true” if you’re planning to use the WSO2 EI endpoints, and
1. Open Eclipse
   1. File -> Import -> Existing WSO2 Projects into workspace -> Select Archive File -> Browse -> “/WSO2 Enterprise Integrator Eclipse Project/wso2eiProject.zip” -> [check] copy projects into workspace -> Finish.
   2. Under “Servers” tab
      1. RIGHT CLICK -> START the newly added server
         1. Wait for start


Open http://localhost/frontend to use the application
