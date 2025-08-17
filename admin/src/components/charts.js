/**
 * Charts and Visualizations Components
 * Enhanced analytics with interactive charts
 */

export class ChartRenderer {
    constructor() {
        this.charts = {};
    }

    /**
     * Create a simple bar chart using CSS and JavaScript
     */
    createBarChart(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { 
            title = '', 
            color = '#22c55e', 
            maxHeight = 200,
            showValues = true,
            animate = true 
        } = options;

        // Calculate max value for scaling
        const maxValue = Math.max(...data.map(item => item.value));

        container.innerHTML = `
            <div class="chart-container">
                ${title ? `<h4 class="text-md font-semibold text-admin-800 mb-4">${title}</h4>` : ''}
                <div class="chart-bars space-y-3">
                    ${data.map((item, index) => {
                        const percentage = (item.value / maxValue) * 100;
                        const height = (percentage / 100) * maxHeight;
                        
                        return `
                            <div class="chart-bar-item">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-admin-700">${item.label}</span>
                                    ${showValues ? `<span class="text-sm font-medium text-admin-900">${item.value}</span>` : ''}
                                </div>
                                <div class="chart-bar-container bg-admin-100 rounded-full h-6 overflow-hidden">
                                    <div 
                                        class="chart-bar h-full rounded-full transition-all duration-1000 ease-out"
                                        style="
                                            width: ${animate ? '0%' : percentage + '%'}; 
                                            background: ${color};
                                        "
                                        data-width="${percentage}%"
                                    ></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Animate bars if enabled
        if (animate) {
            setTimeout(() => {
                const bars = container.querySelectorAll('.chart-bar');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }, 100);
        }
    }

