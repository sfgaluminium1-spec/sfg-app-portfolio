
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, LogIn, Loader2, MapPin, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EmployeeLoginProps {
  onSuccess?: () => void;
}

export function EmployeeLogin({ onSuccess }: EmployeeLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '' 
  });

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome to ChronoShift Pro!');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Employee Access
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          SFG Aluminium Ltd - ChronoShift Pro
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleEmployeeLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee-email">Work Email Address</Label>
            <Input
              id="employee-email"
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData(prev => ({ ...prev, email: e.target.value }))
              }
              placeholder="your.name@sfg-aluminium.co.uk"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee-password">
              Password 
              <span className="text-sm text-gray-500 ml-2">
                (Home postcode + door number)
              </span>
            </Label>
            <Input
              id="employee-password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData(prev => ({ ...prev, password: e.target.value }))
              }
              placeholder="e.g. M125PG42"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter your postcode without spaces + your house/flat number
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Clock In to Work
              </>
            )}
          </Button>
        </form>

        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Location Tracking Enabled
              </p>
              <p className="text-blue-700 dark:text-blue-200 mt-1">
                Your location is captured only when submitting timesheets to verify you're at the work site.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-900 dark:text-green-100">
                Privacy Protected
              </p>
              <p className="text-green-700 dark:text-green-200 mt-1">
                No continuous tracking. Location data used only for work verification and stored securely.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>Having trouble logging in?</p>
          <p>Contact HR: 0161 884 0131 or HR@sfg-aluminium.co.uk</p>
        </div>
      </CardContent>
    </Card>
  );
}
