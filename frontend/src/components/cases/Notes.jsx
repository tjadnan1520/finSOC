import { useState } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import { formatRelativeTime } from '../../utils/formatter';
import { ROLES } from '../../utils/constants';
import Button from '../common/Button';
import './Notes.css';

export default function Notes({ notes = [], onAddNote, userRole, loading }) {
  const [content, setContent] = useState('');
  const isOperator = userRole === ROLES.OPERATOR;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddNote?.(content.trim());
    setContent('');
  };

  const sorted = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="notes">
      <div className="notes-header">
        <FiMessageSquare size={16} />
        <h3 className="notes-title">Investigation Notes</h3>
        <span className="notes-count">{notes.length}</span>
      </div>

      {!sorted.length ? (
        <div className="notes-empty">
          <p>No notes yet</p>
        </div>
      ) : (
        <div className="notes-list">
          {sorted.map((note) => (
            <div key={note.id} className="notes-item">
              <div className="notes-item-header">
                <div className="notes-item-author">
                  <div className="notes-item-avatar">
                    {note.author?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="notes-item-meta">
                    <span className="notes-item-name">{note.author}</span>
                    <span className="notes-item-role">{note.role}</span>
                  </div>
                </div>
                <span className="notes-item-date">{formatRelativeTime(note.createdAt)}</span>
              </div>
              <p className="notes-item-content">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {isOperator && (
        <form className="notes-form" onSubmit={handleSubmit}>
          <textarea
            className="notes-textarea"
            placeholder="Add an investigation note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="notes-form-actions">
            <Button variant="primary" size="sm" type="submit" disabled={!content.trim() || loading}>
              <FiSend size={14} /> Add Note
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
