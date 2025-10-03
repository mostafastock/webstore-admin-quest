import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: analyticsApi.getOverview,
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  const stats = [
    {
      title: 'Orders Today',
      value: overview?.today?.orders_today || 0,
      icon: ShoppingCart,
      trend: '+12%',
      trendUp: true,
      description: 'Since last week',
    },
    {
      title: 'Revenue Today',
      value: `${overview?.today?.revenue_today || 0} EGP`,
      icon: DollarSign,
      trend: '+8%',
      trendUp: true,
      description: 'Since last week',
    },
    {
      title: 'This Week',
      value: `${overview?.week?.revenue_week || 0} EGP`,
      icon: TrendingUp,
      trend: `${overview?.week?.orders_week || 0} orders`,
      trendUp: true,
      description: 'Weekly revenue',
    },
    {
      title: 'Pending Orders',
      value: overview?.pending_orders || 0,
      icon: AlertCircle,
      trend: 'Needs attention',
      trendUp: false,
      description: 'Awaiting confirmation',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                {stat.trendUp ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-warning" />
                )}
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-success' : 'text-warning'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview?.recent_orders?.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total} EGP</p>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!overview?.recent_orders || overview.recent_orders.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview?.low_stock_products?.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {product.stock} left
                  </Badge>
                </div>
              ))}
              {(!overview?.low_stock_products || overview.low_stock_products.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">All products well stocked</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}