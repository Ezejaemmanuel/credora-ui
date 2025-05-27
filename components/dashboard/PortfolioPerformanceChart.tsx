import { GlowingCard } from "@/components/ui/GlowingCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PortfolioDataPoint {
    month: string;
    return: number;
}

interface PortfolioPerformanceChartProps {
    data: PortfolioDataPoint[];
}

export const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({ data }) => {
    return (
        <GlowingCard variant="green" className="p-6">
            <h3 className="text-xl font-orbitron mb-4">Portfolio Performance</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                borderColor: '#00FF00',
                                color: '#fff'
                            }}
                        />
                        <Bar dataKey="return" fill="#00FF00" name="Return %" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlowingCard>
    );
};

export default PortfolioPerformanceChart; 