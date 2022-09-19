using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy hh:mm:ss}")]
        public DateTime TransactionDate { get; set; }
    }
}
