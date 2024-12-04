class FilenameUtils {
  /**
   * Extracts the file name from a file URL.
   * @param fileUrl The full file URL (e.g., 'https://example.com/path/to/file.pdf').
   * @returns The file name with the extension (e.g., 'file.pdf'), or an empty string if not found.
   */
  static getFileNameFromUrl(fileUrl: string): string {
    try {
      const url = new URL(fileUrl); // Parse the URL
      const pathSegments = url.pathname.split('/'); // Split the path into segments
      return pathSegments.pop() || ''; // Return the last segment as the file name
    } catch (error) {
      console.error('Invalid URL:', error);
      return ''; // Return an empty string if the URL is invalid
    }
  }
}

export default FilenameUtils;
