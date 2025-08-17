/**
 * Report Generator
 * Comprehensive reporting system for events and users
 */

export class ReportGenerator {
    constructor() {
        this.reportTypes = {
            events: 'Events Report',
            users: 'Users Report',
            activity: 'Activity Report',
            analytics: 'Analytics Report',
            system: 'System Health Report'
        };
    }

    /**
     * Generate comprehensive events report
     */
    generateEventsReport(events, options = {}) {
        const {
            format = 'html',
            dateRange = 'all',
            includeImages = false,
            groupBy = 'month'
        } = options;

        const processedData = this.processEventsData(events, dateRange, groupBy);
        
        switch (format) {
            case 'csv':
                return this.generateEventsCSV(processedData);
            case 'json':
                return this.generateEventsJSON(processedData);
            default:
                return this.generateEventsHTML(processedData, options);
        }
    }

    /**
     * Process events data for reporting
     */
    processEventsData(events, dateRange, groupBy) {
        let filteredEvents = this.filterEventsByDateRange(events, dateRange);
        
        const summary = {
            totalEvents: filteredEvents.length,
            upcomingEvents: filteredEvents.filter(e => this.isUpcoming(e)).length,
            pastEvents: filteredEvents.filter(e => this.isPast(e)).length,
            multiDayEvents: filteredEvents.filter(e => e.isMultiDay).length,
            uniqueSpeakers: new Set(filteredEvents.map(e => e.speaker)).size,
            uniqueLocations: new Set(filteredEvents.map(e => e.location)).size
        };

        const groupedData = this.groupEventsBy(filteredEvents, groupBy);
        const trends = this.calculateEventTrends(filteredEvents);
        const topSpeakers = this.getTopSpeakers(filteredEvents);
        const popularLocations = this.getPopularLocations(filteredEvents);

        return {
            summary,
            events: filteredEvents,
            groupedData,
            trends,
            topSpeakers,
            popularLocations,
            generatedAt: new Date().toISOString(),
            dateRange,
            groupBy
        };
    }

