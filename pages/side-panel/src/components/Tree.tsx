import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface TreeProps {
  data: TreeNode[];
  isDarkMode?: boolean;
}

const TreeNode: React.FC<{ node: TreeNode; isDarkMode?: boolean }> = ({ node, isDarkMode = false }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
        style={{ marginLeft: '1.25rem' }}>
        <div className="absolute left-0 h-full w-px bg-gray-300 dark:bg-gray-600" />
        <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-gray-300 dark:bg-gray-600" />
        <div className="markdown-content z-10 flex-1 rounded-md bg-white p-2 dark:bg-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{node.label}</ReactMarkdown>
        </div>
      </div>
      {hasChildren && (
        <div className="mt-2" style={{ marginLeft: '1.25rem' }}>
          {node.children?.map(child => (
            <TreeNode key={child.id} node={child} isDarkMode={isDarkMode} />
          ))}
        </div>
      )}
    </div>
  );
};

const Tree: React.FC<TreeProps> = ({ data, isDarkMode = false }) => {
  return (
    <div className="space-y-2">
      {data.map(node => (
        <div key={node.id} className="relative">
          <div className="absolute left-4 top-4 h-full w-px bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-2">
            <div
              className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
              <div className={`h-2 w-2 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`} />
            </div>
            <div className="markdown-content flex-1 rounded-md bg-white p-2 dark:bg-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{node.label}</ReactMarkdown>
            </div>
          </div>
          {node.children && node.children.length > 0 && (
            <div className="mt-2" style={{ marginLeft: '1.25rem' }}>
              {node.children.map(child => (
                <TreeNode key={child.id} node={child} isDarkMode={isDarkMode} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tree;
