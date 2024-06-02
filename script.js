document.addEventListener('DOMContentLoaded', () => {
    const fetchPostsBtn = document.getElementById('fetch-posts-btn');
    fetchPostsBtn.addEventListener('click', fetchPosts);
});

async function fetchPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = 'Loading...';

    try {
        const posts = await fetchJSON('https://jsonplaceholder.typicode.com/posts');
        const users = await fetchJSON('https://jsonplaceholder.typicode.com/users');
        const usersMap = createUsersMap(users);

        postsContainer.innerHTML = '';
        posts.forEach(post => displayPost(post, usersMap, postsContainer));
    } catch (error) {
        postsContainer.innerHTML = 'Failed to load posts.';
        console.error(error);
    }
}

async function fetchComments(postId, commentsContainer) {
    if (commentsContainer.innerHTML) {
        commentsContainer.innerHTML = '';
        return;
    }

    commentsContainer.innerHTML = 'Loading comments...';

    try {
        const comments = await fetchJSON(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        commentsContainer.innerHTML = '';
        comments.forEach(comment => displayComment(comment, commentsContainer));
    } catch (error) {
        commentsContainer.innerHTML = 'Failed to load comments.';
        console.error(error);
    }
}

function fetchJSON(url) {
    return fetch(url).then(response => response.json());
}

function createUsersMap(users) {
    const usersMap = new Map();
    users.forEach(user => usersMap.set(user.id, user));
    return usersMap;
}

function displayPost(post, usersMap, postsContainer) {
    const user = usersMap.get(post.userId);
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
        <div class="post-title">${post.title}</div>
        <div class="post-user">By ${user.name} (${user.email})</div>
        <div class="post-body">${post.body}</div>
        <button class="view-comments-btn" data-post-id="${post.id}">View Comments</button>
        <div class="post-comments" id="comments-${post.id}"></div>
    `;
    postsContainer.appendChild(postElement);

    const viewCommentsBtn = postElement.querySelector('.view-comments-btn');
    const commentsContainer = postElement.querySelector(`#comments-${post.id}`);
    viewCommentsBtn.addEventListener('click', () => fetchComments(post.id, commentsContainer));
}

function displayComment(comment, commentsContainer) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
        <div><strong>${comment.name}</strong> (${comment.email})</div>
        <div>${comment.body}</div>
    `;
    commentsContainer.appendChild(commentElement);
}
