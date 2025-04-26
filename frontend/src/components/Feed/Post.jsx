import React from 'react';
import PostInteractions from './PostInteractions';

const Post = ({ post, onUpdate, loggedUserId }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-2">
        <img
          src={post.user?.profilePicture || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{post.user?.name || 'Anonymous'}</h3>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="mb-4 text-gray-700">{post.description}</p>

      {post.media && post.media.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {post.media.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post media ${index + 1}`}
              className="h-48 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <PostInteractions post={post} onUpdate={onUpdate} loggedUserId={loggedUserId} />
    </div>
  );
};

export default Post;