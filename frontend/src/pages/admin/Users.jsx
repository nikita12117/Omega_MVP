import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState('sequence_id');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [tokenDelta, setTokenDelta] = useState(0);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  const loadUserDetail = async (userId) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      setSelected(response.data);
      setTokenDelta(0);
    } catch (error) {
      console.error('Error loading user detail:', error);
      toast.error('Failed to load user details');
    }
  };
  
  const handleBan = async (userId) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/ban`);
      toast.success('Uživatel byl zablokován');
      await loadUsers();
      if (selected && selected.id === userId) {
        await loadUserDetail(userId);
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };
  
  const handleUnban = async (userId) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/unban`);
      toast.success('Uživatel byl odblokován');
      await loadUsers();
      if (selected && selected.id === userId) {
        await loadUserDetail(userId);
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };
  
  const handleTokenAdjust = async () => {
    if (!selected || tokenDelta === 0) return;
    try {
      await apiClient.post(`/admin/users/${selected.id}/tokens/adjust`, { delta: tokenDelta });
      toast.success(`Tokeny upraveny: ${tokenDelta > 0 ? '+' : ''}${tokenDelta}`);
      await loadUsers();
      await loadUserDetail(selected.id);
      setTokenDelta(0);
    } catch (error) {
      console.error('Error adjusting tokens:', error);
      toast.error(error.response?.data?.detail || 'Failed to adjust tokens');
    }
  };
  
  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    const base = users.filter(u => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term));
    return base.sort((a, b) => {
      const m = sortDir === 'asc' ? 1 : -1;
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (aVal > bVal) return m;
      if (aVal < bVal) return -m;
      return 0;
    });
  }, [q, users, sortKey, sortDir]);
  
  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  
  const activityBadge = (u) => {
    if (!u.last_login_at) return <Badge variant="outline" className="opacity-75 border-slate-700 text-slate-500">Neaktivní</Badge>;
    const last = new Date(u.last_login_at);
    const diff = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 1) return <Badge variant="outline" className="border-[rgb(6,214,160)]/30 text-[rgb(6,214,160)]">Aktivní 24h</Badge>;
    if (diff <= 7) return <Badge variant="secondary" className="bg-[rgb(0,255,255)]/10 text-[rgb(0,255,255)]">Posledních 7d</Badge>;
    return <Badge variant="outline" className="opacity-75 border-slate-700 text-slate-500">Neaktivní 14d+</Badge>;
  };
  
  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc' ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Načítání...</div>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-slate-100">Uživatelé ({users.length})</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Hledat jméno nebo email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              data-testid="users-search-input"
              className="pl-9 bg-[rgb(10,15,29)] border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table data-testid="users-table">
              <TableHeader className="sticky top-0 z-10 bg-[rgb(15,23,42)]">
                <TableRow className="border-slate-800">
                  {[
                    { key: 'sequence_id', label: 'ID' },
                    { key: 'name', label: 'Jméno' },
                    { key: 'omega_tokens_balance', label: 'Aktuální tokeny' },
                    { key: 'agents_count', label: 'Počet agentů' },
                    { key: 'total_tokens_consumed', label: 'Celkem tokeny' },
                    { key: 'most_expensive_agent', label: 'Nejdražší agent' },
                    { key: 'last_login_at', label: 'Poslední aktivita' }
                  ].map(({ key, label }) => (
                    <TableHead
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="cursor-pointer select-none text-slate-300 hover:text-[rgb(6,214,160)] transition-colors"
                      data-testid="users-header-sort"
                    >
                      {label}
                      <SortIcon col={key} />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow
                    key={u.id}
                    data-testid="users-row"
                    className="hover:bg-white/5 cursor-pointer transition-colors border-slate-800"
                    onClick={() => loadUserDetail(u.id)}
                  >
                    <TableCell className="font-mono text-sm text-slate-100">{u.sequence_id}</TableCell>
                    <TableCell className="font-medium text-slate-100">{u.name}</TableCell>
                    <TableCell className="text-slate-300">{u.omega_tokens_balance?.toLocaleString()}</TableCell>
                    <TableCell className="text-slate-300">{u.agents_count}</TableCell>
                    <TableCell className="text-slate-300">{u.total_tokens_consumed?.toLocaleString()}</TableCell>
                    <TableCell className="text-slate-300 text-sm">{u.most_expensive_agent}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">
                          {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('cs-CZ') : 'Nikdy'}
                        </span>
                        {activityBadge(u)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-[rgb(15,23,42)] border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <div className="space-y-6" data-testid="user-detail-modal">
              <DialogHeader>
                <DialogTitle className="text-slate-100">
                  {selected.name}
                  <span className="text-slate-400 font-normal ml-2 text-sm">{selected.email}</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-[rgb(10,15,29)] rounded-lg border border-slate-800">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Token zůstatek</div>
                  <div className="text-2xl font-semibold text-[rgb(6,214,160)]" data-testid="user-detail-token-balance">
                    {selected.omega_tokens_balance?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Celkem spotřeba</div>
                  <div className="text-2xl font-semibold text-slate-100">{selected.total_tokens_consumed?.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-300">Akce</div>
                <div className="flex items-center gap-3">
                  {selected.is_banned ? (
                    <Button
                      onClick={() => handleUnban(selected.id)}
                      className="bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900 border-0"
                      data-testid="user-detail-unban-button"
                    >
                      Odblokovat uživatele
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          className="bg-red-600 hover:bg-red-700 text-white border-0"
                          data-testid="user-detail-ban-button"
                        >
                          Zablokovat uživatele
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[rgb(15,23,42)] border-slate-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-100">Potvrdit akci</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Opravdu chcete zablokovat uživatele {selected.name}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-800 text-slate-100 hover:bg-slate-700">Zrušit</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleBan(selected.id)} className="bg-red-600 hover:bg-red-700">
                            Potvrdit
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-300">Manuální úprava tokenů</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setTokenDelta(Math.max(tokenDelta - 10000, -selected.omega_tokens_balance))}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100"
                    data-testid="user-detail-token-minus"
                  >
                    -10k
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-semibold text-slate-100">
                      {tokenDelta > 0 ? '+' : ''}{tokenDelta.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      Nový zůstatek: {(selected.omega_tokens_balance + tokenDelta).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setTokenDelta(tokenDelta + 10000)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100"
                    data-testid="user-detail-token-plus"
                  >
                    +10k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTokenAdjust}
                    disabled={tokenDelta === 0 || (selected.omega_tokens_balance + tokenDelta) < 0}
                    className="border-[rgb(6,214,160)] text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10"
                    data-testid="user-detail-token-confirm"
                  >
                    Potvrdit
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="mb-3 font-medium text-slate-100">Vygenerovaní agenti ({selected.agents?.length || 0})</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="user-detail-agents-grid">
                  {(selected.agents || []).map(a => (
                    <div key={a.id} className="rounded-md border border-slate-800 p-3 hover:bg-white/5 transition-colors">
                      <div className="font-semibold text-slate-100 text-sm">{a.name}</div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-2">{a.description?.general_function || 'No description'}</div>
                    </div>
                  ))}
                  {(!selected.agents || selected.agents.length === 0) && (
                    <div className="col-span-2 text-center text-slate-500 py-8">Žádní agenti</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
