using System;
using SQLite;

namespace Labb2
{
	/// <summary>
	/// TaxRate class is used by Entry class to register an income or expenditure. This class represents tax rate in
	/// procent.
	/// </summary>
	public class TaxRate
	{
		/// <summary>
		/// Gets the identifier used as primary key for database purposes.
		/// </summary>
		/// <value>The identifier.</value>
		[PrimaryKey, AutoIncrement]
		public int Id{private set; get;}

		/// <summary>
		/// Gets or sets the tax rate. Tax rate is supposed to be given in decimal number that represents procent.
		/// </summary>
		/// <value>The tax.</value>
		public double Tax{ set; get;}


		/// <summary>
		/// Initializes a new instance of the <see cref="Labb2.TaxRate"/> class and assigns parameters value to tax variable.
		/// </summary>
		/// <param name="actualTax">Actual tax.</param>
		public TaxRate(double actualTax)
		{
			Tax = actualTax;
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Labb2.TaxRate"/> class. For database purposes.
		/// </summary>
		public TaxRate(){}


		/// <summary>
		/// Returns a <see cref="System.String"/> that represents the current <see cref="Labb2.TaxRate"/> in a % format.
		/// </summary>
		/// <returns>A <see cref="System.String"/> that represents the current <see cref="Labb2.TaxRate"/>.</returns>
		public override string ToString ()
		{
			return string.Format ("{0}%", (Tax*100));
		}
	}
}

