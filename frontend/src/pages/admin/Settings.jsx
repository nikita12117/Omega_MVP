import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const response = await apiClient.get('/admin/settings');
      setSettings(response.data);
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSettingsChange = (updates) => {
    setSettings({ ...settings, ...updates });
    setHasChanges(true);
  };
  
  const saveSettings = async () => {
    try {
      await apiClient.put('/admin/settings', settings);
      toast.success('Nastavení uloženo');
      setHasChanges(false);
      await loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };
  
  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Načítání...</div>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="bg-[rgb(15,23,42)]/60 border border-slate-800">
          <TabsTrigger value="api" className="data-[state=active]:bg-[rgb(6,214,160)]/10 data-[state=active]:text-[rgb(6,214,160)]">API Settings</TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-[rgb(6,214,160)]/10 data-[state=active]:text-[rgb(6,214,160)]">Token Pricing</TabsTrigger>
          <TabsTrigger value="prompt" className="data-[state=active]:bg-[rgb(6,214,160)]/10 data-[state=active]:text-[rgb(6,214,160)]">Master Prompt</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-[rgb(6,214,160)]/10 data-[state=active]:text-[rgb(6,214,160)]">Payments</TabsTrigger>
          <TabsTrigger value="referral" className="data-[state=active]:bg-[rgb(6,214,160)]/10 data-[state=active]:text-[rgb(6,214,160)]">Referral</TabsTrigger>
          <TabsTrigger value="sms" className="data-[state=active]:bg-[rgb(6,214,160)]/10 data-[state=active]:text-[rgb(6,214,160)]">SMS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api">
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">API Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[rgb(10,15,29)] rounded-lg border border-slate-800">
                <div>
                  <div className="font-medium text-slate-100">Použít Emergent LLM klíč</div>
                  <div className="text-sm text-slate-400 mt-1">Použít univerzální klíč namísto vlastního OpenAI API klíče</div>
                </div>
                <Switch
                  checked={settings.use_emergent_key}
                  onCheckedChange={(val) => handleSettingsChange({ use_emergent_key: val })}
                  data-testid="settings-api-toggle"
                />
              </div>
              
              {!settings.use_emergent_key && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Vlastní OpenAI API Key</label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={settings.custom_openai_api_key || ''}
                    onChange={(e) => handleSettingsChange({ custom_openai_api_key: e.target.value })}
                    className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                  />
                </div>
              )}
              
              <Separator className="bg-slate-800" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">LLM Model</label>
                <Select
                  value={settings.selected_model}
                  onValueChange={(val) => handleSettingsChange({ selected_model: val })}
                >
                  <SelectTrigger className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100" data-testid="settings-model-select">
                    <SelectValue placeholder="Vyberte model" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(15,23,42)] border-slate-800">
                    <SelectItem value="gpt-4.1" className="text-slate-100 focus:bg-[rgb(6,214,160)]/10 focus:text-[rgb(6,214,160)]">GPT-4.1</SelectItem>
                    <SelectItem value="gpt-4" className="text-slate-100 focus:bg-[rgb(6,214,160)]/10 focus:text-[rgb(6,214,160)]">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo" className="text-slate-100 focus:bg-[rgb(6,214,160)]/10 focus:text-[rgb(6,214,160)]">GPT-3.5-turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={saveSettings}
                disabled={!hasChanges}
                data-testid="settings-save-button"
                className={`transition-all duration-300 ${
                  hasChanges
                    ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                    : 'bg-[rgb(30,58,138)] hover:bg-[rgb(30,58,138)]/90 text-slate-100 opacity-50 cursor-not-allowed'
                }`}
              >
                Uložit změny
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing">
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Token Package Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Balíček 10K tokenů (Kč)</label>
                <Input
                  type="number"
                  min="0"
                  value={settings.price_99}
                  onChange={(e) => handleSettingsChange({ price_99: parseFloat(e.target.value) })}
                  data-testid="settings-price-99"
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Balíček 35K tokenů (Kč)</label>
                <Input
                  type="number"
                  min="0"
                  value={settings.price_399}
                  onChange={(e) => handleSettingsChange({ price_399: parseFloat(e.target.value) })}
                  data-testid="settings-price-399"
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                />
              </div>
              <div className="col-span-full">
                <Button 
                  onClick={saveSettings}
                  disabled={!hasChanges}
                  className={`transition-all duration-300 ${
                    hasChanges
                      ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                      : 'bg-[rgb(30,58,138)] hover:bg-[rgb(30,58,138)]/90 text-slate-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  Uložit ceny
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prompt">
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Default Master Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Aktuální Master Prompt</label>
                <Textarea
                  rows={12}
                  placeholder="Zadejte výchozí master prompt pro všechny uživatele..."
                  value={settings.default_master_prompt || ''}
                  onChange={(e) => handleSettingsChange({ default_master_prompt: e.target.value })}
                  data-testid="settings-master-prompt"
                  className="font-mono text-sm bg-[rgb(10,15,29)] border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <Button 
                onClick={saveSettings}
                disabled={!hasChanges}
                className={`transition-all duration-300 ${
                  hasChanges
                    ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                    : 'bg-[rgb(30,58,138)] hover:bg-[rgb(30,58,138)]/90 text-slate-100 opacity-50 cursor-not-allowed'
                }`}
              >
                Uložit prompt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">GoPay Payment Gateway</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Konfigurace platební brány GoPay pro zpracování plateb tokenů
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable GoPay */}
              <div className="flex items-center justify-between p-4 bg-[rgb(10,15,29)] rounded-lg border border-slate-800">
                <div>
                  <div className="font-medium text-slate-100">Povolit GoPay platby</div>
                  <div className="text-sm text-slate-400 mt-1">Aktivovat platební bránu GoPay pro nákup tokenů</div>
                </div>
                <Switch
                  checked={settings.gopay_enabled || false}
                  onCheckedChange={(val) => handleSettingsChange({ gopay_enabled: val })}
                  data-testid="gopay-enabled-toggle"
                />
              </div>

              <Separator className="bg-slate-800" />

              {/* GoID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  GoID <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="např. 8302931681"
                  value={settings.gopay_goid || ''}
                  onChange={(e) => handleSettingsChange({ gopay_goid: e.target.value })}
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                  data-testid="gopay-goid-input"
                />
                <p className="text-xs text-slate-400">Identifikátor obchodníka od GoPay</p>
              </div>

              {/* Client ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Client ID <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="např. 1061399163"
                  value={settings.gopay_client_id || ''}
                  onChange={(e) => handleSettingsChange({ gopay_client_id: e.target.value })}
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                  data-testid="gopay-client-id-input"
                />
                <p className="text-xs text-slate-400">Client ID pro OAuth autentizaci</p>
              </div>

              {/* Client Secret */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Client Secret <span className="text-red-400">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Zadejte Client Secret..."
                  value={settings.gopay_client_secret || ''}
                  onChange={(e) => handleSettingsChange({ gopay_client_secret: e.target.value })}
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                  data-testid="gopay-client-secret-input"
                />
                <p className="text-xs text-slate-400">Client Secret pro OAuth autentizaci (uloženo šifrovaně)</p>
              </div>

              <Separator className="bg-slate-800" />

              {/* Production Mode */}
              <div className="flex items-center justify-between p-4 bg-[rgb(10,15,29)] rounded-lg border border-slate-800">
                <div>
                  <div className="font-medium text-slate-100">Produkční režim</div>
                  <div className="text-sm text-slate-400 mt-1">
                    <span className="text-orange-400">Sandbox:</span> gw.sandbox.gopay.com → 
                    <span className="text-green-400 ml-2">Produkce:</span> gate.gopay.cz
                  </div>
                </div>
                <Switch
                  checked={settings.gopay_is_production || false}
                  onCheckedChange={(val) => handleSettingsChange({ gopay_is_production: val })}
                  data-testid="gopay-production-toggle"
                />
              </div>

              <Separator className="bg-slate-800" />

              {/* Return URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Return URL <span className="text-red-400">*</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://vasestranka.cz/payment/return"
                  value={settings.gopay_return_url || ''}
                  onChange={(e) => handleSettingsChange({ gopay_return_url: e.target.value })}
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                  data-testid="gopay-return-url-input"
                />
                <p className="text-xs text-slate-400">
                  URL, kam bude zákazník přesměrován po dokončení platby
                </p>
              </div>

              {/* Notification URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Notification URL <span className="text-red-400">*</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://vasestranka.cz/payment/notify"
                  value={settings.gopay_notification_url || ''}
                  onChange={(e) => handleSettingsChange({ gopay_notification_url: e.target.value })}
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                  data-testid="gopay-notification-url-input"
                />
                <p className="text-xs text-slate-400">
                  URL pro příjem asynchronních notifikací o stavu platby (webhook)
                </p>
              </div>

              <Separator className="bg-slate-800" />

              {/* Info Box */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">📘 Integrace GoPay REST API</h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Pro testování použijte Sandbox režim</li>
                  <li>Po úspěšném otestování aktivujte Produkční režim</li>
                  <li>Token se získává pomocí OAuth 2.0 (grant_type: client_credentials)</li>
                  <li>Platby se vytvářejí přes POST /api/payments/payment</li>
                  <li>Zákazník je přesměrován na gw_url z odpovědi</li>
                  <li>Notifikace ověřte vždy dotazem na GET /api/payments/payment/{'{'}id{'}'}</li>
                </ul>
              </div>

              <Button 
                onClick={saveSettings}
                disabled={!hasChanges}
                className={`w-full transition-all duration-300 ${
                  hasChanges
                    ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                    : 'bg-[rgb(30,58,138)] hover:bg-[rgb(30,58,138)]/90 text-slate-100 opacity-50 cursor-not-allowed'
                }`}
                data-testid="save-gopay-settings"
              >
                Uložit GoPay nastavení
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referral">
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Referral Program</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Nastavení odměn za doporučení nových ověřených uživatelů
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referral Reward Tokens */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Odměna za referral (tokeny) <span className="text-red-400">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="např. 10000"
                  value={settings.referral_reward_tokens || 10000}
                  onChange={(e) => handleSettingsChange({ referral_reward_tokens: parseInt(e.target.value) || 10000 })}
                  className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                  data-testid="referral-reward-input"
                />
                <p className="text-xs text-slate-400">
                  Počet tokenů, které obdrží uživatel za každého ověřeného uživatele, kterého přivede
                </p>
              </div>

              <Separator className="bg-slate-800" />

              {/* Info Box */}
              <div className="p-4 bg-[rgb(6,214,160)]/10 border border-[rgb(6,214,160)]/30 rounded-lg">
                <h4 className="text-sm font-semibold text-[rgb(6,214,160)] mb-2">📊 Jak funguje Referral Program</h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Každý ověřený uživatel dostane unikátní referral kód (např. OMEGA-ABC123)</li>
                  <li>Když nový uživatel použije tento kód a ověří telefonní číslo, referrer dostane odměnu</li>
                  <li>Odměna se automaticky připíše na token balance referrrera</li>
                  <li>Referral program je dostupný pouze pro uživatele s ověřeným telefonem</li>
                  <li>Telefon může být registrován pouze jednou (unikátnost)</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">🔒 Bezpečnost</h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Pouze česká telefonní čísla (+420XXXXXXXXX)</li>
                  <li>SMS verifikační kód platný 10 minut</li>
                  <li>Maximálně 3 pokusy o ověření kódu</li>
                  <li>Účet se vytvoří až po úspěšném ověření telefonu</li>
                </ul>
              </div>

              <Button 
                onClick={saveSettings}
                disabled={!hasChanges}
                className={`w-full transition-all duration-300 ${
                  hasChanges
                    ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                    : 'bg-[rgb(30,58,138)] hover:bg-[rgb(30,58,138)]/90 text-slate-100 opacity-50 cursor-not-allowed'
                }`}
                data-testid="save-referral-settings"
              >
                Uložit referral nastavení
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms">
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">SMS Verification Settings</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Konfigurace SMS providera pro ověření telefonních čísel
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable SMS */}
              <div className="flex items-center justify-between p-4 bg-[rgb(10,15,29)] rounded-lg border border-slate-800">
                <div>
                  <div className="font-medium text-slate-100">Povolit reálné SMS</div>
                  <div className="text-sm text-slate-400 mt-1">
                    <span className="text-orange-400">Vypnuto:</span> MOCK režim (kód v UI) → 
                    <span className="text-green-400 ml-2">Zapnuto:</span> Skutečné SMS přes vybraného providera
                  </div>
                </div>
                <Switch
                  checked={settings.sms_enabled || false}
                  onCheckedChange={(val) => handleSettingsChange({ sms_enabled: val })}
                  data-testid="sms-enabled-toggle"
                />
              </div>

              <Separator className="bg-slate-800" />

              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  SMS Provider <span className="text-red-400">*</span>
                </label>
                <select
                  value={settings.sms_provider || 'aws_sns'}
                  onChange={(e) => handleSettingsChange({ sms_provider: e.target.value })}
                  className="w-full bg-[rgb(10,15,29)] border border-slate-700 text-slate-100 rounded-md px-3 py-2"
                  data-testid="sms-provider-select"
                >
                  <option value="aws_sns">AWS SNS (Amazon)</option>
                  <option value="smsmanager">SMSmanager.cz (Český provider)</option>
                </select>
                <p className="text-xs text-slate-400">
                  Vyberte preferovaného SMS providera
                </p>
              </div>

              <Separator className="bg-slate-800" />

              {/* AWS SNS Settings */}
              {(settings.sms_provider || 'aws_sns') === 'aws_sns' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-100">AWS SNS Konfigurace</h3>
                  
                  {/* AWS Access Key ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      AWS Access Key ID <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      value={settings.aws_access_key_id || ''}
                      onChange={(e) => handleSettingsChange({ aws_access_key_id: e.target.value })}
                      className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100 font-mono text-sm"
                      data-testid="aws-access-key-input"
                    />
                  </div>

                  {/* AWS Secret Access Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      AWS Secret Access Key <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      value={settings.aws_secret_access_key || ''}
                      onChange={(e) => handleSettingsChange({ aws_secret_access_key: e.target.value })}
                      className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100 font-mono text-sm"
                      data-testid="aws-secret-key-input"
                    />
                  </div>

                  {/* AWS Region */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">AWS Region</label>
                    <select
                      value={settings.aws_region || 'eu-central-1'}
                      onChange={(e) => handleSettingsChange({ aws_region: e.target.value })}
                      className="w-full bg-[rgb(10,15,29)] border border-slate-700 text-slate-100 rounded-md px-3 py-2"
                      data-testid="aws-region-select"
                    >
                      <option value="eu-central-1">EU (Frankfurt) - eu-central-1</option>
                      <option value="eu-west-1">EU (Ireland) - eu-west-1</option>
                      <option value="us-east-1">US East (N. Virginia) - us-east-1</option>
                      <option value="us-west-2">US West (Oregon) - us-west-2</option>
                    </select>
                  </div>

                  {/* AWS Info */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">💰 AWS SNS Cena</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• SMS do ČR: <strong>$0.00645 / SMS</strong> (~0.15 Kč)</li>
                      <li>• Free Tier: <strong>První 100 SMS měsíčně ZDARMA</strong></li>
                      <li>• Delivery: 95%+ úspěšnost</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* SMSmanager.cz Settings */}
              {settings.sms_provider === 'smsmanager' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-100">SMSmanager.cz Konfigurace</h3>
                  
                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      API Key <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="Zadejte API key ze SMSmanager.cz"
                      value={settings.smsmanager_api_key || ''}
                      onChange={(e) => handleSettingsChange({ smsmanager_api_key: e.target.value })}
                      className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100 font-mono text-sm"
                      data-testid="smsmanager-api-key-input"
                    />
                    <p className="text-xs text-slate-400">
                      API klíč získáte v SMSmanager.cz → Nastavení → API
                    </p>
                  </div>

                  {/* Gateway (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Gateway (nepovinné)
                    </label>
                    <Input
                      type="text"
                      placeholder="např. Premium, Low-cost..."
                      value={settings.smsmanager_gateway || ''}
                      onChange={(e) => handleSettingsChange({ smsmanager_gateway: e.target.value })}
                      className="bg-[rgb(10,15,29)] border-slate-700 text-slate-100"
                      data-testid="smsmanager-gateway-input"
                    />
                    <p className="text-xs text-slate-400">
                      Specifická brána pro odesílání (ponechte prázdné pro výchozí)
                    </p>
                  </div>

                  {/* SMSmanager.cz Info */}
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">💰 SMSmanager.cz Cena</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• SMS: <strong>~0.50 Kč / SMS</strong></li>
                      <li>• Český provider s lokální podporou</li>
                      <li>• Vysoká spolehlivost doručení</li>
                      <li>• Web: <a href="https://www.smsmanager.cz" target="_blank" rel="noopener" className="text-blue-400 underline">www.smsmanager.cz</a></li>
                    </ul>
                  </div>

                  {/* Setup Guide */}
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-orange-400 mb-2">📋 Jak nastavit SMSmanager.cz</h4>
                    <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                      <li>Jděte na <a href="https://www.smsmanager.cz" target="_blank" rel="noopener" className="text-blue-400 underline">SMSmanager.cz</a></li>
                      <li>Zaregistrujte se a dobijte kredit</li>
                      <li>Přihlášení → Nastavení → API</li>
                      <li>Zkopírujte API Key sem</li>
                      <li>Zapněte "Povolit reálné SMS"</li>
                    </ol>
                  </div>
                </div>
              )}

              <Separator className="bg-slate-800" />

              {/* General Warning */}
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Bezpečnost</h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Nikdy nesdílejte API klíče</li>
                  <li>Credentials jsou uloženy šifrovaně</li>
                  <li>Sledujte náklady u vybraného providera</li>
                  <li>MOCK režim je zdarma pro testování</li>
                </ul>
              </div>

              <Button 
                onClick={saveSettings}
                disabled={!hasChanges}
                className={`w-full transition-all duration-300 ${
                  hasChanges
                    ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                    : 'bg-[rgb(30,58,138)] hover:bg-[rgb(30,58,138)]/90 text-slate-100 opacity-50 cursor-not-allowed'
                }`}
                data-testid="save-sms-settings"
              >
                Uložit SMS nastavení
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
