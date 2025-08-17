/**
 * Import/Export Manager
 * Advanced data import and export functionality
 */

export class ImportExportManager {
    constructor(eventsService, authService, notificationSystem) {
        this.eventsService = eventsService;
        this.authService = authService;
        this.notificationSystem = notificationSystem;
        
        this.supportedFormats = {
            export: ['csv', 'json', 'excel', 'pdf'],
            import: ['csv', 'json']
        };
        
        this.exportTemplates = {
            events: {
                basic: ['id', 'title', 'dateStart', 'dateEnd', 'speaker', 'location', 'hostedBy'],
                detailed: ['id', 'title', 'description', 'dateStart', 'dateEnd', 'time', 'speaker', 'location', 'hostedBy', 'status', 'createdAt', 'createdBy'],
                analytics: ['speaker', 'location', 'hostedBy', 'month', 'year', 'dayOfWeek', 'duration']
            },
            users: {
                basic: ['email', 'name', 'role', 'lastLogin'],
                detailed: ['email', 'name', 'role', 'status', 'lastLogin', 'totalLogins', 'createdAt'],
                permissions: ['email', 'name', 'role', 'permissions', 'lastModified']
            }
        };
    }

    /**
     * Render export interface
     */
    renderExportInterface(containerId, dataType = 'events') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const templates = this.exportTemplates[dataType];

        container.innerHTML = `
            <div class="export-interface space-y-6">
                <div class="border-b border-gray-200 pb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Export ${dataType.charAt(0).toUpperCase() + dataType.slice(1)}</h3>
                    <p class="text-sm text-gray-600 mt-1">Export your data in various formats for backup or analysis</p>
                </div>

                <!-- Export Template Selection -->
                <div class="export-template-selection">
                    <label class="block text-sm font-medium text-gray-700 mb-3">Export Template</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${Object.entries(templates).map(([key, fields]) => `
                            <label class="template-option cursor-pointer">
                                <input type="radio" name="export-template" value="${key}" class="sr-only" ${key === 'basic' ? 'checked' : ''}>
                                <div class="template-card border-2 rounded-lg p-4 transition-all hover:border-blue-300 ${key === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                                    <h4 class="font-medium text-gray-900 capitalize">${key} Template</h4>
                                    <p class="text-xs text-gray-600 mt-1">${fields.length} fields included</p>
                                    <div class="mt-2 text-xs text-gray-500">
                                        ${fields.slice(0, 3).join(', ')}${fields.length > 3 ? '...' : ''}
                                    </div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Format Selection -->
                <div class="format-selection">
                    <label class="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        ${this.supportedFormats.export.map(format => `
                            <label class="format-option cursor-pointer">
                                <input type="radio" name="export-format" value="${format}" class="sr-only" ${format === 'csv' ? 'checked' : ''}>
                                <div class="format-card border-2 rounded-lg p-3 text-center transition-all hover:border-blue-300 ${format === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                                    ${this.getFormatIcon(format)}
                                    <div class="text-sm font-medium text-gray-900 mt-2">${format.toUpperCase()}</div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Date Range Filter -->
                <div class="date-range-filter">
                    <label class="block text-sm font-medium text-gray-700 mb-3">Date Range (Optional)</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">From Date</label>
                            <input type="date" id="export-date-from" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">To Date</label>
                            <input type="date" id="export-date-to" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">Quick Select</label>
                            <select id="export-date-preset" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Custom Range</option>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                                <option value="365">Last Year</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Advanced Options -->
                <div class="advanced-options">
                    <details class="border border-gray-200 rounded-lg">
                        <summary class="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                            Advanced Options
                        </summary>
                        <div class="px-4 pb-4 space-y-4">
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="include-images" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <label for="include-images" class="text-sm text-gray-700">Include image references</label>
                            </div>
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="include-metadata" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <label for="include-metadata" class="text-sm text-gray-700">Include metadata (created by, modified dates)</label>
                            </div>
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="anonymize-data" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <label for="anonymize-data" class="text-sm text-gray-700">Anonymize personal data</label>
                            </div>
                        </div>
                    </details>
                </div>

