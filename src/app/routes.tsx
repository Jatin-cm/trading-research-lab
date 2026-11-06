import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { SignupPage } from '@/pages/Auth/SignupPage'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { TradingPlanPage } from '@/pages/TradingPlan/TradingPlanPage'
import { JournalPage } from '@/pages/Journal/JournalPage'
import { StrategiesPage } from '@/pages/Strategies/StrategiesPage'
import { BacktesterPage } from '@/pages/Backtester/BacktesterPage'
import { PaperTradingPage } from '@/pages/PaperTrading/PaperTradingPage'
import { AnalyticsPage } from '@/pages/Analytics/AnalyticsPage'
import { MarketDataPage } from '@/pages/MarketData/MarketDataPage'
import { SettingsPage } from '@/pages/Settings/SettingsPage'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export const router = createBrowserRouter(
  [
    // Public Authentication Routes
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },

    // Protected Workstation Routes
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'trading-plan',
          element: <TradingPlanPage />,
        },
        {
          path: 'journal',
          element: <JournalPage />,
        },
        {
          path: 'strategies',
          element: <StrategiesPage />,
        },
        {
          path: 'backtester',
          element: <BacktesterPage />,
        },
        {
          path: 'paper-trading',
          element: <PaperTradingPage />,
        },
        {
          path: 'analytics',
          element: <AnalyticsPage />,
        },
        {
          path: 'market-data',
          element: <MarketDataPage />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
        {
          path: '*',
          element: (
            <div className="py-16 flex items-center justify-center">
              <EmptyState
                title="404 — Module Not Found"
                description="The requested workstation route does not exist or has moved."
                action={
                  <Link to="/dashboard">
                    <Button variant="primary" size="sm">
                      Return to Dashboard
                    </Button>
                  </Link>
                }
              />
            </div>
          ),
        },
      ],
    },
  ],
  {
    // Enables SPA navigation when hosted under GitHub Pages subpath (/trading-research-lab/)
    // or under root (/) during local development
    basename: import.meta.env.BASE_URL,
  }
)
