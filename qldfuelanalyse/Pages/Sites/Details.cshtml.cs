using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using qldfuelanalyse.Models;
using Microsoft.Extensions.Configuration;

namespace qldfuelanalyse.Pages.Sites
{
    public class DetailsModel : PageModel
    {
        public string FuelApiBaseUrl { get; set; }
        public string FuelApiBaseUrlClient { get; set; }
        public DetailsModel(IConfiguration configuration)
        {
            FuelApiBaseUrl = configuration.GetConnectionString("qldfuel-aspUrl-server");
            FuelApiBaseUrlClient = configuration.GetConnectionString("qldfuel-aspUrl-client");
        }
        static HttpClient client = new HttpClient();
        public SitesObj SitesObj { get; set; }

        public async Task OnGet(int? id)
        {
            HttpResponseMessage response = await client.GetAsync(
                String.Format("{0}api/sites/{1}", FuelApiBaseUrl, id));
            SitesObj = JsonConvert.DeserializeObject<SitesObj>(
                await response.Content.ReadAsStringAsync());
        }
    }
}