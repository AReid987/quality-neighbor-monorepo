'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  sectionId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  timestamp: string;
}

interface CommentSectionProps {
  sectionId: string;
}

export const CommentSection = ({ sectionId }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load comments from localStorage
    const savedComments = localStorage.getItem(`comments_${sectionId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [sectionId]);

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`comments_${sectionId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const addComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      sectionId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment('');
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    saveComments(updatedComments);
  };

  const canDeleteComment = (comment: Comment) => {
    return user?.role === 'admin' || comment.userId === user?.id;
  };

  return (
    <div className="mt-6 border-t pt-6">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <MessageCircle className="h-4 w-4" />
        Comments ({comments.length})
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Add Comment Form */}
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px] resize-none"
              />
              <Button
                onClick={addComment}
                className="mt-2 h-8"
                size="sm"
                disabled={!newComment.trim()}
              >
                <Send className="h-3 w-3 mr-1" />
                Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <Card key={comment.id} className="bg-gray-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                        {comment.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-800">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {comment.userRole}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                    {canDeleteComment(comment) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteComment(comment.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};