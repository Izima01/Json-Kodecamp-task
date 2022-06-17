let postHolder = document.querySelector('#postHolder');
let barkForm = document.querySelector('#bark-form');
let title = document.querySelector('#title');
let body = document.querySelector('#body');

let postArray = [];

function getPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            console.log(postArray)
            postArray = data
            console.log(postArray)
            renderUI(postArray)
        })
};

getPosts();

barkForm.addEventListener('submit', Bark)

function Bark(e) {
    e.preventDefault();
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: title.value,
            body: body.value,
            userId: 2,
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            postArray.unshift(data);

            console.log(postArray)
            renderUI(postArray)
        });
}   

// // Updating a Post
function editBark(id) {
    console.log(id)
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: title.value,
            body: body.value,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            let postTitles = document.querySelectorAll(".postTitle");
            let postBodies = document.querySelectorAll(".postBody");

            postTitles.forEach((postTitle, index) => {
                if (index + 1 === id) {
                    if (data.title !== "") {
                        console.log(data.title)
                        postTitle.innerHTML = data.title;
                    }
                }
            });

            postBodies.forEach((postBody, index) => {
                if (index + 1 === id) {
                    if (data.body !== "") {
                        console.log(data.body)
                        postBody.innerHTML = data.body
                    }
                }
            });
        })
}


// Deleting a Post
function deleteBark(id) {
    console.log(id)
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            postArray = postArray.filter(post => post.id !== id)
            console.log(postArray)
            renderUI(postArray)
        })
}


function noDeleteBark() {
    document.querySelector('.deleteBox').style= "visibility: hidden;"
}

// Creating a function to confirm if you want to delete the post
function confirmDelete(id) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    document.querySelector('.deleteBox').style= "visibility: visible;"
    document.querySelector("#deleteID").innerHTML= id
    document.querySelector(".yesBtn").setAttribute('onclick', `deleteBark(${id})`)
    document.querySelector(".noBtn").setAttribute('onclick', `noDeleteBark()`)
    console.log(id)
}

function renderUI(array) {
    let postWrapper = ' ';
    array.forEach(post => {
        postWrapper += 
            `<div class="post">
                <div class="deleteBox">
                    <h4>Are you sure you want to delete post ID <span id="deleteID"></span></h4>
                    <div class="d-flex justify-content-between pt-2">
                        <button class="yesBtn btn btn-outline-danger px-4">Yes</button>
                        <button class="noBtn btn btn-outline-success px-4">No</button>
                    </div>
                </div>
                <div class="info w-100 h-auto row pb-3 d-flex align-items-center">
                    <div class="col-lg-3 col-md-4 col-4">
                        <img src="images/writer${Math.floor(post.id/10)}.jpg" class="ps-lg-2 img-fluid rounded-circle w-75" alt="">
                    </div>
                    <div class="col-lg-8 col-md-6 col-6">
                        <h4 class="text-center ps-sm-0">Izzy Ezinne</h4>
                    </div>
                    <div class="col-lg-1 col-md-2 col-2" id="postID">
                        <h4 class="pe-md-2 ps-sm-auto">${post.id}</h4>
                    </div>
                </div>
                <div>
                    <h5 class="postTitle">${post.title}</h5>
                    <p class="postBody">${post.body}</p>
                </div>
                <button class="updateBtn btn btn-primary px-3" onclick="editBark(${post.id})">Update</button>
                <button class="deleteBtn btn btn-danger px-3" onclick="confirmDelete(${post.id})">Delete</button>
            </div>`
    });
    postHolder.innerHTML = postWrapper;
}