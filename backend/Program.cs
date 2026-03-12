using ClicZoneApi.Models;
using ClicZoneApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<ProductService>();

// Allow CORS from Next.js dev server
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// --- Health check ---
app.MapGet("/api/health", () => new { status = "ok", timestamp = DateTime.UtcNow })
   .WithName("HealthCheck")
   .WithOpenApi();

// --- Products CRUD ---
var products = app.MapGroup("/api/products").WithOpenApi();

products.MapGet("/", (ProductService svc) => svc.GetAll())
    .WithName("GetProducts");

products.MapGet("/{id:int}", (int id, ProductService svc) =>
    svc.GetById(id) is { } product
        ? Results.Ok(product)
        : Results.NotFound(new { error = "Product not found" }))
    .WithName("GetProduct");

products.MapPost("/", (CreateProductRequest request, ProductService svc) =>
{
    var product = svc.Create(request);
    return Results.Created($"/api/products/{product.Id}", product);
}).WithName("CreateProduct");

products.MapPut("/{id:int}", (int id, CreateProductRequest request, ProductService svc) =>
    svc.Update(id, request) is { } product
        ? Results.Ok(product)
        : Results.NotFound(new { error = "Product not found" }))
    .WithName("UpdateProduct");

products.MapDelete("/{id:int}", (int id, ProductService svc) =>
    svc.Delete(id)
        ? Results.NoContent()
        : Results.NotFound(new { error = "Product not found" }))
    .WithName("DeleteProduct");

app.Run();
