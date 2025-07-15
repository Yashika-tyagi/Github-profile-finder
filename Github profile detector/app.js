const user_img = document.querySelector(".user_img");
const username = document.querySelector(".user_name h1");
const followers = document.querySelector(".item_followers span");
const follow = document.querySelector(".item_follow span");
const repoContainer = document.querySelector(".rep_details"); // ✅ renamed to avoid conflict
const button = document.querySelector(".btn");
const error = document.querySelector(".error");

let user_name = '';

function input() {
    let input_user = document.querySelector(".name").value.trim();
    if (input_user.length <= 0) {
        alert("Please enter a valid name");
        document.querySelector(".name").value = "";
        document.querySelector(".name").focus();
        return false;
    } else {
        user_name = input_user;
        fetchUser();
        document.querySelector(".name").value = "";
        document.querySelector(".name").focus();
        error.style.display = "none"; 
    }
}

button.addEventListener("click", function () {
    input();
});

document.querySelector(".name").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        input(); 
    }
});

async function fetchUser() {
    const response = await fetch(`https://api.github.com/users/${user_name}`);
    const data = await response.json();

    if (data.message === "Not Found") {
        error.style.display = "block";
        user_img.innerHTML = `<img src="githuborg.jpeg">`; 
        repoContainer.innerHTML = ""; 
        username.innerHTML="";
        followers.innerHTML="";
        follow.innerHTML="";
        return;
    } else {
        error.style.display = "none";
        user_img.innerHTML = `<img src="${data.avatar_url}">`;
        username.innerHTML = data.login;
        followers.innerHTML = data.followers;
        follow.innerHTML = data.following;
    }

    const repoResponse = await fetch(`https://api.github.com/users/${user_name}/repos`);
    const repdata = await repoResponse.json();

    if (repdata.length <= 0) {
        repoContainer.innerHTML = "<p style='color:white'>No repositories found.</p>";
    } else {
        repoContainer.innerHTML = ""; 
        repdata.slice(0, 5).forEach(r => {
            repoContainer.innerHTML += `
                <div class="reponame">${r.name}</div>
                <div class="details">
                    <div class="info_star">
                        <i class="fa-solid fa-star"></i> ${r.stargazers_count}
                    </div>
                    <div class="info_fork">
                        <i class="fa fa-code-fork"></i> ${r.forks_count}
                    </div>
                    <div class="info_size">
                        <i class="fa fa-file"></i> ${r.size} KB
                    </div>
                </div>
            `;
        });
    }
}
