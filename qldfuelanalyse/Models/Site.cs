using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace qldfuelanalyse.Models
{
    public class Site
    {
        public int SiteId { get; set; }

        [Display(Name = "Name")]
        public string SiteName { get; set; }

        [Display(Name = "Brand")]
        public string SiteBrand { get; set; }

        [Display(Name = "Address")]
        public string SitesAddressLine1 { get; set; }

        [Display(Name = "Suburb")]
        public string SiteSuburb { get; set; }
        public string SiteState { get; set; }

        [Display(Name = "Postcode")]
        public int? SitePostCode { get; set; }
        public decimal? SiteLatitude { get; set; }
        public decimal? SiteLongitude { get; set; }

    }

    public class SitesObj
    {
        public SitesObj()
        {
            Sites = new List<Site>();
            QueryInfo = new QueryInfo();
        }

        public List<Site> Sites { get; set; }

        public QueryInfo QueryInfo { get; set; }
    }

    public partial class QueryInfo
    {
        public int RowCount { get; set; }
        public List<string> FuelTypes { get; set; }
    }
}
