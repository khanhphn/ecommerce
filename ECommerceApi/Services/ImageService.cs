namespace ECommerceApi.Services;

public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
    
    public ImageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }
    
    public async Task<string> SaveImageAsync(IFormFile imageFile)
    {
        if (!IsValidImageFile(imageFile))
        {
            throw new ArgumentException("Invalid image file");
        }
        
        // Create uploads directory if it doesn't exist
        var uploadsDir = Path.Combine(_environment.WebRootPath, "uploads", "products");
        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }
        
        // Generate unique filename
        var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);
        
        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(stream);
        }
        
        // Return relative path for URL
        return $"/uploads/products/{fileName}";
    }
    
    public async Task<bool> DeleteImageAsync(string imagePath)
    {
        try
        {
            if (string.IsNullOrEmpty(imagePath))
                return true;
                
            // Remove leading slash if present
            if (imagePath.StartsWith('/'))
                imagePath = imagePath.Substring(1);
                
            var fullPath = Path.Combine(_environment.WebRootPath, imagePath);
            
            if (File.Exists(fullPath))
            {
                await Task.Run(() => File.Delete(fullPath));
                return true;
            }
            
            return true; // File doesn't exist, consider it deleted
        }
        catch
        {
            return false;
        }
    }
    
    public bool IsValidImageFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return false;
            
        if (file.Length > MaxFileSize)
            return false;
            
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        return _allowedExtensions.Contains(extension);
    }
}
