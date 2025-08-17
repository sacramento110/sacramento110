/**
 * Events Management Page
 * CRUD operations for events with image upload
 */

export class EventsPage {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentView = 'list'; // 'list', 'add', 'edit'
        this.editingEvent = null;
        this.searchQuery = '';
        this.filterStatus = 'all';
    }

    async render(user, eventsService) {
        return `
            <div class="space-y-6">
                <!-- Header with actions -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-admin-900">Events Management</h2>
                        <p class="text-admin-600">Manage all events and their details</p>
                    </div>
                    <div class="mt-4 sm:mt-0 flex space-x-3">
                        <button id="add-event-btn" class="btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add Event
                        </button>
                        <button id="refresh-events-btn" class="btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                <!-- Search and filters -->
                <div id="events-filters" class="admin-card">
                    <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div class="flex-1">
                            <input
                                type="text"
                                id="search-events"
                                placeholder="Search events by title, speaker, or location..."
                                class="form-input"
                            />
                        </div>
                        <div class="flex space-x-3">
                            <select id="filter-status" class="form-select">
                                <option value="all">All Events</option>
                                <option value="today">Today</option>
                                <option value="tomorrow">Tomorrow</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                            <button id="clear-filters-btn" class="btn-secondary">Clear</button>
                        </div>
                    </div>
                </div>

                <!-- Content area -->
                <div id="events-content">
                    <!-- Events list view -->
                    <div id="events-list-view" class="space-y-4">
                        <div class="admin-card">
                            <div class="animate-pulse space-y-4">
                                <div class="h-4 bg-admin-200 rounded w-3/4"></div>
                                <div class="h-4 bg-admin-200 rounded w-1/2"></div>
                                <div class="h-4 bg-admin-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Add/Edit event form -->
                    <div id="event-form-view" class="hidden">
                        <div class="admin-card">
                            <div class="flex items-center justify-between mb-6">
                                <h3 id="form-title" class="text-xl font-semibold text-admin-900">Add New Event</h3>
                                <button id="cancel-form-btn" class="btn-secondary">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    Cancel
                                </button>
                            </div>

                            <form id="event-form" class="space-y-6">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <!-- Left column -->
                                    <div class="space-y-6">
                                        <div class="form-group">
                                            <label for="event-title" class="form-label">Event Title *</label>
                                            <input type="text" id="event-title" name="title" class="form-input" required>
                                        </div>

                                        <div class="form-group">
                                            <label for="event-description" class="form-label">Description *</label>
                                            <textarea id="event-description" name="description" rows="4" class="form-textarea" required></textarea>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="form-group">
                                                <label for="event-date-start" class="form-label">Start Date *</label>
                                                <input type="date" id="event-date-start" name="dateStart" class="form-input" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="event-date-end" class="form-label">End Date (Multi-day events)</label>
                                                <input type="date" id="event-date-end" name="dateEnd" class="form-input">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="event-time" class="form-label">Time *</label>
                                            <input type="text" id="event-time" name="time" placeholder="e.g., 7:00 PM" class="form-input" required>
                                        </div>
                                    </div>

                                    <!-- Right column -->
                                    <div class="space-y-6">
                                        <div class="form-group">
                                            <label for="event-speaker" class="form-label">Speaker *</label>
                                            <input type="text" id="event-speaker" name="speaker" class="form-input" required>
                                        </div>

                                        <div class="form-group">
                                            <label for="event-hosted-by" class="form-label">Hosted By *</label>
                                            <input type="text" id="event-hosted-by" name="hostedBy" class="form-input" required>
                                        </div>

                                        <div class="form-group">
                                            <label for="event-location" class="form-label">Location *</label>
                                            <input type="text" id="event-location" name="location" class="form-input" required>
                                        </div>

                                        <div class="form-group">
                                            <label for="event-image" class="form-label">Event Image</label>
                                            <div class="mt-1">
                                                <input type="file" id="event-image" name="image" accept="image/*" class="form-input">
                                                <p class="mt-2 text-sm text-admin-600">
                                                    Upload an image for the event (max 10MB). Supported formats: JPG, PNG, GIF, WebP
                                                </p>
                                            </div>
                                            
                                            <!-- Current image preview -->
                                            <div id="current-image-preview" class="hidden mt-4">
                                                <p class="text-sm font-medium text-admin-700 mb-2">Current Image:</p>
                                                <img id="current-image" src="" alt="Current event image" class="w-32 h-32 object-cover rounded-lg border border-admin-200">
                                            </div>
                                            
                                            <!-- New image preview -->
                                            <div id="image-preview" class="hidden mt-4">
                                                <p class="text-sm font-medium text-admin-700 mb-2">New Image Preview:</p>
                                                <img id="preview-image" src="" alt="Image preview" class="w-32 h-32 object-cover rounded-lg border border-admin-200">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Form actions -->
                                <div class="flex items-center justify-end space-x-4 pt-6 border-t border-admin-200">
                                    <button type="button" id="cancel-form-btn-2" class="btn-secondary">Cancel</button>
                                    <button type="submit" id="save-event-btn" class="btn-primary">
                                        <span id="save-btn-text">Save Event</span>
                                        <div id="save-btn-spinner" class="hidden loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Delete confirmation modal -->
                <div id="delete-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-admin-900">Delete Event</h3>
                        </div>
                        <p class="text-admin-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
                        <div class="flex space-x-3">
                            <button id="cancel-delete-btn" class="flex-1 btn-secondary">Cancel</button>
                            <button id="confirm-delete-btn" class="flex-1 btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async initialize(user, eventsService) {
        this.user = user;
        this.eventsService = eventsService;
        
        await this.loadEvents();
        this.setupEventListeners();
        this.showListView();
    }

    async loadEvents() {
        try {
            const result = await this.eventsService.getEvents();
            
            if (result.success) {
                this.events = result.events || [];
                this.applyFilters();
                this.renderEventsList();
            } else {
                console.error('Failed to load events:', result.error);
                this.showError(result.error || 'Failed to load events');
            }
        } catch (error) {
            console.error('Error loading events:', error);
            this.showError('Unable to connect to backend');
        }
    }

    setupEventListeners() {
        // Add event button
        document.getElementById('add-event-btn')?.addEventListener('click', () => this.showAddForm());
        
        // Refresh button
        document.getElementById('refresh-events-btn')?.addEventListener('click', () => this.loadEvents());
        
        // Search and filters
        document.getElementById('search-events')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.applyFilters();
            this.renderEventsList();
        });
        
        document.getElementById('filter-status')?.addEventListener('change', (e) => {
            this.filterStatus = e.target.value;
            this.applyFilters();
            this.renderEventsList();
        });
        
        document.getElementById('clear-filters-btn')?.addEventListener('click', () => this.clearFilters());
        
        // Form buttons
        document.getElementById('cancel-form-btn')?.addEventListener('click', () => this.showListView());
        document.getElementById('cancel-form-btn-2')?.addEventListener('click', () => this.showListView());
        
        // Form submission
        document.getElementById('event-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Image preview
        document.getElementById('event-image')?.addEventListener('change', (e) => this.handleImageSelect(e));
        
        // Delete modal
        document.getElementById('cancel-delete-btn')?.addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('confirm-delete-btn')?.addEventListener('click', () => this.confirmDelete());
    }

    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            // Search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                const searchText = `${event.title} ${event.speaker} ${event.location}`.toLowerCase();
                if (!searchText.includes(query)) return false;
            }
            
            // Status filter
            if (this.filterStatus !== 'all') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const eventStart = new Date(event.dateStart);
                eventStart.setHours(0, 0, 0, 0);
                
                const eventEnd = event.dateEnd ? new Date(event.dateEnd) : eventStart;
                eventEnd.setHours(23, 59, 59, 999);
                
                switch (this.filterStatus) {
                    case 'today':
                        if (!(today >= eventStart && today <= eventEnd)) return false;
                        break;
                    case 'tomorrow':
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        if (eventStart.getTime() !== tomorrow.getTime()) return false;
                        break;
                    case 'upcoming':
                        if (eventEnd < today) return false;
                        break;
                    case 'past':
                        if (eventEnd >= today) return false;
                        break;
                }
            }
            
            return true;
        });
    }

    renderEventsList() {
        const container = document.getElementById('events-list-view');
        
        if (this.filteredEvents.length === 0) {
            container.innerHTML = `
                <div class="admin-card">
                    <div class="text-center py-12">
                        <svg class="w-16 h-16 text-admin-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-admin-900 mb-2">No events found</h3>
                        <p class="text-admin-600 mb-4">
                            ${this.searchQuery || this.filterStatus !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first event'}
                        </p>
                        <button onclick="document.getElementById('add-event-btn').click()" class="btn-primary">
                            Add Event
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="admin-card">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-admin-200">
                        <thead class="bg-admin-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Event</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Date & Time</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Speaker</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Location</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-admin-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-admin-200">
                            ${this.filteredEvents.map(event => this.renderEventRow(event)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderEventRow(event) {
        const status = this.getEventStatus(event);
        const statusBadge = this.getStatusBadge(status);
        const dateRange = this.eventsService.formatEventDateRange(event.dateStart, event.dateEnd);
        
        return `
            <tr class="hover:bg-admin-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-12 w-12">
                            <img class="h-12 w-12 rounded-lg object-cover" src="${event.imageUrl}" alt="${event.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzYiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+'">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-admin-900">${event.title}</div>
                            <div class="text-sm text-admin-500 truncate max-w-xs">${event.description}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-admin-900">${dateRange}</div>
                    <div class="text-sm text-admin-500">${event.time}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-admin-900">${event.speaker}</div>
                    <div class="text-sm text-admin-500">${event.hostedBy}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-admin-500">
                    ${event.location}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${statusBadge}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                        <button onclick="window.adminApp.currentPage === 'events' && window.adminApp.pages.events.editEvent('${event.id}')" 
                                class="text-islamic-green-600 hover:text-islamic-green-900">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        ${this.user.permissions && this.user.permissions.includes('delete-events') ? `
                        <button onclick="window.adminApp.currentPage === 'events' && window.adminApp.pages.events.deleteEvent('${event.id}')" 
                                class="text-red-600 hover:text-red-900">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }

    getEventStatus(event) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const eventStart = new Date(event.dateStart);
        eventStart.setHours(0, 0, 0, 0);
        
        const eventEnd = event.dateEnd ? new Date(event.dateEnd) : eventStart;
        eventEnd.setHours(23, 59, 59, 999);
        
        if (today >= eventStart && today <= eventEnd) {
            return event.dateEnd ? 'ongoing' : 'today';
        }
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (eventStart.getTime() === tomorrow.getTime()) {
            return 'tomorrow';
        }
        
        if (eventEnd >= today) {
            return 'upcoming';
        }
        
        return 'past';
    }

    getStatusBadge(status) {
        const badges = {
            today: '<span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Today</span>',
            tomorrow: '<span class="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">Tomorrow</span>',
            ongoing: '<span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Ongoing</span>',
            upcoming: '<span class="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Upcoming</span>',
            past: '<span class="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Past</span>'
        };
        return badges[status] || badges.upcoming;
    }

    showListView() {
        this.currentView = 'list';
        document.getElementById('events-list-view').classList.remove('hidden');
        document.getElementById('event-form-view').classList.add('hidden');
        document.getElementById('events-filters').classList.remove('hidden');
    }

    showAddForm() {
        this.currentView = 'add';
        this.editingEvent = null;
        document.getElementById('events-list-view').classList.add('hidden');
        document.getElementById('event-form-view').classList.remove('hidden');
        document.getElementById('events-filters').classList.add('hidden');
        document.getElementById('form-title').textContent = 'Add New Event';
        document.getElementById('save-btn-text').textContent = 'Save Event';
        this.resetForm();
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        
        this.currentView = 'edit';
        this.editingEvent = event;
        document.getElementById('events-list-view').classList.add('hidden');
        document.getElementById('event-form-view').classList.remove('hidden');
        document.getElementById('events-filters').classList.add('hidden');
        document.getElementById('form-title').textContent = 'Edit Event';
        document.getElementById('save-btn-text').textContent = 'Update Event';
        this.populateForm(event);
    }

    populateForm(event) {
        document.getElementById('event-title').value = event.title || '';
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-date-start').value = event.dateStart || '';
        document.getElementById('event-date-end').value = event.dateEnd || '';
        document.getElementById('event-time').value = event.time || '';
        document.getElementById('event-speaker').value = event.speaker || '';
        document.getElementById('event-hosted-by').value = event.hostedBy || '';
        document.getElementById('event-location').value = event.location || '';
        
        // Show current image
        if (event.imageUrl) {
            const currentImagePreview = document.getElementById('current-image-preview');
            const currentImage = document.getElementById('current-image');
            currentImagePreview.classList.remove('hidden');
            currentImage.src = event.imageUrl;
        }
    }

    resetForm() {
        document.getElementById('event-form').reset();
        document.getElementById('current-image-preview').classList.add('hidden');
        document.getElementById('image-preview').classList.add('hidden');
    }

    handleImageSelect(e) {
        const file = e.target.files[0];
        if (!file) {
            document.getElementById('image-preview').classList.add('hidden');
            return;
        }
        
        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            e.target.value = '';
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('File size must be less than 10MB');
            e.target.value = '';
            return;
        }
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            const previewImage = document.getElementById('preview-image');
            preview.classList.remove('hidden');
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const eventData = Object.fromEntries(formData.entries());
        
        // Remove empty dateEnd
        if (!eventData.dateEnd) {
            delete eventData.dateEnd;
        }
        
        this.setFormLoading(true);
        
        try {
            let imageResult = null;
            
            // Upload image if provided
            if (eventData.image && eventData.image.size > 0) {
                imageResult = await this.eventsService.uploadEventImage(eventData.image);
                if (!imageResult.success) {
                    throw new Error(imageResult.error || 'Image upload failed');
                }
            }
            
            // Prepare event data
            const eventPayload = {
                title: eventData.title,
                description: eventData.description,
                dateStart: eventData.dateStart,
                dateEnd: eventData.dateEnd,
                time: eventData.time,
                speaker: eventData.speaker,
                hostedBy: eventData.hostedBy,
                location: eventData.location
            };
            
            // Add image data if uploaded
            if (imageResult) {
                eventPayload.imageDriveId = imageResult.fileId;
                eventPayload.imageUrl = imageResult.publicUrl;
            } else if (this.editingEvent) {
                // Keep existing image for updates
                eventPayload.imageDriveId = this.editingEvent.imageDriveId;
                eventPayload.imageUrl = this.editingEvent.imageUrl;
            }
            
            // Create or update event
            let result;
            if (this.editingEvent) {
                result = await this.eventsService.updateEvent(this.editingEvent.id, eventPayload);
            } else {
                result = await this.eventsService.createEvent(eventPayload);
            }
            
            if (result.success) {
                this.showSuccess(`Event ${this.editingEvent ? 'updated' : 'created'} successfully`);
                await this.loadEvents();
                this.showListView();
            } else {
                throw new Error(result.error || `Failed to ${this.editingEvent ? 'update' : 'create'} event`);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError(error.message);
        } finally {
            this.setFormLoading(false);
        }
    }

    deleteEvent(eventId) {
        this.eventToDelete = eventId;
        document.getElementById('delete-modal').classList.remove('hidden');
    }

    hideDeleteModal() {
        document.getElementById('delete-modal').classList.add('hidden');
        this.eventToDelete = null;
    }

    async confirmDelete() {
        if (!this.eventToDelete) return;
        
        try {
            const result = await this.eventsService.deleteEvent(this.eventToDelete);
            
            if (result.success) {
                this.showSuccess('Event deleted successfully');
                await this.loadEvents();
            } else {
                throw new Error(result.error || 'Failed to delete event');
            }
        } catch (error) {
            console.error('Delete error:', error);
            this.showError(error.message);
        } finally {
            this.hideDeleteModal();
        }
    }

    clearFilters() {
        this.searchQuery = '';
        this.filterStatus = 'all';
        document.getElementById('search-events').value = '';
        document.getElementById('filter-status').value = 'all';
        this.applyFilters();
        this.renderEventsList();
    }

    setFormLoading(loading) {
        const saveBtn = document.getElementById('save-event-btn');
        const saveBtnText = document.getElementById('save-btn-text');
        const saveBtnSpinner = document.getElementById('save-btn-spinner');
        
        if (loading) {
            saveBtn.disabled = true;
            saveBtnText.textContent = 'Saving...';
            saveBtnSpinner.classList.remove('hidden');
        } else {
            saveBtn.disabled = false;
            saveBtnText.textContent = this.editingEvent ? 'Update Event' : 'Save Event';
            saveBtnSpinner.classList.add('hidden');
        }
    }

    showSuccess(message) {
        // Simple success notification - could be enhanced with toast
        alert(message);
    }

    showError(message) {
        // Simple error notification - could be enhanced with toast
        alert('Error: ' + message);
    }
}
