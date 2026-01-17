using System. ComponentModel.DataAnnotations;
namespace AssetManagementApi.Models;

public class Asset
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Asset Name is required")]
    public string AssetName {get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? SerialNumber { get; set; }
    
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}