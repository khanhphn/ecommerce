namespace ECommerceApi.Services;

public interface IImageService
{
    Task<string> SaveImageAsync(IFormFile imageFile);
    Task<bool> DeleteImageAsync(string imagePath);
    bool IsValidImageFile(IFormFile file);
}