    /**
     * Generate HTML report for events
     */
    generateEventsHTML(data, options) {
        const { includeCharts = true, includeDetails = true } = options;

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SSMA Events Report</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
                    .report-container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .report-header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
                    .report-title { font-size: 28px; font-weight: bold; margin: 0; }
                    .report-subtitle { font-size: 16px; opacity: 0.9; margin: 8px 0 0 0; }
                    .report-body { padding: 30px; }
                    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                    .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; }
                    .summary-number { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 8px; }
                    .summary-label { color: #64748b; font-size: 14px; }
                    .section { margin-bottom: 40px; }
                    .section-title { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 16px; border-bottom: 2px solid #22c55e; padding-bottom: 8px; }
                    .events-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                    .events-table th { background: #f1f5f9; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; font-weight: 600; }
                    .events-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
                    .events-table tr:hover { background: #f8fafc; }
                    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
                    .status-upcoming { background: #dcfce7; color: #166534; }
                    .status-past { background: #f1f5f9; color: #475569; }
                    .status-today { background: #fee2e2; color: #991b1b; }
                    .chart-placeholder { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 40px; text-align: center; color: #64748b; margin: 16px 0; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <div class="report-header">
                        <h1 class="report-title">SSMA Events Report</h1>
                        <p class="report-subtitle">Generated on ${new Date(data.generatedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                        <p class="report-subtitle">Period: ${this.formatDateRangeLabel(data.dateRange)}</p>
                    </div>
                    
                    <div class="report-body">
                        <!-- Summary Section -->
                        <div class="section">
                            <h2 class="section-title">Executive Summary</h2>
                            <div class="summary-grid">
                                <div class="summary-card">
                                    <div class="summary-number">${data.summary.totalEvents}</div>
                                    <div class="summary-label">Total Events</div>
                                </div>
                                <div class="summary-card">
                                    <div class="summary-number">${data.summary.upcomingEvents}</div>
                                    <div class="summary-label">Upcoming Events</div>
                                </div>
                                <div class="summary-card">
                                    <div class="summary-number">${data.summary.uniqueSpeakers}</div>
                                    <div class="summary-label">Unique Speakers</div>
                                </div>
                                <div class="summary-card">
                                    <div class="summary-number">${data.summary.uniqueLocations}</div>
                                    <div class="summary-label">Locations</div>
                                </div>
                                <div class="summary-card">
                                    <div class="summary-number">${data.summary.multiDayEvents}</div>
                                    <div class="summary-label">Multi-Day Events</div>
                                </div>
                                <div class="summary-card">
                                    <div class="summary-number">${Math.round((data.summary.upcomingEvents / data.summary.totalEvents) * 100) || 0}%</div>
                                    <div class="summary-label">Upcoming Rate</div>
                                </div>
                            </div>
                        </div>

                        <!-- Top Speakers Section -->
                        <div class="section">
                            <h2 class="section-title">Top Speakers</h2>
                            <table class="events-table">
                                <thead>
                                    <tr>
                                        <th>Speaker</th>
                                        <th>Events Count</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.topSpeakers.slice(0, 10).map(speaker => `
                                        <tr>
                                            <td>${speaker.name}</td>
                                            <td>${speaker.count}</td>
                                            <td>${Math.round((speaker.count / data.summary.totalEvents) * 100)}%</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Popular Locations Section -->
                        <div class="section">
                            <h2 class="section-title">Popular Locations</h2>
                            <table class="events-table">
                                <thead>
                                    <tr>
                                        <th>Location</th>
                                        <th>Events Count</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.popularLocations.slice(0, 10).map(location => `
                                        <tr>
                                            <td>${location.name}</td>
                                            <td>${location.count}</td>
                                            <td>${Math.round((location.count / data.summary.totalEvents) * 100)}%</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        ${includeDetails ? `
                        <!-- Detailed Events List -->
                        <div class="section">
                            <h2 class="section-title">Events Details</h2>
                            <table class="events-table">
                                <thead>
                                    <tr>
                                        <th>Event Title</th>
                                        <th>Date</th>
                                        <th>Speaker</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.events.map(event => `
                                        <tr>
                                            <td>${event.title}</td>
                                            <td>${this.formatEventDate(event)}</td>
                                            <td>${event.speaker}</td>
                                            <td>${event.location}</td>
                                            <td><span class="status-badge status-${this.getEventStatus(event)}">${this.getEventStatusLabel(event)}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="footer">
                        <p>SSMA Sacramento Events Management System</p>
                        <p>This report contains ${data.summary.totalEvents} events from ${this.formatDateRangeLabel(data.dateRange)}</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Generate CSV report for events
     */
    generateEventsCSV(data) {
        const headers = [
            'Event ID',
            'Title',
            'Description', 
            'Start Date',
            'End Date',
            'Time',
            'Speaker',
            'Location',
            'Hosted By',
            'Multi-Day',
            'Status',
            'Created At',
            'Created By'
        ];

        const rows = data.events.map(event => [
            event.id,
            `"${event.title}"`,
            `"${event.description}"`,
            event.dateStart,
            event.dateEnd || '',
            event.time,
            `"${event.speaker}"`,
            `"${event.location}"`,
            `"${event.hostedBy}"`,
            event.isMultiDay ? 'Yes' : 'No',
            this.getEventStatusLabel(event),
            event.createdAt,
            event.createdBy || ''
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    /**
     * Generate activity report
     */
    generateActivityReport(activities, options = {}) {
        const { format = 'html', dateRange = 7, groupBy = 'day' } = options;
        
        const filteredActivities = this.filterActivitiesByDateRange(activities, dateRange);
        const processedData = this.processActivityData(filteredActivities, groupBy);
        
        switch (format) {
            case 'csv':
                return this.generateActivityCSV(processedData);
            case 'json':
                return JSON.stringify(processedData, null, 2);
            default:
                return this.generateActivityHTML(processedData, options);
        }
    }

    /**
     * Generate user activity report
     */
    generateUserReport(users, activities, options = {}) {
        const { format = 'html' } = options;
        
        const processedData = this.processUserData(users, activities);
        
        switch (format) {
            case 'csv':
                return this.generateUserCSV(processedData);
            case 'json':
                return JSON.stringify(processedData, null, 2);
            default:
                return this.generateUserHTML(processedData, options);
        }
    }

    /**
     * Utility functions
     */
    filterEventsByDateRange(events, dateRange) {
        if (dateRange === 'all') return events;
        
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (dateRange) {
            case '7days':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case '30days':
                cutoffDate.setDate(now.getDate() - 30);
                break;
            case '90days':
                cutoffDate.setDate(now.getDate() - 90);
                break;
            case 'thisyear':
                cutoffDate.setFullYear(now.getFullYear(), 0, 1);
                break;
            default:
                return events;
        }
        
        return events.filter(event => new Date(event.dateStart) >= cutoffDate);
    }

    groupEventsBy(events, groupBy) {
        const groups = {};
        
        events.forEach(event => {
            const date = new Date(event.dateStart);
            let key;
            
            switch (groupBy) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'year':
                    key = date.getFullYear().toString();
                    break;
                default:
                    key = 'all';
            }
            
            if (!groups[key]) groups[key] = [];
            groups[key].push(event);
        });
        
        return groups;
    }

    getTopSpeakers(events) {
        const speakerCounts = {};
        events.forEach(event => {
            speakerCounts[event.speaker] = (speakerCounts[event.speaker] || 0) + 1;
        });
        
        return Object.entries(speakerCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }

    getPopularLocations(events) {
        const locationCounts = {};
        events.forEach(event => {
            locationCounts[event.location] = (locationCounts[event.location] || 0) + 1;
        });
        
        return Object.entries(locationCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }

    calculateEventTrends(events) {
        // Implementation for trend analysis
        return {};
    }

    isUpcoming(event) {
        const now = new Date();
        const eventEnd = event.dateEnd ? new Date(event.dateEnd) : new Date(event.dateStart);
        return eventEnd >= now;
    }

    isPast(event) {
        return !this.isUpcoming(event);
    }

    getEventStatus(event) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventStart = new Date(event.dateStart);
        const eventEnd = event.dateEnd ? new Date(event.dateEnd) : eventStart;
        
        if (today >= eventStart && today <= eventEnd) {
            return 'today';
        } else if (eventEnd >= today) {
            return 'upcoming';
        } else {
            return 'past';
        }
    }

    getEventStatusLabel(event) {
        const status = this.getEventStatus(event);
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    formatEventDate(event) {
        if (event.dateEnd && event.dateEnd !== event.dateStart) {
            return `${event.dateStart} to ${event.dateEnd}`;
        }
        return event.dateStart;
    }

    formatDateRangeLabel(dateRange) {
        const labels = {
            'all': 'All Time',
            '7days': 'Last 7 Days',
            '30days': 'Last 30 Days', 
            '90days': 'Last 90 Days',
            'thisyear': 'This Year'
        };
        return labels[dateRange] || 'Custom Range';
    }

    /**
     * Export report to file
     */
    downloadReport(content, filename, type = 'text/html') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Get available report types
     */
    getReportTypes() {
        return this.reportTypes;
    }
}
