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
    public class IndexModel : PageModel
    {
        public string FuelApiBaseUrl { get; set; }
        public IndexModel(IConfiguration configuration)
        {
            FuelApiBaseUrl = configuration.GetConnectionString("qldfuel-aspUrl-server");
        }

        static HttpClient client = new HttpClient();
        public SitesObj SitesObj { get; set; }

        [BindProperty(SupportsGet = true)]
        public string PageNum { get; set; }

        [BindProperty(SupportsGet = true)]
        public string Search { get; set; }

        [BindProperty(SupportsGet = true)]
        public string SortBy { get; set; }

        public async Task OnGet()
        {
            if (string.IsNullOrEmpty(PageNum))
            {
                PageNum = "1";
            }
            string searchQuery = "";
            if (!string.IsNullOrEmpty(Search))
            {
                searchQuery = string.Format("&search={0}", Search);
            }
            string sortByQuery = "";
            if (!string.IsNullOrEmpty(SortBy))
            {
                searchQuery = string.Format("&sortby={0}", SortBy);
            }
            Console.WriteLine(searchQuery);
            HttpResponseMessage response = await client.GetAsync(
                string.Format("{0}api/sites/?page={1}{2}{3}", FuelApiBaseUrl, PageNum, searchQuery, sortByQuery));
            SitesObj = JsonConvert.DeserializeObject<SitesObj> (
                await response.Content.ReadAsStringAsync());
        }
    }
}