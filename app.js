$(document).ready(function() {

    //Initializing firebase config
    var firebaseConfig = {
      apiKey: "AIzaSyBaiMYmOcN-vOcqP2BlC-fA5O-mtDzV6Gg",
    	authDomain: "student-project-87891.firebaseapp.com",
    	databaseURL: "https://student-project-87891.firebaseio.com",
    	projectId: "student-project-87891",
			storageBucket: "student-project-87891.appspot.com",
   	  messagingSenderId: "191690436001",
    	appId: "1:191690436001:web:a08625b72a960e1b4d6fe0"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initializing var to ref the database
    var database = firebase.database();
	
    $("#add-train-btn").on("click", function(event){
        event.preventDefault();
        
        // grabs inputs from form
        var trainName = $(".train-input").val().trim();
        var trainTo = $(".to-input").val().trim();
        var trainFrom = $(".from-input").val().trim();
        var trainTime = $(".time-input").val().trim();
        var trainFreq = $(".freq-input").val().trim();
        
        // ensure time is correct format and make sure it is before current time for math
        var timeConvert = moment(trainTime, "HH:mm").subtract(1, "year"); console.log(timeConvert);
        
        // log current time
        var currentTime = moment();
        
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm")); //for ftp
        
        // logging the difference 
        var diffTime = moment().diff(moment(timeConvert), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime); //for ftp
        
        // finding the modulus
        var remainTime = diffTime % trainFreq;
        console.log(remainTime); // for ftp
        
        // finding how much time left
        var minsAway = trainFreq - remainTime;
        console.log("mins til next train: " + minsAway); //for ftp
        
        // adding mins til next train train
        var nextTrainMath = moment().add(minsAway, "minutes");
        console.log("arrival time: " + moment(nextTrainMath).format("hh:mm")); //for ftp
        
        // final next train time
        var nextTrain = moment(nextTrainMath).format("hh:mm");
        console.log("arrival time: " + nextTrain); //for ftp

        // created local temp copy of newTrain object
        var newTrain = {
            train: trainName,
            to: trainTo,
            from: trainFrom,
            freq: trainFreq,
            min: minsAway,
            time: nextTrain
        };
        
        // push to database
        database.ref().push(newTrain);
        
        // Console log for FTP
        console.log(newTrain.train);
        console.log(newTrain.to);
        console.log(newTrain.from);
        console.log(newTrain.freq);
        console.log(newTrain.min);
        console.log(newTrain.time);
        
        alert("New train added!");
        
        // Clears the form
        $(".form-control").val("");
        
        database.ref().on("child_added", function(childSnapshot) {
            console.log(childSnapshot.val());
            
            // store the database values back into the vars
            var trainName = childSnapshot.val().train;
            var trainTo = childSnapshot.val().to;
            var trainFrom = childSnapshot.val().from;
            var trainFreq = childSnapshot.val().freq;
            var minsAway = childSnapshot.val().min;
            var nextTrain = childSnapshot.val().time;
            
            // Console log for FTP only
            console.log(trainName);
            console.log(trainTo);
            console.log(trainFrom);
            console.log(trainFreq);
            console.log(trainTime);
            console.log(minsAway);
            console.log(nextTrain);
            
            // create new row and append database pull
            var newRow = $("<tr>").append(
                $("<td>").text(moment(nextTrain).format("hh:mm")),
                $("<td>").text(trainName),
                $("<td>").text(trainTo),
                $("<td>").text(trainFrom),
                $("<td>").text(trainFreq),
                $("<td>").text(minsAway),
            );
            
            $("tbody").empty();
            // append new row to table
            $("tbody").append(newRow);
        });
    });		
});

