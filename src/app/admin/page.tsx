'use client';

import { useState, useEffect } from 'react';

type Product = {
    id: number;
    title: string;
    views: number;
    purchases: number; 
}
type AdminStats = {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  cartAbandonmentRate: number;
  topProducts: Product[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    cartAbandonmentRate: 0,
    topProducts: []
  });

  // Load admin data with real analytics
  useEffect(() => {
    // Mock data for demonstration
    const mockStats: AdminStats = {
      totalProducts: 20,
      totalRevenue: 15420.50,
      totalOrders: 89,
      cartAbandonmentRate: 68.5,
      topProducts: [
        { id: 1, title: "Fjallraven - Foldsack No. 1 Backpack", views: 245, purchases: 18 },
        { id: 2, title: "Mens Casual Premium Slim Fit T-Shirts", views: 189, purchases: 15 },
        { id: 3, title: "Mens Cotton Jacket", views: 156, purchases: 12 },
        { id: 4, title: "Mens Casual Slim Fit", views: 134, purchases: 9 },
        { id: 5, title: "John Hardy Women's Legends Naga Gold", views: 98, purchases: 7 }
      ]
    };
    
    setStats(mockStats);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your e-commerce store performance</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online Users</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cart Abandonment</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.cartAbandonmentRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Session Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Session</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cart Items:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cart Value:</span>
                <span className="font-medium">$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Time:</span>
                <span className="font-medium">
                  0s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Page Views:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cart Actions:</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products:</span>
                <span className="font-medium">{stats.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Sessions:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Rate:</span>
                <span className="font-medium">3.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.title.length > 50 
                          ? `${product.title.substring(0, 50)}...` 
                          : product.title
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.purchases}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((product.purchases / product.views) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Future Features Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-blue-900">Real-Time Features Coming Soon</h4>
              <p className="text-blue-700 mt-1">
                This dashboard will soon include WebSocket integration for live user tracking, 
                real-time cart monitoring, and instant notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