                <!-- Export Actions -->
                <div class="export-actions flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="text-sm text-gray-600">
                        <span id="export-preview-count">Loading...</span>
                    </div>
                    <div class="flex space-x-3">
                        <button 
                            id="preview-export"
                            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onclick="importExport.previewExport('${dataType}')"
                        >
                            Preview
                        </button>
                        <button 
                            id="start-export"
                            class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onclick="importExport.startExport('${dataType}')"
                        >
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Export Data
                        </button>
                    </div>
                </div>

                <!-- Progress Indicator -->
                <div id="export-progress" class="hidden mt-4 p-4 bg-blue-50 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                        <div>
                            <div class="text-sm font-medium text-blue-900">Exporting data...</div>
                            <div class="text-xs text-blue-600" id="export-status">Preparing export...</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="w-full bg-blue-200 rounded-full h-2">
                            <div id="export-progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                        <div class="flex justify-between text-xs text-blue-600 mt-1">
                            <span id="export-progress-text">0%</span>
                            <span id="export-time-remaining">Calculating...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachExportEventListeners(dataType);
        this.updateExportPreview(dataType);
    }

    /**
     * Render import interface
     */
    renderImportInterface(containerId, dataType = 'events') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="import-interface space-y-6">
                <div class="border-b border-gray-200 pb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Import ${dataType.charAt(0).toUpperCase() + dataType.slice(1)}</h3>
                    <p class="text-sm text-gray-600 mt-1">Import data from CSV or JSON files</p>
                </div>

                <!-- File Upload Area -->
                <div class="file-upload-area">
                    <div 
                        id="file-drop-zone"
                        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                        ondrop="importExport.handleFileDrop(event)"
                        ondragover="importExport.handleDragOver(event)"
                        ondragleave="importExport.handleDragLeave(event)"
                        onclick="document.getElementById('file-input').click()"
                    >
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p class="mt-2 text-sm text-gray-600">
                            <span class="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                        </p>
                        <p class="text-xs text-gray-500">CSV, JSON files up to 10MB</p>
                        <input 
                            type="file" 
                            id="file-input" 
                            class="hidden" 
                            accept=".csv,.json"
                            onchange="importExport.handleFileSelect(event)"
                        >
                    </div>
                </div>

                <!-- File Preview -->
                <div id="file-preview" class="hidden">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div id="file-icon" class="flex-shrink-0"></div>
                                <div>
                                    <div id="file-name" class="text-sm font-medium text-gray-900"></div>
                                    <div id="file-info" class="text-xs text-gray-500"></div>
                                </div>
                            </div>
                            <button 
                                onclick="importExport.clearFile()"
                                class="text-gray-400 hover:text-gray-600"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Import Options -->
                <div id="import-options" class="hidden space-y-4">
                    <!-- Column Mapping -->
                    <div class="column-mapping">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Column Mapping</h4>
                        <div id="column-mapping-table" class="bg-gray-50 rounded-lg p-4">
                            <!-- Dynamic content will be inserted here -->
                        </div>
                    </div>

                    <!-- Import Settings -->
                    <div class="import-settings">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Import Settings</h4>
                        <div class="space-y-3">
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="skip-duplicates" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                                <label for="skip-duplicates" class="text-sm text-gray-700">Skip duplicate entries</label>
                            </div>
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="validate-data" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                                <label for="validate-data" class="text-sm text-gray-700">Validate data before import</label>
                            </div>
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="create-backup" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                                <label for="create-backup" class="text-sm text-gray-700">Create backup before import</label>
                            </div>
                        </div>
                    </div>

                    <!-- Data Preview -->
                    <div class="data-preview">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Data Preview</h4>
                        <div id="data-preview-table" class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                            <!-- Preview table will be inserted here -->
                        </div>
                        <div class="mt-2 text-xs text-gray-500" id="preview-info">
                            Showing first 5 rows of imported data
                        </div>
                    </div>

                    <!-- Import Actions -->
                    <div class="import-actions flex items-center justify-between pt-4 border-t border-gray-200">
                        <div class="text-sm text-gray-600">
                            <span id="import-preview-count">0 rows ready to import</span>
                        </div>
                        <div class="flex space-x-3">
                            <button 
                                onclick="importExport.validateImport('${dataType}')"
                                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Validate
                            </button>
                            <button 
                                onclick="importExport.startImport('${dataType}')"
                                class="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700"
                            >
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                                </svg>
                                Import Data
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Import Progress -->
                <div id="import-progress" class="hidden mt-4 p-4 bg-green-50 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
                        <div>
                            <div class="text-sm font-medium text-green-900">Importing data...</div>
                            <div class="text-xs text-green-600" id="import-status">Processing rows...</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="w-full bg-green-200 rounded-full h-2">
                            <div id="import-progress-bar" class="bg-green-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                        <div class="flex justify-between text-xs text-green-600 mt-1">
                            <span id="import-progress-text">0%</span>
                            <span id="import-processed-count">0 of 0 processed</span>
                        </div>
                    </div>
                </div>

                <!-- Download Template -->
                <div class="download-template bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-sm font-medium text-blue-900">Need a template?</h4>
                            <p class="text-xs text-blue-600 mt-1">Download a sample file with the correct format</p>
                        </div>
                        <button 
                            onclick="importExport.downloadTemplate('${dataType}')"
                            class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                            Download Template
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachImportEventListeners(dataType);
    }

    /**
     * Get format icon
     */
    getFormatIcon(format) {
        const icons = {
            csv: '<svg class="w-8 h-8 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
            json: '<svg class="w-8 h-8 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
            excel: '<svg class="w-8 h-8 mx-auto text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
            pdf: '<svg class="w-8 h-8 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
        };
        return icons[format] || icons.csv;
    }

    /**
     * Attach export event listeners
     */
    attachExportEventListeners(dataType) {
        // Template selection
        document.querySelectorAll('input[name="export-template"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updateTemplateSelection();
                this.updateExportPreview(dataType);
            });
        });

        // Format selection
        document.querySelectorAll('input[name="export-format"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updateFormatSelection();
            });
        });

        // Date preset selection
        document.getElementById('export-date-preset')?.addEventListener('change', (e) => {
            this.updateDatePreset(e.target.value);
        });
    }

    /**
     * Attach import event listeners
     */
    attachImportEventListeners(dataType) {
        // File input listeners are handled in the HTML onclick/onchange attributes
    }

    /**
     * Update template selection UI
     */
    updateTemplateSelection() {
        document.querySelectorAll('.template-card').forEach(card => {
            const radio = card.previousElementSibling;
            if (radio.checked) {
                card.classList.add('border-blue-500', 'bg-blue-50');
                card.classList.remove('border-gray-200');
            } else {
                card.classList.remove('border-blue-500', 'bg-blue-50');
                card.classList.add('border-gray-200');
            }
        });
    }

    /**
     * Update format selection UI
     */
    updateFormatSelection() {
        document.querySelectorAll('.format-card').forEach(card => {
            const radio = card.previousElementSibling;
            if (radio.checked) {
                card.classList.add('border-blue-500', 'bg-blue-50');
                card.classList.remove('border-gray-200');
            } else {
                card.classList.remove('border-blue-500', 'bg-blue-50');
                card.classList.add('border-gray-200');
            }
        });
    }

    /**
     * Update date preset
     */
    updateDatePreset(preset) {
        const fromInput = document.getElementById('export-date-from');
        const toInput = document.getElementById('export-date-to');
        
        if (!fromInput || !toInput) return;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (preset === 'all' || preset === '') {
            fromInput.value = '';
            toInput.value = '';
        } else {
            const days = parseInt(preset);
            const fromDate = new Date(today);
            fromDate.setDate(today.getDate() - days);
            
            fromInput.value = fromDate.toISOString().split('T')[0];
            toInput.value = today.toISOString().split('T')[0];
        }
    }

    /**
     * Update export preview
     */
    async updateExportPreview(dataType) {
        try {
            // This would fetch actual count from your backend
            const mockCount = Math.floor(Math.random() * 100) + 10;
            const previewElement = document.getElementById('export-preview-count');
            if (previewElement) {
                previewElement.textContent = `${mockCount} records will be exported`;
            }
        } catch (error) {
            console.error('Error updating export preview:', error);
        }
    }

    /**
     * Start export process
     */
    async startExport(dataType) {
        try {
            const template = document.querySelector('input[name="export-template"]:checked')?.value || 'basic';
            const format = document.querySelector('input[name="export-format"]:checked')?.value || 'csv';
            const dateFrom = document.getElementById('export-date-from')?.value;
            const dateTo = document.getElementById('export-date-to')?.value;

            const options = {
                template,
                format,
                dateFrom,
                dateTo,
                includeImages: document.getElementById('include-images')?.checked,
                includeMetadata: document.getElementById('include-metadata')?.checked,
                anonymizeData: document.getElementById('anonymize-data')?.checked
            };

            this.showExportProgress(true);
            
            // Simulate export process
            await this.simulateExportProcess(dataType, options);
            
            this.notificationSystem.success('Export completed successfully');
            
        } catch (error) {
            console.error('Export failed:', error);
            this.notificationSystem.error(`Export failed: ${error.message}`);
        } finally {
            this.showExportProgress(false);
        }
    }

    /**
     * Download template file
     */
    downloadTemplate(dataType) {
        const template = this.exportTemplates[dataType].basic;
        const csvContent = template.join(',') + '\n';
        
        // Add sample row
        const sampleRow = template.map(field => {
            switch (field) {
                case 'id': return 'sample-id-1';
                case 'title': return 'Sample Event Title';
                case 'dateStart': return '2024-01-01';
                case 'speaker': return 'John Doe';
                case 'location': return 'Community Center';
                default: return 'sample-value';
            }
        }).join(',');
        
        const fullContent = csvContent + sampleRow;
        
        this.downloadFile(fullContent, `${dataType}-template.csv`, 'text/csv');
        this.notificationSystem.info('Template downloaded successfully');
    }

    /**
     * Simulate export process with progress
     */
    async simulateExportProcess(dataType, options) {
        const steps = [
            'Fetching data...',
            'Processing records...',
            'Applying filters...',
            'Formatting output...',
            'Generating file...'
        ];

        for (let i = 0; i < steps.length; i++) {
            const progress = ((i + 1) / steps.length) * 100;
            this.updateExportProgress(progress, steps[i]);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Generate and download the actual file
        const mockData = this.generateMockData(dataType, options);
        const content = this.formatExportData(mockData, options.format, options.template);
        const filename = `${dataType}-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
        
        this.downloadFile(content, filename, this.getMimeType(options.format));
    }

    /**
     * Show/hide export progress
     */
    showExportProgress(show) {
        const progressElement = document.getElementById('export-progress');
        if (progressElement) {
            progressElement.classList.toggle('hidden', !show);
        }
    }

    /**
     * Update export progress
     */
    updateExportProgress(percentage, status) {
        const progressBar = document.getElementById('export-progress-bar');
        const progressText = document.getElementById('export-progress-text');
        const statusElement = document.getElementById('export-status');

        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${Math.round(percentage)}%`;
        if (statusElement) statusElement.textContent = status;
    }

    /**
     * Generate mock data for demo
     */
    generateMockData(dataType, options) {
        // This would be replaced with actual data fetching
        return Array.from({ length: 20 }, (_, i) => ({
            id: `item-${i + 1}`,
            title: `Sample ${dataType.slice(0, -1)} ${i + 1}`,
            dateStart: new Date().toISOString().split('T')[0],
            speaker: `Speaker ${i + 1}`,
            location: `Location ${i + 1}`,
            createdAt: new Date().toISOString()
        }));
    }

    /**
     * Format export data based on format
     */
    formatExportData(data, format, template) {
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
            default:
                const headers = this.exportTemplates.events[template] || Object.keys(data[0] || {});
                const csvRows = [headers.join(',')];
                data.forEach(item => {
                    const row = headers.map(header => `"${item[header] || ''}"`);
                    csvRows.push(row.join(','));
                });
                return csvRows.join('\n');
        }
    }

    /**
     * Get MIME type for format
     */
    getMimeType(format) {
        const mimeTypes = {
            csv: 'text/csv',
            json: 'application/json',
            excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            pdf: 'application/pdf'
        };
        return mimeTypes[format] || 'text/plain';
    }

    /**
     * Download file utility
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Global instance will be created when services are available
let importExport = null;
