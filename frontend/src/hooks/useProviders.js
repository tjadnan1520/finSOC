import { useState, useCallback, useEffect } from 'react';
import providerService from '../services/provider.service';

export default function useProviders() {
  const [providers, setProviders] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [providersRes, balancesRes] = await Promise.all([
        providerService.getProviders(),
        providerService.getProviderBalances(),
      ]);
      setProviders(providersRes.data?.providers || providersRes.data || []);
      setBalances(balancesRes.data?.balances || balancesRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load providers');
      setProviders([]);
      setBalances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const refresh = useCallback(async () => {
    await loadProviders();
  }, [loadProviders]);

  return { providers, balances, loading, error, loadProviders, refresh };
}
