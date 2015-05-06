//This test is to check that it's possible to log in using the correct credential

describe("Owncloud.Login", function() {

	/////////////////////////////////////////////////
    //////////General functions to use util.js//////////////
    //Here we detect if it the display has a popover or not
	getContainer = function(){
	    var cont;
	    //Here we detect if it the display has a popover or not (in this case, is ipad or not)
	    if(target.frontMostApp().mainWindow().popover().isValid()){
	        cont = target.frontMostApp().mainWindow().popover();
	    }else{
	        cont = target.frontMostApp().mainWindow();
	    }
	    return cont;
	}


	//get the correct tableview, it depends on the device and the orientation
	getTableViewContainer = function(target){
		var cont;
		if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT){
			cont = target.frontMostApp().mainWindow().tableViews()[1];
		}else{
			cont = target.frontMostApp().mainWindow().tableViews()[0];
		}
		return cont;

	}

	//A convenience method for detecting that you're running on an iPad
	isDeviceiPad = function(obj) {
		return obj.model().match(/^iPad/) !== null;
	}

	//A convenience method for detecting that you're running on an iPhone or iPod touch
	isDeviceiPhone = function(obj) {
	      return obj.model().match(/^iPhone/) !== null;
	}



	//A convenience method for detecting that you're running on an iPhone with ios7
	isIos7 = function(obj) {
	      return obj.systemVersion().match(/^7/) !== null;
	}

	//A convenience method for detecting that you're running on an iPhone with ios7
	isIos6 = function(obj) {
	      return obj.systemVersion().match(/^6/) !== null;
	}
	/////////////////////////////////////////////////////


	//Here we detect if an alert is shown
	UIATarget.onAlert = function onAlert(alert) {
		var title = alert.name();
		UIALogger.logMessage("Alert with title ’" + title + "’ encountered!");
		//if the alert is about user already exists, we return true
	    if (title == "The entered user already exists") {
	        alert.buttons()["OK"].tap();
	        return true; // bypass default handler
	    }
		return false; // use default handler
	}

	///////////////////////////////////////////////////
	///////////////Declare some variables
	var target = UIATarget.localTarget();

	var testName;

	//account1
	var serverAccount1 = "owncloudServerVar"; 
	var userAccount1 = "owncloudUserVar"; 
	var passwordAccount1 = "owncloudPasswordVar"; 

	var idCellAccount1 = userAccount1 +", "+ serverAccount1+"/";

	//account2
	var serverAccount2 = "owncloudServer2Var"; 
	var userAccount2 = "owncloudUser2Var"; 
	var passwordAccount2 = "owncloudPasswordVar"; 

	var idCellAccount2 = userAccount2 +", "+ serverAccount2+"/";

	//account1
	var serverAccount3 = "owncloudServer3Var"; 
	var userAccount3 = "owncloudUser3Var";
	//pasword wirh special characters 
	var passwordAccount3 = "owncloudPassword3Var"; 

	var idCellAccount3 = userAccount3 +", "+ serverAccount3+"/";


	var incorrectServerAccount = "https://incorrect.owncloud.com/owncloud";
	var incorrectpasswordAccount = "Incorrect password";  


	var container;
	var tableViewContainer;
	var timeToPushTimeOut=180;

	///////////////////////////////////
	//Case to test
	it("login-portrait", function() {

		testName = "Login - Portrait";
		//test start
		UIALogger.logStart(testName);


		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			//Here we detect if it the display has a popover or not (in this case, is ipad or not)
			container = getContainer();

			container.tabBar().buttons()["Settings"].tap();
			container .tableViews()[0].cells()["Manage Accounts"].tap();
			
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
			}else{
				target.frontMostApp().navigationBar().rightButton().tap();
			}		
			container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
			//container .tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
			
			if(isIos6(target)){
				//With ios6, intruments doesn't find delete button so it has to be implement like that
				//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
			}else{
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
			}
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 


	///////////////////////////////////
	//Case to test
	it("login-landscape", function() {
		testName = "Login - landscape";
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();


		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			//Here we detect if it the display has a popover or not (in this case, is ipad or not)
			container = getContainer();

			container.tabBar().buttons()["Settings"].tap();
			container .tableViews()[0].cells()["Manage Accounts"].tap();
			
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
			}else{
				target.frontMostApp().navigationBar().rightButton().tap();
			}		
			container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
			//container .tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.2, y:0.2}, duration:0.25});
			
			if(isIos6(target)){
				//With ios6, intruments doesn't find delete button so it has to be implement like that
				//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
			}else{
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
			}
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("login-landscape-rotate", function() {

		testName = "Login - landscape - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");


		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		//Select to login
		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();


		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();


		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			//Here we detect if it the display has a popover or not
			container = getContainer();
			
			container.tabBar().buttons()["Settings"].tap();
			container .tableViews()[0].cells()["Manage Accounts"].tap();
			
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
			}else{
				target.frontMostApp().navigationBar().rightButton().tap();
			}		
			container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
			//container .tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.2, y:0.2}, duration:0.25});
			if(isIos6(target)){
				//With ios6, intruments doesn't find delete button so it has to be implement like that
				//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
			}else{
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
			}
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("login-portrait-rotate", function() {
		testName = "Login - Portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		//Select to login
		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			//Here we detect if it the display has a popover or not
			container = getContainer();

			container.tabBar().buttons()["Settings"].tap();
			container .tableViews()[0].cells()["Manage Accounts"].tap();
			
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
			}else{
				target.frontMostApp().navigationBar().rightButton().tap();
			}		
			container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
			//container .tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
			
			if(isIos6(target)){
				//With ios6, intruments doesn't find delete button so it has to be implement like that
				//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
			}else{
				container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
			}
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("loginSpecialCharacter-landscape-portrait", function() {
		testName = "Login with a password with special character- Landscape - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount3);
		target.frontMostApp().keyboard().typeString("\n");
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount3);
		target.frontMostApp().keyboard().typeString("\n");

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount3);
		target.frontMostApp().keyboard().typeString("\n");

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);


		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		//Select to login
		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		UIALogger.logMessage("Detect if the files screen is shown");

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();
		
		//Here it is checked if the test is passed
		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
			//if the test if passed, to restore the app as it was found
			//Delete the account
			//Here we detect if it the display has a popover or not
			container = getContainer();

			container.tabBar().buttons()["Settings"].tap();
			container .tableViews()[0].cells()["Manage Accounts"].tap();
			
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
			}else{
				target.frontMostApp().navigationBar().rightButton().tap();
			}		
			container.tableViews()[0].cells()[idCellAccount3].switches()["Delete "+idCellAccount3].setValue(true);
			//container .tableViews()[0].cells()[idCellAccount3].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
			
			if(isIos6(target)){
				//With ios6, intruments doesn't find delete button so it has to be implement like that
				//container.tableViews()[0].cells()[idCellAccount3].buttons()["More info, "+ idCellAccount3].tap();
				container.tableViews()[0].cells()[idCellAccount3].buttons()["Confirm Deletion for "+ idCellAccount3].tap();
			}else{
				container.tableViews()[0].cells()[idCellAccount3].buttons()["Delete"].tap();
			}
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}


	}); 

	///////////////////////////////////
	//Case to test
	it("multiaccount-portrait", function() {
		testName = "Login - Multiaccount - portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);


		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
			//Here we detect if it the display has a popover or not
			container = getContainer();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Manage Accounts"].tap();
			container.tableViews()[0].cells()["Add new account"].tap();


			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the other account
			tableViewContainer.cells()[0].textFields()[0].tap();
			tableViewContainer.cells()[0].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[0].textFields()[0].setValue(serverAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			//It waits x seconds or until the connections is established, to continue the test.
			target.pushTimeout(timeToPushTimeOut);
			tableViewContainer.groups()["Secure Connection Established"];
			target.popTimeout();

			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
			//Here we detect if it the display has a popover or not
			container = getContainer();
			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//if it's an ipad and in portrait, the popover is in the front, so we dismiss
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().dismiss();
			}

			tableViewContainer.cells()[1].textFields()[0].tap();
			tableViewContainer.cells()[1].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[1].textFields()[0].setValue(userAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			tableViewContainer.cells()[2].secureTextFields()[0].tap();
			tableViewContainer.cells()[2].secureTextFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[2].secureTextFields()[0].setValue(passwordAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			//scroll up, to see the button if necessary
			if(!tableViewContainer.cells()[3].isVisible()){
				tableViewContainer.cells()[3].scrollToVisible();
			}

			tableViewContainer.cells()[3].tap();

			//It waits x seconds or until the loading disappear, to continue the test. 
			target.pushTimeout(timeToPushTimeOut);
			target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
			target.popTimeout();

			//if it's an ipad and in portrait, the popover is hidden, so we show it
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().toolbar().buttons()[0].tap();
				if(target.frontMostApp().mainWindow().popover().navigationBar().name()!="Manage Accounts"){
					container.tabBar().buttons()["Settings"].tap();
				}
			}


			////CHECK USING JASMINE METHOD
			expect(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()).toBeTruthy();

			//Here it is checked if the test is passed
			if(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()){
				//if the test if passed, to restore the app as it was found
				//Delete the accounts
				if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
					target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
				}else{
					target.frontMostApp().navigationBar().rightButton().tap();
				}		
				container.tableViews()[0].cells()[idCellAccount2].switches()["Delete "+idCellAccount2].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount2].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount2].buttons()["Confirm Deletion for "+ idCellAccount2].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount2].buttons()["Delete"].tap();
				}
				target.delay(1);

				//it's neccesary to tap anywhere, to delete after that the other account
				container.tableViews()[0].tapWithOptions({tapOffset:{x:0.67, y:0.59}});

				//delete the other account 
				container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
				}	
				
				
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("multiaccount-landscape", function() {
		testName = "Login - Multiaccount - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);


		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			container = getContainer();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Manage Accounts"].tap();
			container.tableViews()[0].cells()["Add new account"].tap();


			tableViewContainer = getTableViewContainer(target);

			//log in with the other account
			tableViewContainer.cells()[0].textFields()[0].tap();
			tableViewContainer.cells()[0].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[0].textFields()[0].setValue(serverAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			//It waits x seconds or until the connections is established, to continue the test.
			target.pushTimeout(timeToPushTimeOut);
			tableViewContainer.groups()["Secure Connection Established"];
			target.popTimeout();

			tableViewContainer.cells()[1].textFields()[0].tap();
			tableViewContainer.cells()[1].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[1].textFields()[0].setValue(userAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			tableViewContainer.cells()[2].secureTextFields()[0].tap();
			tableViewContainer.cells()[2].secureTextFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[2].secureTextFields()[0].setValue(passwordAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			//scroll up, to see the button if necessary
			if(!tableViewContainer.cells()[3].isVisible()){
				tableViewContainer.cells()[3].scrollToVisible();
			}

			tableViewContainer.cells()[3].tap();

			//It waits x seconds or until the loading disappear, to continue the test. 
			target.pushTimeout(timeToPushTimeOut);
			target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
			target.popTimeout();


			////CHECK USING JASMINE METHOD
			expect(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()).toBeTruthy();

			//Here it is checked if the test is passed
			if(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()){
				//if the test if passed, to restore the app as it was found
				//Delete the accounts
				if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
					target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
				}else{
					target.frontMostApp().navigationBar().rightButton().tap();
				}		
				container.tableViews()[0].cells()[idCellAccount2].switches()["Delete "+idCellAccount2].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount2].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.2, y:0.2}, duration:0.25});
				
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount2].buttons()["Confirm Deletion for "+ idCellAccount2].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount2].buttons()["Delete"].tap();
				}
				target.delay(1);

				//it's neccesary to tap anywhere, to delete after that the other account
				container.tableViews()[0].tapWithOptions({tapOffset:{x:0.67, y:0.59}});

				//delete the other account
				container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.2, y:0.2}, duration:0.25});
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
				}	
				
				
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 

	//Cases to test
	it("multiaccount-portrait-rotate", function() {
		testName = "Login - Multiaccount - portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);


		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
			//Here we detect if it the display has a popover or not
			container = getContainer();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Manage Accounts"].tap();
			container.tableViews()[0].cells()["Add new account"].tap();


			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the other account
			tableViewContainer.cells()[0].textFields()[0].tap();
			tableViewContainer.cells()[0].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[0].textFields()[0].setValue(serverAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			//It waits x seconds or until the connections is established, to continue the test.
			target.pushTimeout(timeToPushTimeOut);
			tableViewContainer.groups()["Secure Connection Established"];
			target.popTimeout();

			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
			//Here we detect if it the display has a popover or not
			container = getContainer();
			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//if it's an ipad and in portrait, the popover is in the front, so we dismiss
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().dismiss();
			}

			tableViewContainer.cells()[1].textFields()[0].tap();
			tableViewContainer.cells()[1].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[1].textFields()[0].setValue(userAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			tableViewContainer.cells()[2].secureTextFields()[0].tap();
			tableViewContainer.cells()[2].secureTextFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[2].secureTextFields()[0].setValue(passwordAccount2);
			target.frontMostApp().keyboard().typeString("\n");

			//scroll up, to see the button if necessary
			if(!tableViewContainer.cells()[3].isVisible()){
				tableViewContainer.cells()[3].scrollToVisible();
			}

			tableViewContainer.cells()[3].tap();

			//It waits x seconds or until the loading disappear, to continue the test. 
			target.pushTimeout(timeToPushTimeOut);
			target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
			target.popTimeout();

			//if it's an ipad and in portrait, the popover is hidden, so we show it
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().toolbar().buttons()[0].tap();
				if(target.frontMostApp().mainWindow().popover().navigationBar().name()!="Manage Accounts"){
					container.tabBar().buttons()["Settings"].tap();
				}
			}

			////CHECK USING JASMINE METHOD
			expect(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()).toBeTruthy();

			//Here it is checked if the test is passed
			if(container.tableViews()[0].cells()[idCellAccount1].isValid() && container.tableViews()[0].cells()[idCellAccount2].isValid()){
				//if the test if passed, to restore the app as it was found
				//Delete the accounts
				if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
					target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
				}else{
					target.frontMostApp().navigationBar().rightButton().tap();
				}		
				container.tableViews()[0].cells()[idCellAccount2].switches()["Delete "+idCellAccount2].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount2].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount2].buttons()["Confirm Deletion for "+ idCellAccount2].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount2].buttons()["Delete"].tap();
				}
				target.delay(1);

				//it's neccesary to tap anywhere, to delete after that the other account
				container.tableViews()[0].tapWithOptions({tapOffset:{x:0.67, y:0.59}});

				//delete the other account 
				container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
				}	
				
				
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectServer-portrait", function() {
		testName = "Login - incorrect server -portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		//log in with account1, the incorrect server
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(incorrectServerAccount);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connection test is finished, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		//target.frontMostApp().mainWindow().tableViews()[0].groups()["Testing Connection"].withValueForKey(0,"isVisible");
		//target.frontMostApp().mainWindow().tableViews()[0].groups()["In progress"].withValueForKey(0,"isVisible");
		target.frontMostApp().mainWindow().tableViews()["Empty list"].groups()["Server not found"].withValueForKey(1,"isVisible");
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectServer-landscape-rotate", function() {
		testName = "Login - incorrect server - landscape - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);


		//log in with account1, the incorrect server
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(incorrectServerAccount);
		target.frontMostApp().keyboard().typeString("\n");


		//It waits x seconds or until the connection test is finished, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		//target.frontMostApp().mainWindow().tableViews()[0].groups()["Testing Connection"].withValueForKey(0,"isVisible");
		target.frontMostApp().mainWindow().tableViews()[0].groups()["In progress"].withValueForKey(0,"isVisible");
		//target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].withValueForKey(1,"isVisible");
		target.popTimeout();


		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);


		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["Server not found"].isValid()){
			//if the test if passed, to restore the app as it was found
			//This is necessary after several rotation
			target.delay(1);
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("emptyPassword-landscape", function() {
		testName = "Login - empty password - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		////CHECK USING JASMINE METHOD
		expect(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())).toBeTruthy();

		//Here it is checked if the test is passed (ipad o ihpone)
		if(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");

			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("emptyPassword-portrait", function() {
		testName = "Login - empty password - portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		////CHECK USING JASMINE METHOD
		expect(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())).toBeTruthy();

		//Here it is checked if the test is passed (ipad o ihpone)
		if(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("emptyPassword-portrait-rotate", function() {
		testName = "Login - empty password - portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().keyboard().typeString("\n");
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		////CHECK USING JASMINE METHOD
		expect(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())).toBeTruthy();

		//Here it is checked if the test is passed (ipad o ihpone)
		if(!(target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isEnabled())){
			//if the test if passed, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			target.delay(1);
			UIALogger.logPass(testName);
			
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectPassword-landscape", function() {
		testName = "Login - incorrect password - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(incorrectpasswordAccount);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}
		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()){
			//if the test if passed, to restore the app as it was found
			//Set field as empty
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectPassword-portrait", function() {
		testName = "Login - incorrect password - portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(incorrectpasswordAccount);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()){
			//if the test if passed, to restore the app as it was found
			//Set field as empty, to restore the app as it was found
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("incorrectPassword-portrait-rotate", function() {
		testName = "Login - incorrect password - portrait - rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);

		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(incorrectpasswordAccount);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();


		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()).toBeTruthy();

		//Here it is checked if the test is passed
		if(target.frontMostApp().mainWindow().tableViews()[0].groups()["The user or password is incorrect"].isValid()){
			//if the test if passed, to restore the app as it was found
			//This is necessary after several rotation
			//target.frontMostApp().mainWindow().tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});
			target.delay(1);
			//Set field as empty
			target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
			target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
			
			
			target.delay(1);
			UIALogger.logPass(testName);
		}else{
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("existingAccount-portrait", function() {
		testName = "Login - Existing account - portrait";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
		target.delay(1);


		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			//Here we detect if it the display has a popover or not
			container = getContainer();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Manage Accounts"].tap();
			container.tableViews()[0].cells()["Add new account"].tap();

			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the other account
			tableViewContainer.cells()[0].textFields()[0].tap();
			tableViewContainer.cells()[0].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[0].textFields()[0].setValue(serverAccount1);
			target.frontMostApp().keyboard().typeString("\n");

			//It waits x seconds or until the connections is established, to continue the test.
			target.pushTimeout(timeToPushTimeOut);
			tableViewContainer.groups()["Secure Connection Established"];
			target.popTimeout();

			tableViewContainer.cells()[1].textFields()[0].tap();
			tableViewContainer.cells()[1].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[1].textFields()[0].setValue(userAccount1);
			target.frontMostApp().keyboard().typeString("\n");

			tableViewContainer.cells()[2].secureTextFields()[0].tap();
			tableViewContainer.cells()[2].secureTextFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[2].secureTextFields()[0].setValue(passwordAccount1);
			target.frontMostApp().keyboard().typeString("\n");

			target.delay(1);
			
			//scroll up, to see the button if necessary
			if(!tableViewContainer.cells()[3].isVisible()){
				tableViewContainer.cells()[3].scrollToVisible();
			}

			tableViewContainer.cells()[3].tap();

			//It waits x seconds or until the loading disappear, to continue the test. 
			target.pushTimeout(timeToPushTimeOut);
			target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
			target.popTimeout();

			////CHECK USING JASMINE METHOD
			expect(target.frontMostApp().alert().name()).toEqual("The entered user already exists");

			//Here it is checked if the test is passed
			if (target.frontMostApp().alert().name() == "The entered user already exists") {
				//if the test if passed, to restore the app as it was found
				target.frontMostApp().navigationBar().leftButton().tap();
				
				
				//Delete the accounts
				if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
					target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
				}else{
					target.frontMostApp().navigationBar().rightButton().tap();
				}		
				container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});
				
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
				}
				
				
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 

	///////////////////////////////////
	//Case to test
	it("existingAccount-landscape", function() {
		testName = "Login - Existing account - landscape";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);


		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			
			//Here we detect if it the display has a popover or not
			container = getContainer();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Manage Accounts"].tap();
			container.tableViews()[0].cells()["Add new account"].tap();

			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the other account
			tableViewContainer.cells()[0].textFields()[0].tap();
			tableViewContainer.cells()[0].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[0].textFields()[0].setValue(serverAccount1);
			target.frontMostApp().keyboard().typeString("\n");

			//It waits x seconds or until the connections is established, to continue the test.
			target.pushTimeout(timeToPushTimeOut);
			tableViewContainer.groups()["Secure Connection Established"];
			target.popTimeout();

			tableViewContainer.cells()[1].textFields()[0].tap();
			tableViewContainer.cells()[1].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[1].textFields()[0].setValue(userAccount1);
			target.frontMostApp().keyboard().typeString("\n");

			tableViewContainer.cells()[2].secureTextFields()[0].tap();
			tableViewContainer.cells()[2].secureTextFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[2].secureTextFields()[0].setValue(passwordAccount1);
			target.frontMostApp().keyboard().typeString("\n");
			
			target.delay(1);
			
			//scroll up, to see the button if necessary
			if(!tableViewContainer.cells()[3].isVisible()){
				tableViewContainer.cells()[3].scrollToVisible();
			}

			tableViewContainer.cells()[3].tap();

			//It waits x seconds or until the loading disappear, to continue the test. 
			target.pushTimeout(timeToPushTimeOut);
			target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
			target.popTimeout();


			////CHECK USING JASMINE METHOD
			expect(target.frontMostApp().alert().name()).toEqual("The entered user already exists");

			//Here it is checked if the test is passed
			if (target.frontMostApp().alert().name() == "The entered user already exists") {
				//if the test if passed, to restore the app as it was found
				target.frontMostApp().navigationBar().leftButton().tap();
				target.delay(1);
				
				
				//delete the account
				if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
					target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
				}else{
					target.frontMostApp().navigationBar().rightButton().tap();
				}		
				container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.2, y:0.2}, duration:0.25});
				
				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
				}
				
				
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
			//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}
	}); 

	///////////////////////////////////
	//Case to test
	it("existingAccount-landscape-rotate", function() {
		testName = "Login - Existing account - landscape -rotate";
		//test start
		UIALogger.logStart(testName);

		//iOs6 device need to wait a second to change the orietation
		target.delay(1);
		target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_LANDSCAPERIGHT);
		target.delay(1);


		//log in with account1
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[0].textFields()[0].setValue(serverAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		//It waits x seconds or until the connections is established, to continue the test.
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().tableViews()[0].groups()["Secure Connection Established"];
		target.popTimeout();

		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[1].textFields()[0].setValue(userAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].tap();
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue("");
		target.delay(1);
		target.frontMostApp().mainWindow().tableViews()[0].cells()[2].secureTextFields()[0].setValue(passwordAccount1);
		target.frontMostApp().keyboard().typeString("\n");

		target.delay(1);

		//scroll up, to see the button if necessary
		if(!target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].isVisible()){
			target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].scrollToVisible();
		}

		target.frontMostApp().mainWindow().tableViews()[0].cells()["Log in"].tap();

		//It waits x seconds or until the loading disappear, to continue the test. 
		target.pushTimeout(timeToPushTimeOut);
		target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
		target.popTimeout();

		////CHECK USING JASMINE METHOD
		expect(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()).toBeTruthy();

		if(target.frontMostApp().navigationBar().isValid() || target.frontMostApp().mainWindow().popover().navigationBar().isValid()){
		//if it's possible to login with the first account, the test keep on running
			//Here we detect if it the display has a popover or not
			container = getContainer();

			//This is necessary after several rotation
			//container.tableViews()[0].tapWithOptions({tapOffset:{x:0.52, y:0.22}});

			//select to add a new account
			container.tabBar().buttons()["Settings"].tap();
			container.tableViews()[0].cells()["Manage Accounts"].tap();
			container.tableViews()[0].cells()["Add new account"].tap();

			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//log in with the other account
			tableViewContainer.cells()[0].textFields()[0].tap();
			tableViewContainer.cells()[0].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[0].textFields()[0].setValue(serverAccount1);
			target.frontMostApp().keyboard().typeString("\n");

			//It waits x seconds or until the connections is established, to continue the test.
			target.pushTimeout(timeToPushTimeOut);
			tableViewContainer.groups()["Secure Connection Established"];
			target.popTimeout();

			tableViewContainer.cells()[1].textFields()[0].tap();
			tableViewContainer.cells()[1].textFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[1].textFields()[0].setValue(userAccount1);
			target.frontMostApp().keyboard().typeString("\n");

			tableViewContainer.cells()[2].secureTextFields()[0].tap();
			tableViewContainer.cells()[2].secureTextFields()[0].setValue("");
			target.delay(1);
			tableViewContainer.cells()[2].secureTextFields()[0].setValue(passwordAccount1);
			target.frontMostApp().keyboard().typeString("\n");
			
			target.delay(1);

			//scroll up, to see the button if necessary
			if(!tableViewContainer.cells()[3].isVisible()){
				tableViewContainer.cells()[3].scrollToVisible();
			}

			target.setDeviceOrientation(UIA_DEVICE_ORIENTATION_PORTRAIT);
			//Here we detect if it the display has a popover or not
			container = getContainer();
			//get the correct tableview, it depends on the device and the orientation
			tableViewContainer = getTableViewContainer(target);

			//if it's an ipad and in portrait, the popover is in the front, so we dismiss
			if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
				target.frontMostApp().mainWindow().popover().dismiss();
			}


			tableViewContainer.cells()[3].tap();



			//It waits x seconds or until the loading disappear, to continue the test. 
			target.pushTimeout(timeToPushTimeOut);
			target.frontMostApp().mainWindow().activityIndicators()["In progress"].waitForInvalid() == true;
			target.popTimeout();
			

			////CHECK USING JASMINE METHOD
			expect(target.frontMostApp().alert().name()).toEqual("The entered user already exists");

			//Here it is checked if the test is passed
			if (target.frontMostApp().alert().name() == "The entered user already exists") {
				//if the test if passed, to restore the app as it was found
				target.frontMostApp().navigationBar().leftButton().tap();
				//if it's an ipad and in portrait, the popover is hidden, so we show it
				if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
					target.frontMostApp().toolbar().buttons()[0].tap();
					if(target.frontMostApp().mainWindow().popover().navigationBar().name()!="Manage Accounts"){
						container.tabBar().buttons()["Settings"].tap();
					}
				}
				target.delay(1);
				
						
				//delete the account
				if(isDeviceiPad(target) && target.deviceOrientation()== UIA_DEVICE_ORIENTATION_PORTRAIT){
					target.frontMostApp().mainWindow().popover().navigationBar().rightButton().tap();
				}else{
					target.frontMostApp().navigationBar().rightButton().tap();
				}		
				container.tableViews()[0].cells()[idCellAccount1].switches()["Delete "+idCellAccount1].setValue(true);
				//container.tableViews()[0].cells()[idCellAccount1].dragInsideWithOptions({startOffset:{x:0.87, y:0.2}, endOffset:{x:0.0, y:0.2}, duration:0.25});

				if(isIos6(target)){
					//With ios6, intruments doesn't find delete button so it has to be implement like that
					//container.tableViews()[0].cells()[idCellAccount1].buttons()["More info, "+ idCellAccount1].tap();
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Confirm Deletion for "+ idCellAccount1].tap();
				}else{
					container.tableViews()[0].cells()[idCellAccount1].buttons()["Delete"].tap();
				}
			
				target.delay(1);
				UIALogger.logPass(testName);
			}else{
				UIALogger.logFail(testName);
			}
		}else{
		//if it's not possible to login with the first account, the test fails
			UIALogger.logFail(testName);
		}

	}); 


});
