using ClicZoneApi.Models;

namespace ClicZoneApi.Services;

public class ProductService
{
    private readonly List<Product> _products = new();
    private int _nextId = 1;

    public List<Product> GetAll() => _products;

    public Product? GetById(int id) => _products.FirstOrDefault(p => p.Id == id);

    public Product Create(CreateProductRequest request)
    {
        var product = new Product
        {
            Id = _nextId++,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock
        };
        _products.Add(product);
        return product;
    }

    public Product? Update(int id, CreateProductRequest request)
    {
        var product = GetById(id);
        if (product is null) return null;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        return product;
    }

    public bool Delete(int id)
    {
        var product = GetById(id);
        if (product is null) return false;

        _products.Remove(product);
        return true;
    }
}
