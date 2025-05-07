import { useEffect, useState } from 'react';
import { DestinationService } from '@/services/service-destinations';
import { StatCard } from './StatCardReservation';

const RevenueDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRevenueStats = async () => {
            try {
                setLoading(true);
                const result = await DestinationService.getRevenueStats();

                if (result.success) {
                    setStats(result.data);
                } else {
                    setError(result.error || 'Failed to load revenue stats');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchRevenueStats();
    }, []);

    if (loading) return <div>Loading revenue statistics...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Revenue Total"
                    value={`${stats?.totalRevenue.toLocaleString()} €`}
                />
                <StatCard
                    title="Destinations"
                    value={stats?.byDestination.length}
                />
                <StatCard
                    title="Pays"
                    value={stats?.byCountry.length}
                />
            </div>

            {/* Tableau des revenus par destination */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th>Destination</th>
                            <th>Pays</th>
                            <th>Réservations Adultes</th>
                            <th>Réservations Enfants</th>
                            <th>Revenue Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stats?.byDestination.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.country}</td>
                                <td>{item.adultReservations}</td>
                                <td>{item.childReservations}</td>
                                <td>{item.totalRevenue.toLocaleString()} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevenueDashboard;