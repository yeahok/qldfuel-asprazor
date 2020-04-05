using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace qldfuelanalyse.Pages
{
    public class StatsModel : PageModel
    {
        public string FuelApiBaseUrl { get; set; }
        public StatsModel(IConfiguration configuration)
        {
            FuelApiBaseUrl = configuration.GetConnectionString("qldfuel-aspwebapiUrl");
        }

        public void OnGet()
        {

        }
    }
}