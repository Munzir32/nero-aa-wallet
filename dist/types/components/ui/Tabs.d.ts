import React from 'react';
interface Tab {
    id: string;
    label: React.ReactNode;
    content: React.ReactNode;
}
interface TabsProps {
    tabs: Tab[];
    defaultTabId?: string;
    className?: string;
    onChange?: (tabId: string) => void;
}
export declare const Tabs: React.FC<TabsProps>;
export {};
