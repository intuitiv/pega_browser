import { useState, useEffect } from 'react';
import { Button } from '@extension/ui';

interface MCPSettingsProps {
  isDarkMode?: boolean;
}

interface MCP {
  id: string;
  name: string;
  url: string;
}

export const MCPSettings = ({ isDarkMode = false }: MCPSettingsProps) => {
  const [mcps, setMcps] = useState<MCP[]>([]);
  const [newMcpName, setNewMcpName] = useState('');
  const [newMcpUrl, setNewMcpUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Load mcps from storage on mount
  useEffect(() => {
    const loadMcps = async () => {
      try {
        const storedMcps = await chrome.storage.local.get('supportedMcps');
        if (storedMcps) {
          setMcps(storedMcps.supportedMcps || []);
        }
      } catch (error) {
        console.error('Error loading mcps:', error);
      }
    };

    loadMcps();
  }, []);

  // Save mcps to storage
  const saveMcps = async (mcps: MCP[]) => {
    try {
      await chrome.storage.local.set({ supportedMcps: mcps });
    } catch (error) {
      console.error('Error saving mcps:', error);
    }
  };

  const handleAddMcp = async () => {
    if (!newMcpName.trim() || !newMcpUrl.trim()) {
      return;
    }

    const newMcp: MCP = {
      id: Date.now().toString(),
      name: newMcpName.trim(),
      url: newMcpUrl.trim(),
    };

    const updatedMcps = [...mcps, newMcp];
    setMcps(updatedMcps);
    await saveMcps(updatedMcps);

    // Clear form
    setNewMcpName('');
    setNewMcpUrl('');
  };

  const handleDeleteMcp = async (id: string) => {
    const updatedMcps = mcps.filter(mcp => mcp.id !== id);
    setMcps(updatedMcps);
    await saveMcps(updatedMcps);
  };

  const handleEditMcp = (mcp: MCP) => {
    setEditingId(mcp.id);
    setEditName(mcp.name);
    setEditUrl(mcp.url);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editUrl.trim() || !editingId) {
      return;
    }
    const updatedMcps = mcps.map(mcp =>
      mcp.id === editingId
        ? {
            ...mcp,
            name: editName.trim(),
            url: editUrl.trim(),
          }
        : mcp,
    );

    setMcps(updatedMcps);
    await saveMcps(updatedMcps);

    // Clear edit state
    setEditingId(null);
    setEditName('');
    setEditUrl('');
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditUrl('');
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <section className="space-y-6">
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-gray-50'} p-6 text-left shadow-sm`}>
        <h2 className={`mb-4 text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Supported MCPs
        </h2>

        {/* Add New MCP Form */}
        <div
          className={`mb-6 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-slate-700' : 'border-gray-200 bg-white'} p-4`}>
          <h3 className={`mb-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Add New MCP</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <label
                htmlFor="mcp-name"
                className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                MCP Name
              </label>
              <input
                id="mcp-name"
                type="text"
                placeholder="Enter MCP name"
                value={newMcpName}
                onChange={e => setNewMcpName(e.target.value)}
                className={`flex-1 rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-800' : 'border-gray-300 bg-white text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'} px-3 py-2 outline-none`}
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="mcp-url"
                className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                MCP URL
              </label>
              <input
                id="mcp-url"
                type="url"
                placeholder="https://example.com"
                value={newMcpUrl}
                onChange={e => setNewMcpUrl(e.target.value)}
                className={`flex-1 rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-800' : 'border-gray-300 bg-white text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'} px-3 py-2 outline-none`}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleAddMcp}
                disabled={!newMcpName.trim() || !newMcpUrl.trim() || !isValidUrl(newMcpUrl.trim())}
                className="text-sm">
                Add MCP
              </Button>
            </div>
          </div>
        </div>

        {/* MCPs List */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Configured MCPs</h3>

          {mcps.length === 0 ? (
            <div className="py-8 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No MCPs configured yet. Add your first MCP above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mcps.map(mcp => (
                <div
                  key={mcp.id}
                  className={`rounded-lg border ${isDarkMode ? 'border-gray-700 bg-slate-700' : 'border-gray-200 bg-white'} p-4`}>
                  {editingId === mcp.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <label
                          htmlFor={`edit-name-${mcp.id}`}
                          className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          MCP Name
                        </label>
                        <input
                          id={`edit-name-${mcp.id}`}
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className={`flex-1 rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-800' : 'border-gray-300 bg-gray-50 text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'} px-3 py-2 outline-none`}
                        />
                      </div>

                      <div className="flex items-center">
                        <label
                          htmlFor={`edit-url-${mcp.id}`}
                          className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          MCP URL
                        </label>
                        <input
                          id={`edit-url-${mcp.id}`}
                          type="url"
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          className={`flex-1 rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-800' : 'border-gray-300 bg-gray-50 text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'} px-3 py-2 outline-none`}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={handleCancelEdit} className="text-sm">
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleSaveEdit}
                          disabled={!editName.trim() || !editUrl.trim() || !isValidUrl(editUrl.trim())}
                          className="text-sm">
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {mcp.name}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <a
                                  href={mcp.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                  {mcp.url}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="secondary" onClick={() => handleEditMcp(mcp)} className="text-sm">
                            Edit
                          </Button>
                          <Button variant="danger" onClick={() => handleDeleteMcp(mcp.id)} className="text-sm">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
