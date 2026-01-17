using AssetManagementApi.Data;
using AssetManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssetsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AssetsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/assets
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Asset>>> GetAssets()
    {
        return await _context.Assets.Include(a => a.Category).ToListAsync();
    }

    // GET: api/assets/categories (สำหรับ Dropdown)
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return await _context.Categories.ToListAsync();
    }

    // POST: api/assets
    [HttpPost]
    public async Task<ActionResult<Asset>> PostAsset(Asset asset)
    {
        _context.Assets.Add(asset);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAssets), new { id = asset.Id }, asset);
    }

    // PUT: api/assets/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAsset(int id, Asset asset)
    {
        if (id != asset.Id) return BadRequest();
        _context.Entry(asset).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/assets/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsset(int id)
    {
        var asset = await _context.Assets.FindAsync(id);
        if (asset == null) return NotFound();
        _context.Assets.Remove(asset);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}