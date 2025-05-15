import { useEffect, useState } from 'react';
import { DestinationService } from '@/services/service-destinations';
import { StatCardDestination } from './StatCardDestination';
import { RevenueStat } from '@/types/Destinations';

const RevenueDashboard = () => {
    const [stats, setStats] = useState<RevenueStat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRevenueStats = async () => {
            try {
                setLoading(true);
                const result = await DestinationService.getRevenueStats();

                if (result.success && result.data) {
                    const transformedData: RevenueStat = {
                        success: true,
                        data: {
                            totalRevenue: result.data.totalRevenue ?? 0,
                            byDestination: (result.data.byDestination ?? []).map(item => ({
                                id: item.id,
                                nom: item.name,
                                pays: item.country,
                                adult_reservations: item.adultReservations ?? 0,
                                child_reservations: item.childReservations ?? 0,
                                adult_revenue: item.adultRevenue ?? 0,
                                child_revenue: item.childRevenue ?? 0,
                                total_revenue: item.totalRevenue ?? 0
                            })),
                            byCountry: (result.data.byCountry ?? []).map(item => ({
                                pays: item.country,
                                total_revenue: item.totalRevenue ?? 0,
                                destination_count: item.destinationCount ?? 0,
                                voyage_count: item.voyageCount ?? 0
                            })),
                            monthly_trend: (result.data.monthlyTrend ?? []).map(item => ({
                                month: item.month,
                                total_revenue: item.totalRevenue ?? 0,
                                reservation_count: item.reservationCount ?? 0
                            }))
                        }
                    };
                    setStats(transformedData);
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
    if (!stats) return <div>No data available</div>;

    return (
        <div className="space-y-8">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardDestination
                    title="Revenu Total"
                    value={`${(stats.data.totalRevenue ?? 0).toLocaleString()} €`}
                />
                <StatCardDestination
                    title="Destinations"
                    value={stats.data.byDestination?.length ?? 0}
                />
                <StatCardDestination
                    title="Pays"
                    value={stats.data.byCountry?.length ?? 0}
                />
            </div>

            {/* Tableau des statistiques par destination */}
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
                    <thead className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Destination</th>
                            <th className="px-4 py-3">Pays</th>
                            <th className="px-4 py-3 text-right">Adultes</th>
                            <th className="px-4 py-3 text-right">Enfants</th>
                            <th className="px-4 py-3 text-right">Revenu Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {stats.data.byDestination?.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-2">{item.nom}</td>
                                <td className="px-4 py-2">{item.pays}</td>
                                <td className="px-4 py-2 text-right">{item.adult_reservations}</td>
                                <td className="px-4 py-2 text-right">{item.child_reservations}</td>
                                <td className="px-4 py-2 text-right">
                                    {(item.total_revenue ?? 0).toLocaleString()} €
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default RevenueDashboard;