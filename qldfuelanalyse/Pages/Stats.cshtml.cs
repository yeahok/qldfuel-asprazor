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
        public string FuelApiBaseUrlClient { get; set; }
        public StatsModel(IConfiguration configuration)
        {
            FuelApiBaseUrlClient = configuration.GetConnectionString("qldfuel-aspUrl-client");
        }

        public void OnGet()
        {

        }
    }
}