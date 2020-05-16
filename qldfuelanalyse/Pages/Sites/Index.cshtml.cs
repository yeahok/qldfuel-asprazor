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
using Microsoft.AspNetCore.Mvc.Rendering;

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

        public SelectList Brands { get; set; }

        [BindProperty(SupportsGet = true)]
        public string PageNum { get; set; }

        [BindProperty(SupportsGet = true)]
        public string Search { get; set; }

        [BindProperty(SupportsGet = true)]
        public string SortBy { get; set; }

        [BindProperty(SupportsGet = true)]
        public string Brand { get; set; }

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
                sortByQuery = string.Format("&sortby={0}", SortBy);
            }
            string BrandQuery = "";
            if (!string.IsNullOrEmpty(Brand))
            {
                BrandQuery = string.Format("&brand={0}", Brand);
            }
            HttpResponseMessage response = await client.GetAsync(
                string.Format("{0}api/sites/?page={1}{2}{3}{4}", FuelApiBaseUrl, PageNum, searchQuery, sortByQuery, BrandQuery));
            SitesObj = JsonConvert.DeserializeObject<SitesObj> (
                await response.Content.ReadAsStringAsync());

            response = await client.GetAsync(
                string.Format("{0}api/sites/brands", FuelApiBaseUrl));
            var BrandsList = JsonConvert.DeserializeObject<List<string>>(
                await response.Content.ReadAsStringAsync());
            Brands = new SelectList(BrandsList);
        }
    }
}