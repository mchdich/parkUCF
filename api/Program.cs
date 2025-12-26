using Microsoft.VisualBasic;
using ParkUCF.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000","https://parkucf.mehdi.ch")
              .WithMethods("GET")
              .AllowAnyHeader();
    });
});


var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
var key = Environment.GetEnvironmentVariable("SERVICE_ROLE");
if (string.IsNullOrWhiteSpace(url) || string.IsNullOrWhiteSpace(key))
{
    Console.WriteLine("ERROR: SUPABASE_URL or SERVICE_ROLE environment variable is missing or empty.");
    return;
}
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

app.UseCors();
app.UseHttpsRedirection();

app.MapGet("/api/weekly", async () =>
{
    var result = await supabase.From<WeeklyDP>().Get();
    var weekly = result.Models.Select(x => new {
        x.Id,
        x.X,
        x.Y
    });
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(weekly));
    return Results.Json(weekly);
})
.WithName("GetWeeklyForecast");

app.MapGet("/api/daily", async () =>
{
    var result = await supabase.From<DailyDP>().Get();
    var daily = result.Models.Select(x => new {
        x.Id,
        x.X,
        x.Y
    });
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(daily));
    return Results.Json(daily);
})
.WithName("GetDailyForecast");

app.MapGet("/api/daily_log", async () =>
{
    var result = await supabase.From<DailyLog>().Get();
    var daily_log = result.Models.Select(x => new {
        x.Name,
        x.Available,
        x.Occupied,
        x.Total,
        x.OccupancyRate,
        x.EventReserved,
        x.EventName,
        x.Timestamp
    });
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(daily_log));
    return Results.Json(daily_log);
})
.WithName("GetDailyLog");

app.MapGet("/api/metrics", async () =>
{
    var result = await supabase.From<Metrics>().Get();
    var metrics = result.Models.Select(x => new {
        x.Time,
        x.Timeval,
        x.Garage,
        x.Garageval,
        x.Maxsum,
        x.Maxval,
        x.Poc
    });
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(metrics));
    return Results.Json(metrics);
})
.WithName("GetMetrics");

app.Run();