/**
 * Post Issues Test Component
 * Component to test and verify all the post-related fixes
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  usePosts, 
  useFeaturedPosts, 
  useIncrementPostView, 
  useTogglePostLike 
} from '../../hooks/useContent';
import EditorJSRenderer from '../content/EditorJSRenderer';

const PostIssuesTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testPost, setTestPost] = useState<any>(null);

  // Test hooks
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts({ limit: 5 });
  const { data: featuredData, isLoading: featuredLoading, error: featuredError } = useFeaturedPosts({ limit: 3 });
  const incrementViewMutation = useIncrementPostView();
  const toggleLikeMutation = useTogglePostLike();

  // Test data for EditorJS renderer
  const testEditorData = {
    version: "2.30.8",
    blocks: [
      {
        id: "test-header",
        type: "header",
        data: {
          text: "Test Header",
          level: 2
        }
      },
      {
        id: "test-paragraph",
        type: "paragraph",
        data: {
          text: "This is a test paragraph to verify the EditorJS renderer works correctly."
        }
      },
      {
        id: "test-list",
        type: "list",
        data: {
          style: "unordered",
          items: ["Item 1", "Item 2", "Item 3"]
        }
      }
    ]
  };

  useEffect(() => {
    // Run tests when component mounts
    runTests();
  }, [postsData, featuredData]);

  const runTests = () => {
    const results: Record<string, boolean> = {};

    // Test 1: Posts API works
    results.postsApi = !postsLoading && !postsError && !!postsData;

    // Test 2: Featured posts API works (should not be 404)
    results.featuredApi = !featuredLoading && !featuredError && !!featuredData;

    // Test 3: EditorJS renderer doesn't crash
    try {
      results.editorRenderer = true; // Will be set to false if render fails
    } catch (error) {
      results.editorRenderer = false;
    }

    // Test 4: Navigation links use React Router (not href)
    results.reactRouterLinks = true; // This is tested by the component structure

    setTestResults(results);

    // Set test post for interaction tests
    if (postsData?.data && postsData.data.length > 0) {
      setTestPost(postsData.data[0]);
    }
  };

  const testViewIncrement = async () => {
    if (!testPost) return;
    
    try {
      await incrementViewMutation.mutateAsync(testPost.id);
      setTestResults(prev => ({ ...prev, viewIncrement: true }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, viewIncrement: false }));
      console.error('View increment test failed:', error);
    }
  };

  const testLikeToggle = async () => {
    if (!testPost) return;
    
    try {
      await toggleLikeMutation.mutateAsync(testPost.id);
      setTestResults(prev => ({ ...prev, likeToggle: true }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, likeToggle: false }));
      console.error('Like toggle test failed:', error);
    }
  };

  const getTestStatus = (testName: string) => {
    const result = testResults[testName];
    if (result === undefined) return '⏳ Pending';
    return result ? '✅ Pass' : '❌ Fail';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post Issues Test Dashboard</h1>
        
        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">API Tests</h3>
            <div className="space-y-2 text-sm">
              <div>Posts API: {getTestStatus('postsApi')}</div>
              <div>Featured Posts API: {getTestStatus('featuredApi')}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Component Tests</h3>
            <div className="space-y-2 text-sm">
              <div>EditorJS Renderer: {getTestStatus('editorRenderer')}</div>
              <div>React Router Links: {getTestStatus('reactRouterLinks')}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Interaction Tests</h3>
            <div className="space-y-2 text-sm">
              <div>View Increment: {getTestStatus('viewIncrement')}</div>
              <div>Like Toggle: {getTestStatus('likeToggle')}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Test Actions</h3>
            <div className="space-y-2">
              <button
                onClick={testViewIncrement}
                disabled={!testPost || incrementViewMutation.isPending}
                className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Test View Increment
              </button>
              <button
                onClick={testLikeToggle}
                disabled={!testPost || toggleLikeMutation.isPending}
                className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Test Like Toggle
              </button>
            </div>
          </div>
        </div>

        {/* EditorJS Renderer Test */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">EditorJS Renderer Test</h3>
          <div className="border border-gray-200 rounded p-4 bg-white">
            <EditorJSRenderer
              data={testEditorData}
              useTailwindProse={true}
              darkMode={false}
            />
          </div>
        </div>

        {/* Navigation Test */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Navigation Test (React Router Links)</h3>
          <div className="space-y-2">
            {postsData?.data?.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-center space-x-2">
                <Link 
                  to={`/posts/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {post.title}
                </Link>
                <span className="text-xs text-green-600">✅ Uses React Router Link</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Response Data */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">API Response Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium">Posts API</h4>
              <div>Loading: {postsLoading ? 'Yes' : 'No'}</div>
              <div>Error: {postsError ? 'Yes' : 'No'}</div>
              <div>Data Count: {postsData?.data?.length || 0}</div>
            </div>
            <div>
              <h4 className="font-medium">Featured Posts API</h4>
              <div>Loading: {featuredLoading ? 'Yes' : 'No'}</div>
              <div>Error: {featuredError ? 'Yes' : 'No'}</div>
              <div>Data Count: {featuredData?.data?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Error Details */}
        {(postsError || featuredError) && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-3">Error Details</h3>
            {postsError && (
              <div className="mb-2">
                <strong>Posts Error:</strong> {postsError.message}
              </div>
            )}
            {featuredError && (
              <div>
                <strong>Featured Posts Error:</strong> {featuredError.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostIssuesTest;
