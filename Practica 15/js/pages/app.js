import AuthService from '../services/AuthService.js';
import PostService from '../services/PostService.js';
import CommentService from '../services/CommentService.js';

// Auth Guard (Run immediately)
if (!AuthService.isAuthenticated()) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const postsContainer = document.getElementById('posts-container');
    const composerUserInfo = document.getElementById('composer-user-info');
    const logoutBtn = document.getElementById('logout-btn');

    // Start
    if (AuthService.isAuthenticated()) {
        initFeed();
    } else {
        window.location.href = 'login.html';
    }

    function initFeed() {
        const user = AuthService.getUser();
        if (!user) return;

        // Render Composer Header
        composerUserInfo.innerHTML = `
            <img class="avatar" src="https://ui-avatars.com/api/?name=${user.name || user.email || 'User'}&background=4F46E5&color=fff" alt="Profile">
            <div class="composer-trigger" id="open-post-modal">
                ¿Qué estás pensando, ${user.name || user.email.split('@')[0]}?
            </div>
        `;

        document.getElementById('open-post-modal').addEventListener('click', showPostModal);

        logoutBtn.addEventListener('click', () => {
            AuthService.logout();
            window.location.href = 'login.html';
        });

        loadPosts();
    }

    async function loadPosts() {
        const user = AuthService.getUser();
        try {
            const posts = await PostService.getAll();
            postsContainer.innerHTML = posts.length ? '' : '<p style="text-align:center; color: var(--text-sub);">No hay posts aún.</p>';

            posts.reverse().forEach(post => {
                const postEl = document.createElement('div');
                postEl.className = 'post-card fade-in';
                postEl.innerHTML = `
                    <div class="post-header">
                        <img class="avatar" src="https://ui-avatars.com/api/?name=${post.authorName || 'Usuario'}&background=random" alt="Avatar">
                        <div class="post-user-info">
                            <h3>${post.authorName || 'Usuario'}</h3>
                            <span>${post.createdAt || 'Hace un momento'}</span>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-title">${post.title}</div>
                        <p>${post.content}</p>
                    </div>
                    <div class="post-actions">
                        <button class="action-btn"><i class="far fa-thumbs-up"></i> Me gusta</button>
                        <button class="action-btn comment-trigger"><i class="far fa-comment"></i> Comentar</button>
                    </div>
                    <div class="comments-section" id="comments-${post.id}">
                        ${post.comments ? post.comments.map(c => `
                            <div class="comment">
                                <img class="avatar" style="width: 32px; height: 32px;" src="https://ui-avatars.com/api/?name=${c.authorName || 'U'}&background=random" alt="Avatar">
                                <div class="comment-bubble">
                                    <div class="comment-user">${c.authorName || 'Usuario'}</div>
                                    <div class="comment-text">${c.content}</div>
                                </div>
                            </div>
                        `).join('') : ''}
                        <form class="comment-form" data-post-id="${post.id}">
                            <img class="avatar" style="width: 32px; height: 32px;" src="https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=4F46E5&color=fff" alt="Avatar">
                            <input type="text" class="comment-input" placeholder="Escribe un comentario..." required>
                        </form>
                    </div>
                `;

                const commentForm = postEl.querySelector('.comment-form');
                commentForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const input = e.target.querySelector('input');
                    const content = input.value;
                    try {
                        await CommentService.addComment(post.id, content);
                        input.value = '';
                        loadPosts(); // Refresh posts
                    } catch (err) {
                        alert(err.message);
                    }
                });

                postsContainer.appendChild(postEl);
            });
        } catch (err) {
            postsContainer.innerHTML = `<p style="color: red; text-align: center;">Error al cargar posts: ${err.message}</p>`;
        }
    }

    function showPostModal() {
        const modalRoot = document.getElementById('modal-root');
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content fade-in">
                <div class="modal-header">
                    <h2>Crear publicación</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="create-post-form">
                        <div class="form-group">
                            <input type="text" id="post-title" placeholder="Título de tu post" required>
                        </div>
                        <div class="form-group">
                            <textarea id="post-content" placeholder="¿Qué estás pensando?" style="width: 100%; min-height: 150px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); resize: vertical;" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Publicar</button>
                    </form>
                </div>
            </div>
        `;

        const close = () => modal.remove();
        modal.querySelector('.close-modal').addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

        const createPostForm = modal.querySelector('#create-post-form');
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('post-title').value;
            const content = document.getElementById('post-content').value;
            try {
                await PostService.create(title, content);
                close();
                loadPosts();
            } catch (err) {
                alert(err.message);
            }
        });

        modalRoot.appendChild(modal);
    }
});
