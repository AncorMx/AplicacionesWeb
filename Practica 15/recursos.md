# 1

<img class="avatar" src="https://ui-avatars.com/api/?name=&background=4F46E5&color=fff" alt="Profile">
<div class="composer-trigger" id="open-post-modal">
    ¿Qué estás pensando, ?
</div>

# 2

<div class="post-header">
    <img class="avatar" src="https://ui-avatars.com/api/?name=${post.authorName || 'Usuario'}&background=random"
        alt="Avatar">
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
        <img class="avatar" style="width: 32px; height: 32px;"
            src="https://ui-avatars.com/api/?name=${c.authorName || 'U'}&background=random" alt="Avatar">
        <div class="comment-bubble">
            <div class="comment-user">${c.authorName || 'Usuario'}</div>
            <div class="comment-text">${c.content}</div>
        </div>
    </div>
    `).join('') : ''}
    <form class="comment-form" data-post-id="${post.id}">
        <img class="avatar" style="width: 32px; height: 32px;"
            src="https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=4F46E5&color=fff" alt="Avatar">
        <input type="text" class="comment-input" placeholder="Escribe un comentario..." required>
    </form>
</div>

# 3

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
                <textarea id="post-content" placeholder="¿Qué estás pensando?"
                    style="width: 100%; min-height: 150px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); resize: none; font-size: 1.1rem; outline: none;"
                    required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Publicar</button>
        </form>
    </div>
</div>