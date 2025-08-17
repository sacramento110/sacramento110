/**
 * Google Drive Service
 * Handles file upload and management for event images
 */

const DriveService = {
  
  /**
   * Initialize Google Drive folder structure
   */
  initializeFolders() {
    try {
      Logger.log('Initializing Google Drive folders...');
      
      // Create main events folder
      const eventsFolder = this.getOrCreateFolder(CONFIG.DRIVE_CONFIG.EVENTS_FOLDER_NAME);
      
      // Create archive folder
      const archiveFolder = this.getOrCreateFolder(CONFIG.DRIVE_CONFIG.ARCHIVE_FOLDER_NAME, eventsFolder);
      
      // Create current year folder
      const currentYear = new Date().getFullYear().toString();
      const yearFolder = this.getOrCreateFolder(currentYear, eventsFolder);
      
      // Create current month folder
      const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
      this.getOrCreateFolder(currentMonth, yearFolder);
      
      Logger.log('Google Drive folders initialized successfully');
      return true;
      
    } catch (error) {
      Logger.log(`Failed to initialize Drive folders: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Upload event image to Google Drive
   */
  uploadEventImage(e, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-events')) {
        throw new Error('Insufficient permissions to upload images');
      }
      
      // Get the uploaded file
      const fileBlob = e.parameter.file || e.parameters.file;
      if (!fileBlob) {
        throw new Error('No file provided');
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const fileType = fileBlob.getContentType();
      
      if (!allowedTypes.includes(fileType)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (fileBlob.getBytes().length > maxSize) {
        throw new Error('File size too large. Maximum size is 10MB.');
      }
      
      // Generate unique filename
      const originalName = fileBlob.getName() || 'event-image';
      const extension = this.getFileExtension(originalName);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const fileName = `event-${timestamp}-${random}${extension}`;
      
      // Get target folder
      const targetFolder = this.getCurrentMonthFolder();
      
      // Upload file
      const file = targetFolder.createFile(fileBlob.setName(fileName));
      
      // Make file publicly viewable
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      // Generate public URL
      const publicUrl = `https://drive.google.com/uc?id=${file.getId()}`;
      
      // Log activity
      ActivityLogger.logActivity('upload', authResult.user.email, null, {
        fileName: fileName,
        fileId: file.getId(),
        fileSize: fileBlob.getBytes().length,
        fileType: fileType
      });
      
      Logger.log(`Image uploaded successfully: ${fileName}`);
      
      return {
        success: true,
        fileId: file.getId(),
        fileName: fileName,
        publicUrl: publicUrl,
        size: fileBlob.getBytes().length,
        type: fileType,
        message: 'Image uploaded successfully'
      };
      
    } catch (error) {
      Logger.log(`Error uploading image: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Delete event image from Google Drive
   */
  deleteEventImage(fileId) {
    try {
      const file = DriveApp.getFileById(fileId);
      
      // Move to archive folder instead of permanent deletion
      const archiveFolder = this.getArchiveFolder();
      file.moveTo(archiveFolder);
      
      Logger.log(`Image archived: ${fileId}`);
      return true;
      
    } catch (error) {
      Logger.log(`Error deleting image: ${error.message}`);
      // Don't throw error if file doesn't exist
      if (error.message.includes('not found')) {
        Logger.log('File not found, skipping deletion');
        return true;
      }
      throw error;
    }
  },
  
  /**
   * Get or create folder
   */
  getOrCreateFolder(folderName, parentFolder = null) {
    try {
      const parent = parentFolder || DriveApp.getRootFolder();
      const folders = parent.getFoldersByName(folderName);
      
      if (folders.hasNext()) {
        return folders.next();
      }
      
      const newFolder = parent.createFolder(folderName);
      Logger.log(`Created folder: ${folderName}`);
      return newFolder;
      
    } catch (error) {
      Logger.log(`Error creating folder ${folderName}: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get main events folder
   */
  getEventsFolder() {
    return this.getOrCreateFolder(CONFIG.DRIVE_CONFIG.EVENTS_FOLDER_NAME);
  },
  
  /**
   * Get archive folder
   */
  getArchiveFolder() {
    const eventsFolder = this.getEventsFolder();
    return this.getOrCreateFolder(CONFIG.DRIVE_CONFIG.ARCHIVE_FOLDER_NAME, eventsFolder);
  },
  
  /**
   * Get current year folder
   */
  getCurrentYearFolder() {
    const eventsFolder = this.getEventsFolder();
    const currentYear = new Date().getFullYear().toString();
    return this.getOrCreateFolder(currentYear, eventsFolder);
  },
  
  /**
   * Get current month folder
   */
  getCurrentMonthFolder() {
    const yearFolder = this.getCurrentYearFolder();
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
    return this.getOrCreateFolder(currentMonth, yearFolder);
  },
  
  /**
   * Get file extension from filename
   */
  getFileExtension(filename) {
    if (!filename || filename.indexOf('.') === -1) {
      return '.jpg'; // default extension
    }
    
    const lastDotIndex = filename.lastIndexOf('.');
    return filename.substring(lastDotIndex);
  },
  
  /**
   * Get file info by ID
   */
  getFileInfo(fileId) {
    try {
      const file = DriveApp.getFileById(fileId);
      
      return {
        id: file.getId(),
        name: file.getName(),
        size: file.getSize(),
        type: file.getBlob().getContentType(),
        created: file.getDateCreated(),
        modified: file.getLastUpdated(),
        publicUrl: `https://drive.google.com/uc?id=${file.getId()}`
      };
      
    } catch (error) {
      Logger.log(`Error getting file info: ${error.message}`);
      return null;
    }
  },
  
  /**
   * List files in events folder
   */
  listEventImages(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to list images');
      }
      
      const eventsFolder = this.getEventsFolder();
      const files = [];
      
      // Get files from current year
      const yearFolder = this.getCurrentYearFolder();
      const monthFolders = yearFolder.getFolders();
      
      while (monthFolders.hasNext()) {
        const monthFolder = monthFolders.next();
        const monthFiles = monthFolder.getFiles();
        
        while (monthFiles.hasNext()) {
          const file = monthFiles.next();
          files.push({
            id: file.getId(),
            name: file.getName(),
            size: file.getSize(),
            created: file.getDateCreated(),
            publicUrl: `https://drive.google.com/uc?id=${file.getId()}`
          });
        }
      }
      
      // Sort by creation date (newest first)
      files.sort((a, b) => b.created - a.created);
      
      return {
        success: true,
        files: files,
        count: files.length
      };
      
    } catch (error) {
      Logger.log(`Error listing images: ${error.message}`);
      return {
        success: false,
        error: error.message,
        files: [],
        count: 0
      };
    }
  },
  
  /**
   * Get storage usage statistics
   */
  getStorageStats(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view storage stats');
      }
      
      const eventsFolder = this.getEventsFolder();
      let totalSize = 0;
      let fileCount = 0;
      
      // Calculate storage usage
      const yearFolder = this.getCurrentYearFolder();
      const monthFolders = yearFolder.getFolders();
      
      while (monthFolders.hasNext()) {
        const monthFolder = monthFolders.next();
        const files = monthFolder.getFiles();
        
        while (files.hasNext()) {
          const file = files.next();
          totalSize += file.getSize();
          fileCount++;
        }
      }
      
      return {
        success: true,
        stats: {
          totalSize: totalSize,
          totalFiles: fileCount,
          averageSize: fileCount > 0 ? Math.round(totalSize / fileCount) : 0,
          formattedSize: this.formatFileSize(totalSize)
        }
      };
      
    } catch (error) {
      Logger.log(`Error getting storage stats: ${error.message}`);
      return {
        success: false,
        error: error.message,
        stats: null
      };
    }
  },
  
  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  /**
   * Test Drive connection
   */
  testConnection() {
    try {
      const eventsFolder = this.getEventsFolder();
      
      return {
        connected: true,
        folderId: eventsFolder.getId(),
        folderName: eventsFolder.getName()
      };
      
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  },
  
  /**
   * Cleanup old archived files (run periodically)
   */
  cleanupArchivedFiles() {
    try {
      const archiveFolder = this.getArchiveFolder();
      const files = archiveFolder.getFiles();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep for 90 days
      
      let deletedCount = 0;
      
      while (files.hasNext()) {
        const file = files.next();
        if (file.getDateCreated() < cutoffDate) {
          file.setTrashed(true);
          deletedCount++;
        }
      }
      
      Logger.log(`Cleaned up ${deletedCount} old archived files`);
      return deletedCount;
      
    } catch (error) {
      Logger.log(`Error cleaning up archived files: ${error.message}`);
      return 0;
    }
  }
};
