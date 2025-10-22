import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from '../../lib/axios';

const keywords = [
  'business', 'consulting', 'ai', 'prompts', 'easy-to-use',
  'powerful', 'innovative', 'time-saving', 'professional', 'helpful'
];

export const FeedbackDialog = ({ open, onOpenChange, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      
      await axios.post('/api/feedback', {
        rating,
        comment: comment.trim() || null,
        keywords: selectedKeywords.length > 0 ? selectedKeywords : null
      });

      toast.success('Thank you for your feedback!');
      
      // Reset form
      setRating(0);
      setComment('');
      setSelectedKeywords([]);
      
      // Close dialog and trigger success callback
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="feedback-dialog">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve the Omega Agent Generator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rating</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  data-testid={`feedback-rating-${star}`}
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      (hoveredRating || rating) >= star
                        ? 'fill-accent text-accent'
                        : 'text-muted stroke-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 5 && 'Excellent! ⭐'}
                {rating === 4 && 'Very good! 😊'}
                {rating === 3 && 'Good 👍'}
                {rating === 2 && 'Could be better'}
                {rating === 1 && 'Needs improvement'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="feedback-comment" className="text-sm font-medium text-foreground">
              Comments (optional)
            </label>
            <Textarea
              id="feedback-comment"
              placeholder="What did you think of the Omega prompt? Any suggestions?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
              data-testid="feedback-comment"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quick tags (optional)</label>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant={selectedKeywords.includes(keyword) ? 'default' : 'outline'}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleKeyword(keyword)}
                  data-testid={`feedback-keyword-${keyword}`}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            data-testid="feedback-cancel-button"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            data-testid="feedback-submit-button"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;