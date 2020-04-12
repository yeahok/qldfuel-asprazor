﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace qldfuelanalyse.Models
{
    public class Prices
    {
        public int TransactionId { get; set; }
        public int SiteId { get; set; }
        public string FuelType { get; set; }
        public int Price { get; set; }
        public DateTime TransactionDateutc { get; set; }
    }
}
