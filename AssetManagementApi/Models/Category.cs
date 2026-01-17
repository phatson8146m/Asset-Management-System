using System. Text.Json.Serialization;
namespace AssetManagementApi.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get ; set; } = string .Empty;

    [JsonIgnore]
    public List <Asset> Assets{ get; set; } = new();
}
