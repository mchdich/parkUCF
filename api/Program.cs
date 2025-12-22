using Microsoft.VisualBasic;
using ParkUCF.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
var key = Environment.GetEnvironmentVariable("SERVICE_ROLE");
var options = new Supabase.SupabaseOptions
{
    AutoConnectRealtime = true
};
var supabase = new Supabase.Client(url, key, options);
await supabase.InitializeAsync();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/api/weekly", async () =>
{
    var result = await supabase.From<WeeklyDP>().Get();
    var weekly = result.Models;
    return weekly;
})
.WithName("GetWeeklyForecast");

app.MapGet("/api/daily", async () =>
{
    var result = await supabase.From<DailyDP>().Get();
    var daily = result.Models;
    return daily;
})
.WithName("GetWeeklyForecast");

app.Run();