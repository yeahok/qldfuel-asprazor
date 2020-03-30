using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace qldfuelanalyse.Models
{
    public class Site
    {
        public int SiteId { get; set; }
        public string SiteName { get; set; }
        public string SiteBrand { get; set; }
        public string SitesAddressLine1 { get; set; }
        public string SiteSuburb { get; set; }
        public string SiteState { get; set; }
        public int? SitePostCode { get; set; }
        public decimal? SiteLatitude { get; set; }
        public decimal? SiteLongitude { get; set; }

    }
}
