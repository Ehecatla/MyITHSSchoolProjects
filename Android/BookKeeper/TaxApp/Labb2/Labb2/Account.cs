using System;
using SQLite;

namespace Labb2
{
	/// <summary>
	/// Class Account is used by Entry class. It handles account data which is name, number and type of account (either
	/// income or expense account).
	/// </summary>
	public class Account
	{
		/// <summary>
		/// Gets or sets the name of the account.
		/// </summary>
		/// <value>The account name.</value>
		public string Name { set; get;}

		/// <summary>
		/// Gets or sets the account number. Number is supposed to be unique!
		/// </summary>
		/// <value>The account number.</value>
		[PrimaryKey]
		public int Number { set; get;}

		/// <summary>
		/// Gets or sets the type of account. -1 is expense account, 0 is transaction account, 1 is income account
		/// </summary>
		/// <value>The type.</value>
		public int Type { set; get;}

		/// <summary>
		/// Initializes a new instance of the <see cref="Labb2.Account"/> class and assigns parameter values to its
		/// property variables in order name, number and account type.
		/// </summary>
		/// <param name="n">N.</param>
		/// <param name="nr">Nr.</param>
		/// <param name="isIA">If set to <c>true</c> is I.</param>
		public Account (string n, int nr, int type)			
		{
			Name = n;
			Number = nr;
			Type = type;
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Labb2.Account"/> class. For db purposes.
		/// </summary>
		public Account(){}

		/// <summary>
		/// Returns a <see cref="System.String"/> that represents the current <see cref="Labb2.Account"/>.
		/// </summary>
		/// <returns>A <see cref="System.String"/> that represents the current <see cref="Labb2.Account"/>.</returns>
		public override string ToString ()
		{
			return string.Format ("{0}({1})", Name, Number);
		}
	}
}

