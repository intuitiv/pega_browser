import { useState, useEffect } from 'react';
import { Button } from '@extension/ui';

interface ApplicationSettingsProps {
  isDarkMode?: boolean;
}

interface Application {
  id: string;
  name: string;
  url: string;
}

export const ApplicationSettings = ({ isDarkMode = false }: ApplicationSettingsProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [newApplicationName, setNewApplicationName] = useState('');
  const [newApplicationUrl, setNewApplicationUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Load applications from storage on mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const storedApps = await chrome.storage.local.get('supportedApplications');
        if (storedApps) {
          setApplications(storedApps.supportedApplications || []);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      }
    };

    loadApplications();
  }, []);

  // Save applications to storage
  const saveApplications = async (apps: Application[]) => {
    try {
      await chrome.storage.local.set({ supportedApplications: apps });
    } catch (error) {
      console.error('Error saving applications:', error);
    }
  };

  const handleAddApplication = async () => {
    if (!newApplicationName.trim() || !newApplicationUrl.trim()) {
      return;
    }

    const newApp: Application = {
      id: Date.now().toString(),
      name: newApplicationName.trim(),
      url: newApplicationUrl.trim(),
    };

    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    await saveApplications(updatedApps);

    // Clear form
    setNewApplicationName('');
    setNewApplicationUrl('');
  };

  const handleDeleteApplication = async (id: string) => {
    const updatedApps = applications.filter(app => app.id !== id);
    setApplications(updatedApps);
    await saveApplications(updatedApps);
  };

  const handleEditApplication = (app: Application) => {
    setEditingId(app.id);
    setEditName(app.name);
    setEditUrl(app.url);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editUrl.trim() || !editingId) {
      return;
    }

    const updatedApps = applications.map(app =>
      app.id === editingId ? { ...app, name: editName.trim(), url: editUrl.trim() } : app,
    );

    setApplications(updatedApps);
    await saveApplications(updatedApps);

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
          Supported Applications
        </h2>

        {/* Add New Application Form */}
        <div
          className={`mb-6 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-slate-700' : 'border-gray-200 bg-white'} p-4`}>
          <h3 className={`mb-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Add New Application
          </h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <label
                htmlFor="app-name"
                className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Application Name
              </label>
              <input
                id="app-name"
                type="text"
                placeholder="Enter application name"
                value={newApplicationName}
                onChange={e => setNewApplicationName(e.target.value)}
                className={`flex-1 rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-800' : 'border-gray-300 bg-white text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'} px-3 py-2 outline-none`}
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="app-url"
                className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Application URL
              </label>
              <input
                id="app-url"
                type="url"
                placeholder="https://example.com"
                value={newApplicationUrl}
                onChange={e => setNewApplicationUrl(e.target.value)}
                className={`flex-1 rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-800' : 'border-gray-300 bg-white text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'} px-3 py-2 outline-none`}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleAddApplication}
                disabled={
                  !newApplicationName.trim() || !newApplicationUrl.trim() || !isValidUrl(newApplicationUrl.trim())
                }
                className="text-sm">
                Add Application
              </Button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Configured Applications
          </h3>

          {applications.length === 0 ? (
            <div className="py-8 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No applications configured yet. Add your first application above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div
                  key={app.id}
                  className={`rounded-lg border ${isDarkMode ? 'border-gray-700 bg-slate-700' : 'border-gray-200 bg-white'} p-4`}>
                  {editingId === app.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <label
                          htmlFor={`edit-name-${app.id}`}
                          className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Application Name
                        </label>
                        <input
                          id={`edit-name-${app.id}`}
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className={`flex-1 rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-800' : 'border-gray-300 bg-gray-50 text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'} px-3 py-2 outline-none`}
                        />
                      </div>

                      <div className="flex items-center">
                        <label
                          htmlFor={`edit-url-${app.id}`}
                          className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Application URL
                        </label>
                        <input
                          id={`edit-url-${app.id}`}
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
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {app.name}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <a
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                {app.url}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="secondary" onClick={() => handleEditApplication(app)} className="text-sm">
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteApplication(app.id)} className="text-sm">
                          Delete
                        </Button>
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
