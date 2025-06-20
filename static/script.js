// Fetch and display users
function loadUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';  // Clear existing items
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.textContent = `ID: ${user[0]}, Name: ${user[1]}, Email: ${user[2]}`;
                usersList.appendChild(userItem);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

// Fetch and display posts
function loadPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById('posts-list');
            postsList.innerHTML = '';  // Clear existing items
            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');
                postItem.innerHTML = `
                    <p><strong>User ID:</strong> ${post[1]}</p>
                    <p><strong>Post Date:</strong> ${post[2]}</p>
                    <button onclick="likePost(${post[0]})">Like</button>
                `;
                postsList.appendChild(postItem);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// Like a post
function likePost(postId) {
    fetch(`/like/${postId}`, { method: 'POST' })
        .then(() => {
            alert('Post liked!');
            loadPosts();  // Reload posts to show updated like count
        })
        .catch(error => console.error('Error liking post:', error));
}

// Fetch and display likes
function loadLikes() {
    fetch('/api/likes')
        .then(response => response.json())
        .then(likes => {
            const likesList = document.getElementById('likes-list');
            likesList.innerHTML = '';  // Clear existing items
            likes.forEach(like => {
                const likeItem = document.createElement('div');
                likeItem.textContent = `Like ID: ${like[0]}, Post ID: ${like[1]}, User ID: ${like[2]}, Date: ${like[3]}`;
                likesList.appendChild(likeItem);
            });
        })
        .catch(error => console.error('Error fetching likes:', error));
}

// Fetch and display shares
function loadShares() {
    fetch('/api/shares')
        .then(response => response.json())
        .then(shares => {
            const sharesList = document.getElementById('shares-list');
            sharesList.innerHTML = '';  // Clear existing items
            shares.forEach(share => {
                const shareItem = document.createElement('div');
                shareItem.textContent = `Share ID: ${share[0]}, Post ID: ${share[1]}, User ID: ${share[2]}, Date: ${share[3]}`;
                sharesList.appendChild(shareItem);
            });
        })
        .catch(error => console.error('Error fetching shares:', error));
}

// Load all data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadPosts();
    loadLikes();
    loadShares();
});
