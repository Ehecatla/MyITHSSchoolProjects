
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace Labb2
{
	/// <summary>
	/// Entry details activity is used to display one, chosen entry detailed information that is retrieved from database.
	/// </summary>
	[Activity (Label = "Entry Details")]			
	public class EntryDetailsActivity : Activity
	{
		/// <summary>
		/// This class variable is used by EntryListActivity to send extra information about which entry information is
		/// to be displayed.
		/// </summary>
		public static string ENTRY_INFO="entry info";

		private TextView entryTitle;
		private TextView entryBody;

		protected override void OnCreate (Bundle savedInstanceState)
		{
			base.OnCreate (savedInstanceState);
			SetContentView(Resource.Layout.EntryDetails);

			entryTitle = FindViewById<TextView> (Resource.Id.entry_details_title);
			entryBody = FindViewById<TextView> (Resource.Id.entry_details_body);
			int entryId = Intent.GetIntExtra (ENTRY_INFO, -1);
			DisplayEntryInformation (entryId);
		}

		/// <summary>
		/// Method DisplayEntryInformation displays information of an entry with given Id in parameter nr. Information
		/// is retrieved from database used in application.
		/// </summary>
		/// <param name="nr">Nr.</param>
		private void DisplayEntryInformation(int nr)
		{			
			if (nr > -1) 
			{
				BookkeeperManager bkm = BookkeeperManager.Instance;
				Entry e = bkm.Entries.Where(p => p.Id == nr).FirstOrDefault ();
				if (e != null) 
				{
					
					string date = (Resources.GetString(Resource.String.new_entry_tv_2)) + e.TheDate.ToString ("yyyy-MM-dd");

					string description =(Resources.GetString(Resource.String.new_entry_tv_3)) + e.Description;
					string sum = (Resources.GetString(Resource.String.new_entry_tv_6)) + Convert.ToString (e.TotalAmount);
					string moneyAcc = Resources.GetString(Resource.String.new_entry_tv_4);
					moneyAcc += bkm.MoneyAccounts.Where (m => m.Number == e.UsedMoneyAccount).FirstOrDefault ().ToString();
					string tax = (Resources.GetString(Resource.String.new_entry_tv_7)) + bkm.TaxRates.Where (t => t.Id == e.Tax).FirstOrDefault().ToString();
					string fromTo = Resources.GetString(Resource.String.new_entry_tv_5);
					string type;
					if (e.IsIncome) 
					{
						type = (Resources.GetString(Resource.String.entry_details_income));		
						fromTo += bkm.IncomeAccounts.Where (a => a.Number == e.Type).FirstOrDefault ().ToString();			
					} 
					else 
					{
						type = (Resources.GetString(Resource.String.entry_details_expense));
						fromTo += bkm.ExpenseAccounts.Where (a => a.Number == e.Type).FirstOrDefault ().ToString();

					}
					//display gathered entry information
					entryTitle.Text = Resources.GetString(Resource.String.entry_details_register) + nr;
					entryBody.Text = string.Format (" \n{0}\n{1}\n{2}\n{3}\n{4}\n{5}\n{6}",
						date, type, description,sum,tax,fromTo,moneyAcc );
				} 
				else 
				{
					DisplayErrorMessage ();
				}
			} 
			else 
			{
				DisplayErrorMessage ();
			}
		}

		/// <summary>
		/// Method used to display error message in case retrieving entry data failed for any reason.
		/// </summary>
		private void DisplayErrorMessage()
		{
			entryTitle.Text = Resources.GetString(Resource.String.entry_details_error_title);
			entryBody.Text = Resources.GetString(Resource.String.entry_details_error_body);
		}
	}
}

