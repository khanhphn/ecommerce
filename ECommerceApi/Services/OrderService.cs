using Microsoft.EntityFrameworkCore;
using ECommerceApi.Data;
using ECommerceApi.Models;
using ECommerceApi.DTOs;

namespace ECommerceApi.Services;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto);
    Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId);
    Task<OrderDto?> GetOrderByIdAsync(int id, int userId);
    Task<bool> UpdateOrderStatusAsync(int id, string status);
}

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    
    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto)
    {
        // Validate products and calculate total
        var productIds = createOrderDto.OrderItems.Select(oi => oi.ProductId).ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToListAsync();
        
        if (products.Count != productIds.Count)
        {
            throw new InvalidOperationException("Some products are not available");
        }
        
        // Check stock availability
        foreach (var orderItem in createOrderDto.OrderItems)
        {
            var product = products.First(p => p.Id == orderItem.ProductId);
            if (product.StockQuantity < orderItem.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for product {product.Name}");
            }
        }
        
        // Create order
        var order = new Order
        {
            UserId = userId,
            ShippingAddress = createOrderDto.ShippingAddress,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            TotalAmount = 0 // Will be calculated below
        };
        
        _context.Orders.Add(order);
        await _context.SaveChangesAsync(); // Save to get order ID
        
        // Create order items
        decimal totalAmount = 0;
        foreach (var orderItemDto in createOrderDto.OrderItems)
        {
            var product = products.First(p => p.Id == orderItemDto.ProductId);
            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                ProductId = orderItemDto.ProductId,
                Quantity = orderItemDto.Quantity,
                UnitPrice = product.Price
            };
            
            totalAmount += orderItem.TotalPrice;
            _context.OrderItems.Add(orderItem);
            
            // Update product stock
            product.StockQuantity -= orderItemDto.Quantity;
        }
        
        // Update order total
        order.TotalAmount = totalAmount;
        await _context.SaveChangesAsync();
        
        // Return order DTO
        return await GetOrderDtoAsync(order.Id);
    }
    
    public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
            
        return orders.Select(MapToDto);
    }
    
    public async Task<OrderDto?> GetOrderByIdAsync(int id, int userId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
            
        return order != null ? MapToDto(order) : null;
    }
    
    public async Task<bool> UpdateOrderStatusAsync(int id, string status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;
        
        order.Status = status;
        
        if (status == "Shipped")
            order.ShippedAt = DateTime.UtcNow;
        else if (status == "Delivered")
            order.DeliveredAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return true;
    }
    
    private async Task<OrderDto> GetOrderDtoAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstAsync(o => o.Id == orderId);
            
        return MapToDto(order);
    }
    
    private OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            CreatedAt = order.CreatedAt,
            ShippedAt = order.ShippedAt,
            DeliveredAt = order.DeliveredAt,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product.Name,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        };
    }
}
