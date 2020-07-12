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

        public int TotalPages { get; set; }

        [BindProperty(SupportsGet = true)]
        public int PerPage { get; set; }
        public IEnumerable<int> PageNumRange { get; set; }

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

            if (PerPage < 10)
            {
                PerPage = 10;
            }
            string PerPageQuery = string.Format("&limit={0}", PerPage);

            HttpResponseMessage response = await client.GetAsync(
                string.Format("{0}api/sites/?page={1}{2}{3}{4}{5}", FuelApiBaseUrl, PageNum, searchQuery, sortByQuery, BrandQuery, PerPageQuery));
            SitesObj = JsonConvert.DeserializeObject<SitesObj> (
                await response.Content.ReadAsStringAsync());

            response = await client.GetAsync(
                string.Format("{0}api/brands", FuelApiBaseUrl));
            var BrandsList = JsonConvert.DeserializeObject<List<string>>(
                await response.Content.ReadAsStringAsync());
            Brands = new SelectList(BrandsList);

            TotalPages = (int)Math.Ceiling((double)SitesObj.QueryInfo.RowCount / (double)PerPage);
            PageNumRange = CreatePageRange(int.Parse(PageNum), TotalPages);
        }

        public IEnumerable<int> CreatePageRange(int PageNum, int TotalPages)
        {
            //not good
            int start;
            int count;
            if (TotalPages < 5)
            {
                count = TotalPages;
                start = 1;
            }
            else if (PageNum < 3)
            {
                count = 5;
                start = 1;
            }
            else if (TotalPages <= PageNum + 2)
            {
                count = 5;
                start = TotalPages - 4;
            }
            else
            {
                count = 5;
                start = PageNum - 2;
            }
            return Enumerable.Range(start, count);
        }
    }
}