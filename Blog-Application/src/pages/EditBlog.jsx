import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  PenSquare,
  Image as ImageIcon,
  Video,
  User,
  Tag,
  AlertCircle,
  ArrowLeft,
  Edit3
} from 'lucide-react';
import { blogService } from '../services/api';
import { useToast } from '../context/ToastContext';
import VideoPlayer from '../components/VideoPlayer';
import Loading from '../components/Loading';
import {
  CATEGORIES,
  countWords,
  DEFAULT_FALLBACK_IMAGE,
  getEmbedVideoUrl
} from '../utils/helpers';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    image: '',
    video: '',
    content: '',
    createdAt: ''
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imgPreviewError, setImgPreviewError] = useState(false);

  // Fetch current blog data
  useEffect(() => {
    let isMounted = true;
    async function loadBlog() {
      setInitialLoading(true);
      setLoadError(null);
      try {
        const data = await blogService.getBlogById(id);
        if (isMounted) {
          setFormData({
            title: data.title || '',
            author: data.author || '',
            category: data.category || '',
            image: data.image || '',
            video: data.video || '',
            content: data.content || '',
            createdAt: data.createdAt || new Date().toISOString().split('T')[0]
          });
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err.response?.status === 404
              ? 'Blog post not found.'
              : 'Failed to load blog data from JSON Server.'
          );
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    }
    loadBlog();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Compute live word count
  const wordCount = useMemo(() => countWords(formData.content), [formData.content]);
  const isOverWordLimit = wordCount > 1000;
  const isNearLimit = wordCount >= 850 && wordCount <= 1000;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'image') {
      setImgPreviewError(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation
  const errors = useMemo(() => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Blog title is required.';
    } else if (formData.title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters.';
    }

    if (!formData.author.trim()) {
      errs.author = 'Author name is required.';
    }

    if (!formData.category) {
      errs.category = 'Please select a category.';
    }

    if (!formData.image.trim()) {
      errs.image = 'Featured image URL is required.';
    } else if (!/^https?:\/\/.+/i.test(formData.image.trim())) {
      errs.image = 'Please enter a valid HTTP/HTTPS image URL.';
    }

    if (!formData.content.trim()) {
      errs.content = 'Blog content cannot be empty.';
    } else if (wordCount > 1000) {
      errs.content = 'Content exceeds maximum limit of 1000 words.';
    }

    return errs;
  }, [formData, wordCount]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      title: true,
      author: true,
      category: true,
      image: true,
      content: true
    });

    if (!isFormValid) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError || 'Please resolve validation errors before saving.');
      return;
    }

    if (isOverWordLimit) {
      toast.error('Cannot save: Content exceeds 1000 words.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        image: formData.image.trim(),
        video: formData.video.trim(),
        content: formData.content.trim(),
        createdAt: formData.createdAt || new Date().toISOString().split('T')[0]
      };

      const updated = await blogService.updateBlog(id, payload);
      toast.success('Blog post updated successfully!');
      navigate(`/blogs/${updated.id || id}`);
    } catch (err) {
      const msg = err.code === 'ERR_NETWORK'
        ? 'Cannot connect to JSON Server. Make sure "npm run server" is running.'
        : (err.response?.data?.message || 'Failed to update blog. Please try again.');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const embedVideoUrl = useMemo(() => getEmbedVideoUrl(formData.video), [formData.video]);

  if (initialLoading) {
    return (
      <div className="container form-page-container">
        <Loading type="spinner" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container details-error-container">
        <div className="error-card">
          <AlertCircle size={42} className="error-icon" />
          <h2 className="error-title">Cannot Edit Post</h2>
          <p className="error-message">{loadError}</p>
          <div className="error-actions">
            <Link to="/blogs" className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Back to Blogs</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page-root">
      <div className="container form-page-container">
        <div className="form-page-top">
          <Link to={`/blogs/${id}`} className="btn-back">
            <ArrowLeft size={16} />
            <span>Cancel and Return to Post</span>
          </Link>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <div className="form-header-badge">
              <Edit3 size={15} />
              <span>Editing Mode</span>
            </div>
            <h1 className="form-page-title">Edit Blog Post</h1>
            <p className="form-page-subtitle">
              Update blog post details, media links, and body content while adhering to the 1000-word constraint.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="blog-editor-form">
            <div className="form-grid-2">
              {/* Blog Title */}
              <div className="form-group">
                <label htmlFor="edit-title" className="form-label">
                  Blog Title <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <PenSquare size={18} className="input-icon" />
                  <input
                    id="edit-title"
                    name="title"
                    type="text"
                    className={`form-input ${touched.title && errors.title ? 'is-invalid' : ''}`}
                    placeholder="Enter blog title..."
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={() => handleBlur('title')}
                    disabled={submitting}
                  />
                </div>
                {touched.title && errors.title && (
                  <span className="field-error-msg">{errors.title}</span>
                )}
              </div>

              {/* Author Name */}
              <div className="form-group">
                <label htmlFor="edit-author" className="form-label">
                  Author Name <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    id="edit-author"
                    name="author"
                    type="text"
                    className={`form-input ${touched.author && errors.author ? 'is-invalid' : ''}`}
                    placeholder="Enter author name..."
                    value={formData.author}
                    onChange={handleChange}
                    onBlur={() => handleBlur('author')}
                    disabled={submitting}
                  />
                </div>
                {touched.author && errors.author && (
                  <span className="field-error-msg">{errors.author}</span>
                )}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="form-group">
              <label htmlFor="edit-category" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={18} className="input-icon" />
                <select
                  id="edit-category"
                  name="category"
                  className={`form-select ${touched.category && errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={() => handleBlur('category')}
                  disabled={submitting}
                >
                  <option value="">Select a Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {touched.category && errors.category && (
                <span className="field-error-msg">{errors.category}</span>
              )}
            </div>

            {/* Featured Image URL & Preview */}
            <div className="form-group">
              <label htmlFor="edit-image" className="form-label">
                Featured Image URL <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <ImageIcon size={18} className="input-icon" />
                <input
                  id="edit-image"
                  name="image"
                  type="url"
                  className={`form-input ${touched.image && errors.image ? 'is-invalid' : ''}`}
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                  onBlur={() => handleBlur('image')}
                  disabled={submitting}
                />
              </div>
              {touched.image && errors.image && (
                <span className="field-error-msg">{errors.image}</span>
              )}

              {/* Live Image Preview */}
              {formData.image && (
                <div className="preview-container image-preview-box">
                  <span className="preview-label">Live Image Preview:</span>
                  <div className="preview-image-frame">
                    <img
                      src={imgPreviewError ? DEFAULT_FALLBACK_IMAGE : formData.image}
                      alt="Featured Preview"
                      className="preview-img-element"
                      onError={() => setImgPreviewError(true)}
                    />
                    {imgPreviewError && (
                      <div className="preview-warning-badge">
                        Image URL not reachable; displaying placeholder
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Optional Video URL & Preview */}
            <div className="form-group">
              <label htmlFor="edit-video" className="form-label">
                Video URL <span className="optional-badge">(Optional)</span>
              </label>
              <div className="input-with-icon">
                <Video size={18} className="input-icon" />
                <input
                  id="edit-video"
                  name="video"
                  type="url"
                  className="form-input"
                  placeholder="https://www.youtube.com/watch?v=... or Vimeo"
                  value={formData.video}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <span className="field-helper-text">
                Supports YouTube watch links, YouTube shorts, and Vimeo URLs.
              </span>

              {formData.video && embedVideoUrl && (
                <div className="preview-container video-preview-box">
                  <span className="preview-label">Live Video Embed Preview:</span>
                  <VideoPlayer videoUrl={formData.video} title="Preview Video" />
                </div>
              )}
            </div>

            {/* Content & Word Count */}
            <div className="form-group">
              <div className="content-label-row">
                <label htmlFor="edit-content" className="form-label">
                  Blog Content <span className="required-star">*</span>
                </label>
                <div
                  className={`word-counter-badge ${
                    isOverWordLimit
                      ? 'counter-error'
                      : isNearLimit
                      ? 'counter-warning'
                      : 'counter-normal'
                  }`}
                  aria-live="polite"
                >
                  <span>{wordCount} / 1000 Words</span>
                </div>
              </div>

              <div className="textarea-wrapper">
                <textarea
                  id="edit-content"
                  name="content"
                  rows={14}
                  className={`form-textarea ${
                    (touched.content && errors.content) || isOverWordLimit ? 'is-invalid' : ''
                  }`}
                  placeholder="Update your article content here..."
                  value={formData.content}
                  onChange={handleChange}
                  onBlur={() => handleBlur('content')}
                  disabled={submitting}
                />
              </div>

              {isOverWordLimit ? (
                <div className="word-limit-alert error">
                  <AlertCircle size={16} />
                  <span>Word limit exceeded! Content must not exceed 1000 words to save.</span>
                </div>
              ) : isNearLimit ? (
                <div className="word-limit-alert warning">
                  <AlertCircle size={16} />
                  <span>Approaching word limit ({1000 - wordCount} words remaining).</span>
                </div>
              ) : null}

              {touched.content && errors.content && !isOverWordLimit && (
                <span className="field-error-msg">{errors.content}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="form-actions-bar">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/blogs/${id}`)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || isOverWordLimit}
              >
                {submitting ? 'Saving Changes...' : 'Update Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

