// src/pages/admin/AppSettings.jsx

import SettingsManager from '@/components/admin/SettingsManager';

const AppSettings = () => {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">Application Settings</h1>
                <p className="text-muted-foreground">Manage global settings and features.</p>
            </div>
            <SettingsManager />
        </div>
    );
};

export default AppSettings;