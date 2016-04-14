using System;
using System.Collections.Generic;
using SQLite;
using System.Linq;

namespace Labb2
{
	/// <summary>
	/// Bookkeeper manager class is the backend class handling database for the application.
	/// </summary>
	public class BookkeeperManager
	{

		private SQLiteConnection db;

		/// <summary>
		/// Gets the entries saved in database.
		/// </summary>
		/// <value>The entries sorted by date.</value>
		public List<Entry> Entries
		{ 
			private set{ ;}
			get{ return db.Table<Entry>().OrderByDescending(d => d.TheDate).ToList();}
		}
			
		/// <summary>
		/// Gets the expense accounts which are marked by -1 type in the database.
		/// </summary>
		/// <value>The expense accounts.</value>
		public List<Account> ExpenseAccounts 
		{
			get{ return db.Table<Account>().Where (a => (a.Type == -1)).OrderBy(b=> b.Name).ToList ();}
		}	

		/// <summary>
		/// Gets the income accounts which are marked by 1 type in the database.
		/// </summary>
		/// <value>The income accounts.</value>
		public List<Account> IncomeAccounts 
		{
			get{ return db.Table<Account> ().Where (a => (a.Type == 1)).OrderBy(b=> b.Name).ToList ();}
		}

		/// <summary>
		/// Gets the money accounts which are marked by 0 type in the database.
		/// </summary>
		/// <value>The money accounts.</value>
		public List<Account> MoneyAccounts 
		{
			get{ return db.Table<Account> ().Where (a => (a.Type == 0)).OrderBy(b=> b.Name).ToList ();}
		}

		/// <summary>
		/// Gets the tax rates.
		/// </summary>
		/// <value>The tax rates.</value>
		public List<TaxRate> TaxRates 
		{
			get{ return db.Table<TaxRate> ().OrderBy(t=>t.Tax).ToList ();}
		}

		private static BookkeeperManager instance = null;

		/// <summary>
		/// Gets the instance of BookkeeperManager, creates one if the instance variable is null.
		/// </summary>
		/// <value>The instance of BookkeeperManager.</value>
		public static BookkeeperManager Instance 
		{
			get
			{
				if (instance == null) {
					instance = new BookkeeperManager ();
				}
				return instance;
			}
			private set{ ;}
		}

		private BookkeeperManager ()
		{
			string path;
			path = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
			db = new SQLiteConnection(path + @"\Edatabase.db");
			try{
				db.Table<Account> ().Count ();
			}
			catch (SQLiteException e){
				db.CreateTable<TaxRate> ();
				db.CreateTable<Account> ();
				db.CreateTable<Entry> ();
				CreateFirstStartData ();
			}
		}


		/// <summary>
		/// Adds the entry.
		/// </summary>
		/// <returns><c>true</c>, if entry was added, <c>false</c> otherwise.</returns>
		/// <param name="entry">Entry object to be added to database</param>
		public bool AddEntry(Entry entry) 
		{
			bool isAdded = true;	
			try{
				db.Insert(entry);
			}catch(Exception e){
				isAdded = false;
			}
			return isAdded;
		}
			
		/// <summary>
		/// Creates tax report by getting all necessary data from database, doing all the needed calculations and
		/// returns one string containing the report.
		/// </summary>
		/// <returns>The tax report.</returns>
		public string GetTaxReport()
		{
			string taxReport="";
			double totalToPay = 0.0;
			foreach(Entry e in Entries)
			{
				double tax = (TaxRates.Where (t => t.Id == e.Tax).First ()).Tax;
				double taxedSum = e.TotalAmount * tax;
				string type = "";
				if (e.IsIncome) 		// created entry objects have IsIncome value synced with account Type
				{ 					
					totalToPay +=taxedSum;
				} 
				else 
				{
					type += "-";
					totalToPay -= taxedSum; 
				}
				string row = string.Format ("{0} - {1}, {2}{3} kr\n",
					e.TheDate.ToString("yyyy-mm-dd"), e.Description, type,taxedSum.ToString("F2") );
				taxReport += row;
			}

			taxReport += string.Format ("Totally to pay: {0}", totalToPay.ToString("F2"));
			Console.WriteLine (taxReport);
			return taxReport;
		}


		/// <summary>
		/// Creates data for SQLite database to be used when app is started for the first time. Default tax rates and
		/// different type of income, expense and money accounts are added to database referenced in variable db
		///  in BookkeperManagers object.
		/// </summary>
		private void CreateFirstStartData()
		{
			TaxRate t1 = new TaxRate (0.07);
			TaxRate t2 = new TaxRate (0.25);
			TaxRate t3 = new TaxRate (0.06);
			db.Insert (t1);
			db.Insert (t2);
			db.Insert (t3);

			Account moneyA1 = new Account ("Money account A", 2050, 0);
			Account moneyA2 = new Account ("Money account B", 3001, 0);

			Account incomeA1 = new Account ("Income Account A", 1000, 1);
			Account incomeA2 = new Account ("Income Account B", 4040, 1);
			Account incomeA3 = new Account ("Income Account C", 2059, 1);

			Account expense1 = new Account ("Expense Account A", 1020, -1);
			Account expense2 = new Account ("Expense Account B", 3040, -1);
			Account expense3 = new Account ("Expense Account C", 1100, -1);

			List<Account> accList = new List<Account>{moneyA1,moneyA2, incomeA1,incomeA2,incomeA3,
																					expense1, expense2, expense3};
			db.InsertAll (accList);	
		}

	}
}

