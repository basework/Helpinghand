'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Bell, BellOff } from 'lucide-react';
import type { DiagnosticPayload } from '@/lib/pwa-notification-utils';

interface NotificationPermissionPopupProps {
  isOpen: boolean;
  permission: NotificationPermission | null;
  diagnostic: DiagnosticPayload | null;
  onClose: () => void;
  onEnableNotifications: () => void;
  onCheckStatus: () => void;
  isLoading?: boolean;
  showHelperButtons?: boolean;
}

export function NotificationPermissionPopup({
  isOpen,
  permission,
  diagnostic,
  onClose,
  onEnableNotifications,
  onCheckStatus,
  isLoading = false,
  showHelperButtons = true,
}: NotificationPermissionPopupProps) {
  if (!isOpen) return null;

  useEffect(() => {
    if (permission !== 'granted' && permission !== 'denied') return;
    const timer = window.setTimeout(() => {
      onClose();
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [permission, onClose]);

  const getStatusConfig = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: <Check className="h-5 w-5" />,
          title: 'Notification Allowed',
          description: 'Notification allowed',
          variant: 'default' as const,
          badgeText: 'Granted',
          badgeVariant: 'default' as const,
        };
      case 'denied':
        return {
          icon: <BellOff className="h-5 w-5" />,
          title: 'Notification Blocked',
          description: 'Notification blocked',
          variant: 'destructive' as const,
          badgeText: 'Denied',
          badgeVariant: 'destructive' as const,
        };
      default:
        return {
          icon: <Bell className="h-5 w-5" />,
          title: 'Enable Notifications',
          description: 'Tap allow to receive notifications.',
          variant: 'default' as const,
          badgeText: 'Not Set',
          badgeVariant: 'secondary' as const,
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{status.title}</CardTitle>
            <Badge variant={status.badgeVariant}>{status.badgeText}</Badge>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            {status.icon}
            <span>{status.description}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showHelperButtons && (
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={onEnableNotifications}
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-md"
              >
                {isLoading ? 'Processing...' : 'Enable Notifications'}
              </Button>
              <Button
                onClick={onCheckStatus}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Check Notification Status
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
