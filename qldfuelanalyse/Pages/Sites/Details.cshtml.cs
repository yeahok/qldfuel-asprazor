﻿using System;
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
    public class DetailsModel : PageModel
    {
        static HttpClient client = new HttpClient();
        public Site Site { get; set; }

        public async Task OnGet(int? id)
        {
            HttpResponseMessage response = await client.GetAsync(
                String.Format("https://localhost:44338/api/sites/{0}", id));
            Site = JsonConvert.DeserializeObject<Site>(
                await response.Content.ReadAsStringAsync());
        }
    }
}