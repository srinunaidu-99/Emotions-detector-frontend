// ===============================
// API URLs
// ===============================
const API_URL="http://127.0.0.1:3000";


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
        document.getElementById("loginEmail").value;


        const password =
        document.getElementById("loginPassword").value;


        try {

            const res = await fetch(`${BACKEND_URL}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });



            const data = await res.json();



            if (res.ok) {

                localStorage.setItem(
                    "token",
                    data.token
                );


                alert("Login Successful 🎉");


                window.location.href = "dashboard.html";


            } else {

                alert(data.message);

            }



        } catch(error) {

            console.log(error);

            alert("Server Error ❌");

        }


    });

}





// ===============================
// REGISTER
// ===============================


const registerForm =
document.getElementById("registerForm");



if(registerForm){


registerForm.addEventListener("submit", async(e)=>{


e.preventDefault();



const name =
document.getElementById("name").value;



const email =
document.getElementById("email").value;



const password =
document.getElementById("password").value;



const confirmPassword =
document.getElementById("confirmPassword").value;



if(password !== confirmPassword){

alert("Passwords match kavatledu 😅");

return;

}



if(password.length < 8){

alert("Password minimum 8 characters undali");

return;

}




try{


const res = await fetch(`${BACKEND_URL}/register`,{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

name,

email,

password

})


});



const data = await res.json();



if(res.ok){


alert("Register Success 🎉");


window.location.href="login.html";


}

else{


alert(data.message);


}



}

catch(error){


console.log(error);


alert("Server Error ❌");


}



});


}