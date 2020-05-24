// function hideFucn(){
// $('.startHidden').hide();
// }

var  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var d = new Date();
var month = monthNames[d.getMonth()];
var date = d.getDate();
var year = d.getFullYear();


// Comment
// $("input").hide();

$(".comment").click(function(){
	console.log("clicked")
	$(".startHidden").fadeToggle();
});



