import React, { useState } from 'react';
import { ArrowUpward, ArrowDownward, Reply, Edit, Delete } from '@mui/icons-material';
import { Button, TextField, Card, CardContent, Typography, Avatar, IconButton, Box } from '@mui/material';

interface CommentProps {
  comment: {
    id: number;
    username: string;
    text: string;
    upvotes: number;
    downvotes: number;
    replies?: CommentProps['comment'][];
  };
  onReply: (id: number, text: string) => void;
  onVote: (id: number, type: 'up' | 'down') => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  isTopLevel?: boolean;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, onVote, onEdit, onDelete, isTopLevel = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.text);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleEdit = () => {
    onEdit(comment.id, editedComment);
    setIsEditing(false);
  };

  const handleReply = () => {
    if (replyText) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
            {comment.username[0]}
          </Avatar>
          <Typography variant="subtitle1">{comment.username}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {comment.text}
        </Typography>
        {isEditing ? (
          <Box mb={2}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button onClick={handleEdit} variant="contained" size="small" sx={{ mt: 1, mr: 1 }}>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outlined" size="small" sx={{ mt: 1 }}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" mb={1}>
            <IconButton onClick={() => onVote(comment.id, 'up')}>
              <ArrowUpward />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 1 }}>
              {comment.upvotes - comment.downvotes}
            </Typography>
            <IconButton onClick={() => onVote(comment.id, 'down')}>
              <ArrowDownward />
            </IconButton>
            {isTopLevel && (
              <IconButton onClick={() => setShowReplyInput(!showReplyInput)}>
                <Reply />
              </IconButton>
            )}
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(comment.id)}>
              <Delete />
            </IconButton>
          </Box>
        )}
        {showReplyInput && (
          <Box mb={2}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button onClick={handleReply} variant="contained" size="small" sx={{ mt: 1, mr: 1 }}>
              Reply
            </Button>
            <Button onClick={() => setShowReplyInput(false)} variant="outlined" size="small" sx={{ mt: 1 }}>
              Cancel
            </Button>
          </Box>
        )}
        {comment.replies && comment.replies.map(reply => (
          <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onVote={onVote}
            onEdit={onEdit}
            onDelete={onDelete}
            isTopLevel={false}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default Comment;