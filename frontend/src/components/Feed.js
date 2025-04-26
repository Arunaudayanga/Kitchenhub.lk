import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaBookmark, FaUser, FaImage, FaTimes } from 'react-icons/fa';
import postService from '../services/postService';
import authService from '../services/authService';

const Feed = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      console.log(response)
      setPosts(response.content || []);
    } catch (error) {
      setError('Failed to load posts');
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }
    
    const newFiles = files.filter(file => file.type.startsWith('image/'));
    if (newFiles.length !== files.length) {
      alert('Only image files are allowed');
    }

    setSelectedFiles([...selectedFiles, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!newPost.trim() && selectedFiles.length === 0) return;

    setIsSubmitting(true);
    try {
      await postService.createPost(newPost, selectedFiles);
      setNewPost('');
      setSelectedFiles([]);
      setPreviewUrls([]);
      loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await postService.likePost(postId);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const updatedPost = await postService.unlikePost(postId);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  const handleComment = async (postId) => {
    const content = prompt('Add a comment:');
    if (!content) return;

    try {
      const updatedPost = await postService.addComment(postId, content);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Create Post Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <FaUser className="h-10 w-10 text-gray-400" />
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your learning journey..."
              rows="3"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            
            {/* Image Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="mt-4">
                <div className={`grid ${previewUrls.length === 1 ? 'grid-cols-1' : previewUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                      >
                        <FaTimes className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => document.getElementById('file-input').click()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                >
                  <FaImage className="text-xl" />
                  <span>Add images</span>
                </button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (!newPost.trim() && selectedFiles.length === 0)}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser className="text-gray-500 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{post.user?.username || 'Anonymous'}</h3>
                <p className="text-sm text-gray-500">{post.createdAt}</p>
              </div>
            </div>

            <p className="text-gray-800 mb-4">{post.description}</p>

            {/* Post Images */}
            {post.media && post.media.length > 0 && (
              <div className={`grid ${post.media.length === 1 ? 'grid-cols-1' : post.media.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2 mb-4`}>
                {post.media.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-6">
                <button 
                  onClick={() => post.liked ? handleUnlike(post.id) : handleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                >
                  <FaHeart className="text-xl" />
                  <span>{post.likeCount || 0}</span>
                </button>
                <button 
                  onClick={() => handleComment(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <FaComment className="text-xl" />
                  <span>{post.commentCount || 0}</span>
                </button>
                <button className="text-gray-500 hover:text-blue-500 transition-colors">
                  <FaShare className="text-xl" />
                </button>
              </div>
              <button className="text-gray-500 hover:text-blue-500 transition-colors">
                <FaBookmark className="text-xl" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Feed;