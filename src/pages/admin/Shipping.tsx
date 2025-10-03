import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shippingApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, Truck } from 'lucide-react';

export default function Shipping() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ zone: '', cost: '', estimated_days: '' });
  const queryClient = useQueryClient();

  const { data: zones, isLoading } = useQuery({
    queryKey: ['shipping'],
    queryFn: shippingApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: shippingApi.create,
    onSuccess: () => {
      toast({ title: 'Shipping zone created', description: 'Shipping zone has been added successfully.' });
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      setIsOpen(false);
      setFormData({ zone: '', cost: '', estimated_days: '' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: shippingApi.delete,
    onSuccess: () => {
      toast({ title: 'Shipping zone deleted', description: 'Shipping zone has been removed.' });
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      cost: parseFloat(formData.cost),
      estimated_days: parseInt(formData.estimated_days),
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipping Zones</h1>
          <p className="text-muted-foreground">Configure shipping costs and delivery times</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shipping Zone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Shipping Zone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zone">Zone Name</Label>
                <Input
                  id="zone"
                  placeholder="e.g. Cairo, Alexandria"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Shipping Cost (EGP)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_days">Estimated Delivery (days)</Label>
                <Input
                  id="estimated_days"
                  type="number"
                  value={formData.estimated_days}
                  onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Shipping Zone
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {zones?.map((zone: any) => (
          <Card key={zone.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{zone.zone}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {zone.cost} EGP
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(zone.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{zone.estimated_days} days delivery</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!zones?.length && (
        <Card>
          <CardContent className="py-12 text-center">
            <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No shipping zones configured</h3>
            <p className="text-muted-foreground mb-4">Add your first shipping zone to enable deliveries</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
