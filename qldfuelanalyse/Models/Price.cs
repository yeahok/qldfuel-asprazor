using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace qldfuelanalyse.Models
{
    public class Prices
    {
        public int Id { get; set; }
        public int SiteId { get; set; }
        public string FuelName { get; set; }
        public int Amount { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}
