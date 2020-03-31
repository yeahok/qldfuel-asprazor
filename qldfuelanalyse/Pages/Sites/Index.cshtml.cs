using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using qldfuelanalyse.Models;

namespace qldfuelanalyse.Pages.Sites
{
    public class IndexModel : PageModel
    {
        static HttpClient client = new HttpClient();
        public List<Site> sites { get; set; }

        [BindProperty(SupportsGet = true)]
        public string PageNum { get; set; }

        public async Task OnGet()
        {
            if (string.IsNullOrEmpty(PageNum))
            {
                PageNum = "1";
            }
            HttpResponseMessage response = await client.GetAsync(
                string.Format("https://localhost:44338/api/sites/?page={0}", PageNum));
            sites = JsonConvert.DeserializeObject<List<Site>>(
                await response.Content.ReadAsStringAsync());            
        }
    }
}