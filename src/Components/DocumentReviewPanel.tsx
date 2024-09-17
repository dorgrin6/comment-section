import React, { useState } from 'react';
import Comment from './Comment';

interface CommentType {
  id: number;
  username: string;
  text: string;
  upvotes: number;
  downvotes: number;
  replies?: CommentType[];
}

const initialComments: CommentType[] = [
  { id: 1, username: 'User1', text: 'This is a comment', upvotes: 0, downvotes: 0, replies: [] },
  { id: 2, username: 'User2', text: 'This is another comment', upvotes: 0, downvotes: 0, replies: [] },
];

const DocumentReviewPanel: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>(initialComments);

  const handleReply = (id: number, text: string): void => {
    const addReply = (comments: CommentType[], id: number, reply: CommentType): CommentType[] => {
      return comments.map(comment => {
        if (comment.id === id) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        } else if (comment.replies) {
          return {
            ...comment,
            replies: addReply(comment.replies, id, reply),
          };
        }
        return comment;
      });
    };

    const newReply: CommentType = {
      id: comments.length + 1,
      username: 'CurrentUser', // Replace with the actual current user
      text,
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };

    setComments(prevComments => addReply(prevComments, id, newReply));
  };

  const handleVote = (id: number, type: 'up' | 'down'): void => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === id) {
          if (type === 'up') {
            return { ...comment, upvotes: comment.upvotes + 1 };
          } else {
            return { ...comment, downvotes: comment.downvotes + 1 };
          }
        } else if (comment.replies) {
          return {
            ...comment,
            replies: handleVoteRecursive(comment.replies, id, type),
          };
        }
        return comment;
      })
    );
  };

  const handleVoteRecursive = (comments: CommentType[], id: number, type: 'up' | 'down'): CommentType[] => {
    return comments.map((comment) => {
      if (comment.id === id) {
        if (type === 'up') {
          return { ...comment, upvotes: comment.upvotes + 1 };
        } else {
          return { ...comment, downvotes: comment.downvotes + 1 };
        }
      } else if (comment.replies) {
        return {
          ...comment,
          replies: handleVoteRecursive(comment.replies, id, type),
        };
      }
      return comment;
    });
  };

  const handleEdit = (id: number, text: string): void => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, text } : comment
      )
    );
  };

  const handleDelete = (id: number): void => {
    const deleteComment = (comments: CommentType[], id: number): CommentType[] => {
      return comments
        .filter(comment => comment.id !== id)
        .map(comment => ({
          ...comment,
          replies: comment.replies ? deleteComment(comment.replies, id) : [],
        }));
    };

    setComments(prevComments => deleteComment(prevComments, id));
  };

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={handleReply}
          onVote={handleVote}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default DocumentReviewPanel;