using System;
using SQLite;

namespace Labb2
{
	/// <summary>
	/// Entry class is used as representation of an accounting entry of either income or expense type.
	/// </summary>
	public class Entry
	{
		/// <summary>
		/// Gets the identifier used for database purposes.
		/// </summary>
		/// <value>The identifier.</value>
		[PrimaryKey, AutoIncrement]
		public int Id{private set;get;}

		/// <summary>
		/// Gets or sets a value indicating whether this instance of entry is income (true) or expense (false).
		/// </summary>
		/// <value><c>true</c> if this instance is income; otherwise, <c>false</c>.</value>
		public bool IsIncome { set; get;}

		/// <summary>
		/// Gets or sets the total amount of money to be assigned to entry. Must be 0 or higher.
		/// </summary>
		/// <value>The total amount.</value>
		public double TotalAmount { set; get;}

		/// <summary>
		/// Gets or sets the date of entry.
		/// </summary>
		/// <value>The date.</value>
		public DateTime TheDate { set; get;}

		/// <summary>
		/// Gets or sets the description of entry.
		/// </summary>
		/// <value>The description.</value>
		public string Description { set; get;}

		/// <summary>
		/// Gets or sets the tax rate assigned to instance of Entry.
		/// </summary>
		/// <value>The tax.</value>
		public int Tax { set; get;}

		/// <summary>
		/// Gets or sets the used money account.
		/// </summary>
		/// <value>The used money account.</value>
		public int UsedMoneyAccount { set; get;}

		/// <summary>
		/// Gets or sets the type account which is either income or expense account. Type is being saved as integer
		/// value representing Number property in Account instance. 
		/// </summary>
		/// <value>The type.</value>
		public int Type { set; get;}		


		/// <summary>
		/// Initializes a new instance of the <see cref="Labb2.Entry"/> class. Even though Entry takes as parameters
		/// Account and TaxRate objects, it only uses their respective identifiers-key Properties and saves to respective
		/// integer variables to represent to these objects place in database.
		/// </summary>
		/// <param name="isIncome">If set to <c>true</c> is income, otherwise is expense.</param>
		/// <param name="theDescription">The description of entry.</param>
		/// <param name="totalAmount">Total sum of money.</param>
		/// <param name="theDate">The date for entry.</param>
		/// <param name="tax">Tax rate.</param>
		/// <param name="usedAccount">Used money (transaction) account.</param>
		/// <param name="type">Account of specific type: expense account or income account.</param>
		public Entry(bool isIncome,string theDescription, double totalAmount, DateTime theDate, TaxRate tax,
																			Account usedAccount, Account type)
		{
			this.IsIncome = isIncome;
			TotalAmount = totalAmount;
			TheDate = theDate;
			Tax = tax.Id;
			UsedMoneyAccount = usedAccount.Number;
			Type = type.Number;
			Description = theDescription;
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Labb2.Entry"/> class. For database purposes.
		/// </summary>
		public Entry(){}

		/// <summary>
		/// Returns a <see cref="System.String"/> that represents the current <see cref="Labb2.Entry"/>. Used for
		/// developing and testing purposes.
		/// </summary>
		/// <returns>A <see cref="System.String"/> that represents the current <see cref="Labb2.Entry"/>.</returns>
		public override string ToString ()
		{
			return string.Format ("[Entry: IsIncome={0}, TotalAmount={1}, TheDate={2}, Description={3}, Tax={4}," +
				" UsedMoneyAccount={5}, Type={6}]", IsIncome, TotalAmount, TheDate, Description,
					Tax, UsedMoneyAccount, Type);
		}
	}
}

