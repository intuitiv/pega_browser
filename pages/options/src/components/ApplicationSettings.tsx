import { useState, useEffect } from 'react';
import { Button } from '@extension/ui';

interface ApplicationSettingsProps {
  isDarkMode?: boolean;
}

interface Application {
  id: string;
  name: string;
  url: string;
  applicationKnowledge?: File | null;
  domainKnowledge?: File | null;
  applicationKnowledgeFileName?: string;
  domainKnowledgeFileName?: string;
  applicationKnowledgeContent?: string;
  domainKnowledgeContent?: string;
}

const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      if (event.target?.result && typeof event.target.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read file content.'));
      }
    };

    reader.onerror = error => {
      console.error('Error reading file:', error);
      reject(error);
    };

    if (file) {
      reader.readAsText(file);
    } else {
      reject(new Error('No file provided to read.'));
    }
  });
};

export const ApplicationSettings = ({ isDarkMode = false }: ApplicationSettingsProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [newApplicationName, setNewApplicationName] = useState('');
  const [newApplicationUrl, setNewApplicationUrl] = useState('');
  const [newApplicationKnowledge, setNewApplicationKnowledge] = useState<File | null>(null);
  const [newDomainKnowledge, setNewDomainKnowledge] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editApplicationKnowledge, setEditApplicationKnowledge] = useState<File | null>(null);
  const [editDomainKnowledge, setEditDomainKnowledge] = useState<File | null>(null);

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

    let applicationKnowledgeContent: string | undefined;
    if (newApplicationKnowledge) {
      applicationKnowledgeContent = await readFileContent(newApplicationKnowledge);
    }

    let domainKnowledgeContent: string | undefined;
    if (newDomainKnowledge) {
      domainKnowledgeContent = await readFileContent(newDomainKnowledge);
    }
    const newApp: Application = {
      id: Date.now().toString(),
      name: newApplicationName.trim(),
      url: newApplicationUrl.trim(),
      applicationKnowledge: newApplicationKnowledge,
      domainKnowledge: newDomainKnowledge,
      applicationKnowledgeFileName: newApplicationKnowledge?.name,
      domainKnowledgeFileName: newDomainKnowledge?.name,
      applicationKnowledgeContent,
      domainKnowledgeContent,
    };

    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    await saveApplications(updatedApps);

    // Clear form
    setNewApplicationName('');
    setNewApplicationUrl('');
    setNewApplicationKnowledge(null);
    setNewDomainKnowledge(null);

    // Clear file inputs
    const appKnowledgeInput = document.getElementById('app-knowledge') as HTMLInputElement;
    const domainKnowledgeInput = document.getElementById('domain-knowledge') as HTMLInputElement;
    if (appKnowledgeInput) appKnowledgeInput.value = '';
    if (domainKnowledgeInput) domainKnowledgeInput.value = '';
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
    let applicationKnowledgeContent: string | undefined;
    if (editApplicationKnowledge) {
      applicationKnowledgeContent = await readFileContent(editApplicationKnowledge);
    }

    let domainKnowledgeContent: string | undefined;
    if (editDomainKnowledge) {
      domainKnowledgeContent = await readFileContent(editDomainKnowledge);
    }
    const updatedApps = applications.map(app =>
      app.id === editingId
        ? {
            ...app,
            name: editName.trim(),
            url: editUrl.trim(),
            applicationKnowledge: editApplicationKnowledge || app.applicationKnowledge,
            domainKnowledge: editDomainKnowledge || app.domainKnowledge,
            applicationKnowledgeFileName: editApplicationKnowledge?.name || app.applicationKnowledgeFileName,
            domainKnowledgeFileName: editDomainKnowledge?.name || app.domainKnowledgeFileName,
            applicationKnowledgeContent: applicationKnowledgeContent || app.applicationKnowledgeContent,
            domainKnowledgeContent: domainKnowledgeContent || app.domainKnowledgeContent,
          }
        : app,
    );

    setApplications(updatedApps);
    await saveApplications(updatedApps);

    // Clear edit state
    setEditingId(null);
    setEditName('');
    setEditUrl('');
    setEditApplicationKnowledge(null);
    setEditDomainKnowledge(null);
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditUrl('');
    setEditApplicationKnowledge(null);
    setEditDomainKnowledge(null);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidFileType = (file: File) => {
    const allowedTypes = ['.txt', '.md'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(fileExtension);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'applicationKnowledge' | 'domainKnowledge',
    mode: 'new' | 'edit',
  ) => {
    const file = event.target.files?.[0];
    if (file && isValidFileType(file)) {
      if (mode === 'new') {
        if (type === 'applicationKnowledge') {
          setNewApplicationKnowledge(file);
        } else {
          setNewDomainKnowledge(file);
        }
      } else {
        if (type === 'applicationKnowledge') {
          setEditApplicationKnowledge(file);
        } else {
          setEditDomainKnowledge(file);
        }
      }
    } else if (file) {
      alert('Please select a valid file type (.txt or .md)');
      event.target.value = '';
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

            <div className="flex items-center">
              <label
                htmlFor="app-knowledge"
                className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Application Knowledge
              </label>
              <div className="flex-1">
                <input
                  id="app-knowledge"
                  type="file"
                  accept=".txt,.md"
                  onChange={e => handleFileChange(e, 'applicationKnowledge', 'new')}
                  className={`w-full rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 file:border-0 file:bg-slate-700 file:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm' : 'border-gray-300 bg-white text-gray-700 file:border-0 file:bg-gray-50 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm'} outline-none`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Optional: Upload .txt or .md file (max 10MB)
                </p>
                {newApplicationKnowledge && (
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Selected: {newApplicationKnowledge.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <label
                htmlFor="domain-knowledge"
                className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Domain Knowledge
              </label>
              <div className="flex-1">
                <input
                  id="domain-knowledge"
                  type="file"
                  accept=".txt,.md"
                  onChange={e => handleFileChange(e, 'domainKnowledge', 'new')}
                  className={`w-full rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 file:border-0 file:bg-slate-700 file:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm' : 'border-gray-300 bg-white text-gray-700 file:border-0 file:bg-gray-50 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm'} outline-none`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Optional: Upload .txt or .md file (max 10MB)
                </p>
                {newDomainKnowledge && (
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Selected: {newDomainKnowledge.name}
                  </p>
                )}
              </div>
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

                      <div className="flex items-center">
                        <label
                          htmlFor={`edit-app-knowledge-${app.id}`}
                          className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Application Knowledge
                        </label>
                        <div className="flex-1">
                          <input
                            id={`edit-app-knowledge-${app.id}`}
                            type="file"
                            accept=".txt,.md"
                            onChange={e => handleFileChange(e, 'applicationKnowledge', 'edit')}
                            className={`w-full rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 file:border-0 file:bg-slate-700 file:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm' : 'border-gray-300 bg-gray-50 text-gray-700 file:border-0 file:bg-gray-100 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm'} outline-none`}
                          />
                          <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {app.applicationKnowledgeFileName
                              ? `Current: ${app.applicationKnowledgeFileName}`
                              : 'No file uploaded'}
                          </p>
                          {editApplicationKnowledge && (
                            <p className={`mt-1 text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              New file selected: {editApplicationKnowledge.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <label
                          htmlFor={`edit-domain-knowledge-${app.id}`}
                          className={`w-32 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Domain Knowledge
                        </label>
                        <div className="flex-1">
                          <input
                            id={`edit-domain-knowledge-${app.id}`}
                            type="file"
                            accept=".txt,.md"
                            onChange={e => handleFileChange(e, 'domainKnowledge', 'edit')}
                            className={`w-full rounded-md border text-sm ${isDarkMode ? 'border-slate-600 bg-slate-800 text-gray-200 file:border-0 file:bg-slate-700 file:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm' : 'border-gray-300 bg-gray-50 text-gray-700 file:border-0 file:bg-gray-100 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-sm'} outline-none`}
                          />
                          <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {app.domainKnowledgeFileName
                              ? `Current: ${app.domainKnowledgeFileName}`
                              : 'No file uploaded'}
                          </p>
                          {editDomainKnowledge && (
                            <p className={`mt-1 text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              New file selected: {editDomainKnowledge.name}
                            </p>
                          )}
                        </div>
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

                      {/* File Information Display */}
                      {(app.applicationKnowledgeFileName || app.domainKnowledgeFileName) && (
                        <div className={`mt-3 p-3 rounded-md ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                          <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                            Uploaded Files:
                          </h5>
                          <div className="space-y-1">
                            {app.applicationKnowledgeFileName && (
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  Application Knowledge:
                                </span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                  {app.applicationKnowledgeFileName}
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                                  ✓ Uploaded
                                </span>
                              </div>
                            )}
                            {app.domainKnowledgeFileName && (
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  Domain Knowledge:
                                </span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                                  {app.domainKnowledgeFileName}
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                                  ✓ Uploaded
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
