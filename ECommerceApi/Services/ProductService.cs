using Microsoft.EntityFrameworkCore;
using ECommerceApi.Data;
using ECommerceApi.Models;
using ECommerceApi.DTOs;

namespace ECommerceApi.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
    Task<ProductDto> CreateProductWithFileAsync(CreateProductWithFileDto createProductDto, IFormFile imageFile);
    Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto);
    Task<bool> DeleteProductAsync(int id);
    Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category);
}

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly IImageService _imageService;
    
    public ProductService(ApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }
    
    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _context.Products
            .Where(p => p.IsActive)
            .ToListAsync();
            
        return products.Select(MapToDto);
    }
    
    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
            
        return product != null ? MapToDto(product) : null;
    }
    
    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
    {
        var product = new Product
        {
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            Price = createProductDto.Price,
            StockQuantity = createProductDto.StockQuantity,
            ImageUrl = createProductDto.ImageUrl,
            Category = createProductDto.Category,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        return MapToDto(product);
    }
    
    public async Task<ProductDto> CreateProductWithFileAsync(CreateProductWithFileDto createProductDto, IFormFile imageFile)
    {
        // Save the image file
        string imageUrl = string.Empty;
        if (imageFile != null && imageFile.Length > 0)
        {
            imageUrl = await _imageService.SaveImageAsync(imageFile);
        }
        
        var product = new Product
        {
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            Price = createProductDto.Price,
            StockQuantity = createProductDto.StockQuantity,
            ImageUrl = imageUrl,
            Category = createProductDto.Category,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        
        return MapToDto(product);
    }
    
    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;
        
        if (!string.IsNullOrEmpty(updateProductDto.Name))
            product.Name = updateProductDto.Name;
        if (!string.IsNullOrEmpty(updateProductDto.Description))
            product.Description = updateProductDto.Description;
        if (updateProductDto.Price.HasValue)
            product.Price = updateProductDto.Price.Value;
        if (updateProductDto.StockQuantity.HasValue)
            product.StockQuantity = updateProductDto.StockQuantity.Value;
        if (!string.IsNullOrEmpty(updateProductDto.ImageUrl))
            product.ImageUrl = updateProductDto.ImageUrl;
        if (!string.IsNullOrEmpty(updateProductDto.Category))
            product.Category = updateProductDto.Category;
        if (updateProductDto.IsActive.HasValue)
            product.IsActive = updateProductDto.IsActive.Value;
        
        await _context.SaveChangesAsync();
        return MapToDto(product);
    }
    
    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;
        
        product.IsActive = false; // Soft delete
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category)
    {
        var products = await _context.Products
            .Where(p => p.IsActive && p.Category.ToLower() == category.ToLower())
            .ToListAsync();
            
        return products.Select(MapToDto);
    }
    
    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            Category = product.Category,
            IsActive = product.IsActive
        };
    }
}
