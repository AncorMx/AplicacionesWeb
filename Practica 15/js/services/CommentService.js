const BASE_URL = 'http://localhost:8080/PostsAPI/api';

class CommentService {
    static getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    static async addComment(postId, content) {
        const res = await fetch(`${BASE_URL}/comments`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ postId, content })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al añadir comentario');
        return data;
    }
}

export default CommentService;