    /**
     * Create a pie chart using SVG
     */
    createPieChart(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { 
            title = '', 
            size = 200, 
            colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
            showLegend = true 
        } = options;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        // Generate SVG paths for pie slices
        const slices = data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            currentAngle += angle;

            const x1 = Math.cos((startAngle - 90) * Math.PI / 180) * (size / 2 - 10);
            const y1 = Math.sin((startAngle - 90) * Math.PI / 180) * (size / 2 - 10);
            const x2 = Math.cos((endAngle - 90) * Math.PI / 180) * (size / 2 - 10);
            const y2 = Math.sin((endAngle - 90) * Math.PI / 180) * (size / 2 - 10);

            const largeArc = angle > 180 ? 1 : 0;
            const path = `M ${size/2} ${size/2} L ${size/2 + x1} ${size/2 + y1} A ${size/2 - 10} ${size/2 - 10} 0 ${largeArc} 1 ${size/2 + x2} ${size/2 + y2} Z`;

            return {
                path,
                color: colors[index % colors.length],
                label: item.label,
                value: item.value,
                percentage: percentage.toFixed(1)
            };
        });

        container.innerHTML = `
            <div class="chart-container">
                ${title ? `<h4 class="text-md font-semibold text-admin-800 mb-4">${title}</h4>` : ''}
                <div class="flex items-center justify-center space-x-6">
                    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="chart-pie">
                        ${slices.map(slice => `
                            <path 
                                d="${slice.path}" 
                                fill="${slice.color}" 
                                stroke="white" 
                                stroke-width="2"
                                class="transition-opacity hover:opacity-80 cursor-pointer"
                                title="${slice.label}: ${slice.value} (${slice.percentage}%)"
                            />
                        `).join('')}
                    </svg>
                    
                    ${showLegend ? `
                        <div class="chart-legend space-y-2">
                            ${slices.map(slice => `
                                <div class="flex items-center space-x-2">
                                    <div class="w-3 h-3 rounded-full" style="background: ${slice.color}"></div>
                                    <span class="text-sm text-admin-700">${slice.label}</span>
                                    <span class="text-sm font-medium text-admin-900">${slice.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Create a line chart for trends
     */
    createLineChart(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { 
            title = '', 
            color = '#3b82f6', 
            width = 400, 
            height = 200,
            showDots = true,
            showGrid = true 
        } = options;

        const maxValue = Math.max(...data.map(item => item.value));
        const minValue = Math.min(...data.map(item => item.value));
        const range = maxValue - minValue || 1;

        // Generate SVG path for line
        const pathPoints = data.map((item, index) => {
            const x = (index / (data.length - 1)) * (width - 40) + 20;
            const y = height - 20 - ((item.value - minValue) / range) * (height - 40);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        container.innerHTML = `
            <div class="chart-container">
                ${title ? `<h4 class="text-md font-semibold text-admin-800 mb-4">${title}</h4>` : ''}
                <svg width="${width}" height="${height}" class="chart-line">
                    ${showGrid ? `
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    ` : ''}
                    
                    <path 
                        d="${pathPoints}" 
                        fill="none" 
                        stroke="${color}" 
                        stroke-width="3"
                        stroke-linecap="round"
                        class="chart-line-path"
                    />
                    
                    ${showDots ? data.map((item, index) => {
                        const x = (index / (data.length - 1)) * (width - 40) + 20;
                        const y = height - 20 - ((item.value - minValue) / range) * (height - 40);
                        
                        return `
                            <circle 
                                cx="${x}" 
                                cy="${y}" 
                                r="4" 
                                fill="${color}"
                                stroke="white"
                                stroke-width="2"
                                class="chart-dot hover:r-6 transition-all cursor-pointer"
                                title="${item.label}: ${item.value}"
                            />
                        `;
                    }).join('') : ''}
                </svg>
                
                <!-- X-axis labels -->
                <div class="flex justify-between mt-2 px-5">
                    ${data.map(item => `
                        <span class="text-xs text-admin-600">${item.label}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Create a progress ring chart
     */
    createProgressRing(containerId, percentage, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { 
            size = 120, 
            strokeWidth = 8, 
            color = '#22c55e',
            backgroundColor = '#e5e7eb',
            showPercentage = true,
            label = ''
        } = options;

        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;

        container.innerHTML = `
            <div class="chart-container flex flex-col items-center">
                <div class="relative">
                    <svg width="${size}" height="${size}" class="transform -rotate-90">
                        <!-- Background circle -->
                        <circle
                            cx="${size / 2}"
                            cy="${size / 2}"
                            r="${radius}"
                            stroke="${backgroundColor}"
                            stroke-width="${strokeWidth}"
                            fill="transparent"
                        />
                        <!-- Progress circle -->
                        <circle
                            cx="${size / 2}"
                            cy="${size / 2}"
                            r="${radius}"
                            stroke="${color}"
                            stroke-width="${strokeWidth}"
                            fill="transparent"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}"
                            stroke-linecap="round"
                            class="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    ${showPercentage ? `
                        <div class="absolute inset-0 flex items-center justify-center">
                            <span class="text-lg font-bold text-admin-900">${Math.round(percentage)}%</span>
                        </div>
                    ` : ''}
                </div>
                ${label ? `<p class="mt-2 text-sm text-admin-600 text-center">${label}</p>` : ''}
            </div>
        `;
    }

    /**
     * Create a metric card with trend
     */
    createMetricCard(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { 
            title, 
            value, 
            previousValue, 
            format = 'number',
            icon = null,
            color = 'blue'
        } = data;

        const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
        const isPositive = change >= 0;
        const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
        const trendIcon = isPositive ? '↗' : '↘';

        const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            red: 'bg-red-100 text-red-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600'
        };

        const formatValue = (val) => {
            switch (format) {
                case 'currency':
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
                case 'percentage':
                    return `${val}%`;
                default:
                    return val.toLocaleString();
            }
        };

        container.innerHTML = `
            <div class="metric-card bg-white rounded-xl shadow-sm border border-admin-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-admin-600 mb-1">${title}</p>
                        <p class="text-3xl font-bold text-admin-900 mb-2">${formatValue(value)}</p>
                        ${previousValue ? `
                            <div class="flex items-center space-x-1">
                                <span class="${trendColor} text-sm font-medium">${trendIcon} ${Math.abs(change).toFixed(1)}%</span>
                                <span class="text-xs text-admin-500">vs last period</span>
                            </div>
                        ` : ''}
                    </div>
                    ${icon ? `
                        <div class="w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center flex-shrink-0">
                            ${icon}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Destroy all charts and clear memory
     */
    destroy() {
        this.charts = {};
    }
}

/**
 * Analytics Data Processor
 */
export class AnalyticsProcessor {
    /**
     * Process events data for analytics
     */
    static processEventsData(events) {
        const now = new Date();
        
        // Events by month
        const eventsByMonth = {};
        const speakerCounts = {};
        const locationCounts = {};
        
        events.forEach(event => {
            const eventDate = new Date(event.dateStart);
            const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
            
            eventsByMonth[monthKey] = (eventsByMonth[monthKey] || 0) + 1;
            speakerCounts[event.speaker] = (speakerCounts[event.speaker] || 0) + 1;
            locationCounts[event.location] = (locationCounts[event.location] || 0) + 1;
        });

        return {
            eventsByMonth: Object.entries(eventsByMonth).map(([month, count]) => ({
                label: this.formatMonth(month),
                value: count
            })),
            topSpeakers: Object.entries(speakerCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([speaker, count]) => ({ label: speaker, value: count })),
            topLocations: Object.entries(locationCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([location, count]) => ({ label: location, value: count }))
        };
    }

    /**
     * Process user activity data
     */
    static processActivityData(activities) {
        const actionCounts = {};
        const dailyActivity = {};
        const userActivity = {};

        activities.forEach(activity => {
            const action = activity.action;
            const date = new Date(activity.timestamp).toISOString().split('T')[0];
            const user = activity.adminEmail;

            actionCounts[action] = (actionCounts[action] || 0) + 1;
            dailyActivity[date] = (dailyActivity[date] || 0) + 1;
            userActivity[user] = (userActivity[user] || 0) + 1;
        });

        return {
            actionBreakdown: Object.entries(actionCounts).map(([action, count]) => ({
                label: this.formatAction(action),
                value: count
            })),
            dailyTrend: Object.entries(dailyActivity)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-7) // Last 7 days
                .map(([date, count]) => ({
                    label: this.formatDate(date),
                    value: count
                })),
            userActivity: Object.entries(userActivity)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([user, count]) => ({ label: user, value: count }))
        };
    }

    static formatMonth(monthString) {
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    static formatAction(action) {
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}
