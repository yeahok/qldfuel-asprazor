using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace qldfuelanalyse.Models
{
    public class Site
    {
        public int Id { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Brand")]
        public string Brand { get; set; }

        [Display(Name = "Address")]
        public string Address { get; set; }

        [Display(Name = "Suburb")]
        public string RegionLevel1 { get; set; }

        [Display(Name = "City")]
        public string RegionLevel2 { get; set; }

        [Display(Name = "Postcode")]
        public string PostCode { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        public DateTime? ModifiedDate { get; set; }

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
