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
.WithName("GetDailyForecast");

app.Run();