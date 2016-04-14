
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
using Android.Content.PM;

namespace Labb2
{
	/// <summary>
	/// New entry activity is activity that handles possibility of adding activities in appilcation.
	/// </summary>
	[Activity (Label = "New Entry",ScreenOrientation = Android.Content.PM.ScreenOrientation.Portrait)]			
	public class NewEntryActivity : Activity
	{

		private Spinner typeSpinner;
		private Spinner fromToSpinner;
		private Spinner taxSpinner;

		private RadioButton incomeRadioBtn;
		private RadioButton expenseRadioBtn;

		private Button sendButton;

		private EditText dateET;
		private EditText descriptionET;
		private EditText amountET;

		private BookkeeperManager bookKeep;


		protected override void OnCreate (Bundle savedInstanceState)
		{
			base.OnCreate (savedInstanceState);
			SetContentView (Resource.Layout.NewEntry);

			typeSpinner = FindViewById<Spinner> (Resource.Id.new_entry_spinner_4);
			fromToSpinner = FindViewById<Spinner> (Resource.Id.new_entry_spinner_5);
			taxSpinner = FindViewById<Spinner> (Resource.Id.new_entry_spinner_7);

			incomeRadioBtn = FindViewById<RadioButton> (Resource.Id.new_entry_radio_1);
			expenseRadioBtn = FindViewById<RadioButton> (Resource.Id.new_entry_radio_2);

			sendButton = FindViewById<Button> (Resource.Id.new_entry_btn_1);

			dateET = FindViewById<EditText> (Resource.Id.new_entry_et_2);
			descriptionET = FindViewById<EditText> (Resource.Id.new_entry_et_3);
			amountET = FindViewById<EditText> (Resource.Id.new_entry_et_6);

			bookKeep = BookkeeperManager.Instance; 

			sendButton.Click += SendButtonClicked;
			incomeRadioBtn.Click += IncomeExpenseChanged;
			expenseRadioBtn.Click += IncomeExpenseChanged;

			LoadTypeView();
			LoadToFromAccount ();
			LoadTax ();
		
		}
			
		/// <summary>
		/// IncomeExpenseChanged handles radio button clicks indicating which type of account will be loaded. When button
		/// is clicked LoadTypeView method is launched and it loads up right account type data depending on buttons.
		/// </summary>
		/// <param name="sender">Sender.</param>
		/// <param name="e">E.</param>
		private void IncomeExpenseChanged(object sender, EventArgs e)
		{
			LoadTypeView ();
		}

		/// <summary>
		/// Runs method that generates new entry if all entry requirements are met.
		/// </summary>
		/// <param name="sender">Sender.</param>
		/// <param name="e">E.</param>
		private void SendButtonClicked(object sender, EventArgs e)
		{
			GenerateNewEntry ();
		}

		/// <summary>
		/// Loads different type of account to spinner depending on value of radio buttons.
		/// </summary>
		private void LoadTypeView()
		{
			List<Account> typeAccountList = null;
			if (incomeRadioBtn.Checked) 
			{
				//load income accounts
				typeAccountList = bookKeep.IncomeAccounts;

			} 
			if(expenseRadioBtn.Checked)
			{
				//load expense accounts
				typeAccountList = bookKeep.ExpenseAccounts;
			}
			ArrayAdapter<Account> typeAccAdapter = new ArrayAdapter<Account> (this, Android.Resource.Layout.SimpleSpinnerItem, typeAccountList);
			typeAccAdapter.SetDropDownViewResource (Android.Resource.Layout.SimpleSpinnerDropDownItem);
			typeSpinner.Adapter = typeAccAdapter;

		}

		/// <summary>
		/// Loads money accounts onto spinner.
		/// </summary>
		private void LoadToFromAccount() //money accounts!
		{
			List<Account> allMoneyAcc = bookKeep.MoneyAccounts;
			ArrayAdapter<Account> moneyAccAdapter = new ArrayAdapter<Account> (this, Android.Resource.Layout.SimpleSpinnerItem, allMoneyAcc);
			moneyAccAdapter.SetDropDownViewResource (Android.Resource.Layout.SimpleSpinnerDropDownItem);
			fromToSpinner.Adapter = moneyAccAdapter;

		}

		/// <summary>
		/// Loads the tax data onto spinner.
		/// </summary>
		private void LoadTax()
		{
			List<TaxRate> taxList = bookKeep.TaxRates;
			ArrayAdapter<TaxRate> taxAdapter = new ArrayAdapter<TaxRate>(this, Android.Resource.Layout.SimpleSpinnerItem, taxList);
			taxAdapter.SetDropDownViewResource (Android.Resource.Layout.SimpleSpinnerDropDownItem);
			taxSpinner.Adapter = taxAdapter;
		}


		/// <summary>
		/// Method generates new entry if all data was filled by user correctly, otherwise a message is displayed about
		/// error. Method checks that all input fields are filled, that radio button choice is synced with acc type spinner
		/// as them being out of sync would result in corrupted entry and database. Checks if date and sum input has 
		/// elligible value.
		/// </summary>
		private void GenerateNewEntry()
		{

			string entryDate = dateET.Text;
			string description = descriptionET.Text;
			string totalSum = amountET.Text;

			if (totalSum == "" || entryDate == "" || description== "") 
			{
				SendToastMessage (Resources.GetString(Resource.String.error_message_empty));
			} 
			else if (!CheckDateIfEligible (entryDate)) 
			{
				SendToastMessage (Resources.GetString(Resource.String.error_message_date));

			} 
			else if (!CheckIfSumEligible (totalSum))
			{
				SendToastMessage (Resources.GetString(Resource.String.error_message_number));
			}
			else 
			{
				Account selectedType = ((ArrayAdapter<Account>)typeSpinner.Adapter).GetItem (typeSpinner.SelectedItemPosition);

				bool ? isIncome =null;				
				if (selectedType.Type == -1 && incomeRadioBtn.Checked== false) 
				{
					isIncome = false;
				} 
				else if (selectedType.Type == 1 && incomeRadioBtn.Checked==true) 
				{
					isIncome= true;
				} 


				if (isIncome == null) 				//view data in radio btn and type spinner is out of sync
				{
					SendToastMessage (Resources.GetString(Resource.String.error_message_sync));
				} 
				else 
				{
					bool isIncomeEntry = (bool)isIncome;
					Account selectedTFAccount = ((ArrayAdapter<Account>)fromToSpinner.Adapter).GetItem (fromToSpinner.SelectedItemPosition);
					TaxRate selectedTax = ((ArrayAdapter<TaxRate>)taxSpinner.Adapter).GetItem (taxSpinner.SelectedItemPosition);

					Entry newEntry = new Entry (isIncomeEntry,description, Convert.ToDouble(totalSum),DateTime.Parse(entryDate),
						selectedTax, selectedTFAccount, selectedType);
					bool entryAdded = bookKeep.AddEntry (newEntry);
					if (entryAdded)
					{
						SendToastMessage (Resources.GetString(Resource.String.message_entry_added));	
						//clean input fields
						dateET.Text = "";
						descriptionET.Text = "";
						amountET.Text = "";
						incomeRadioBtn.Checked = true;
						LoadTypeView ();	//need to ensure right accounts are loaded
						taxSpinner.SetSelection(0);
						typeSpinner.SetSelection (0);
						fromToSpinner.SetSelection (0);
					}
					else
					{
						SendToastMessage (Resources.GetString(Resource.String.error_message_unknown));
					}
				}					
			}
		}

		/// <summary>
		/// Checks the date given in string parameter is eligible for entry input. Date must be given in format that
		/// can be converted to DateTime class. If given parameter is convertable to date then this method returns true,
		/// otherwise it returns false.
		/// </summary>
		/// <returns><c>true</c>, if date if eligible was checked, <c>false</c> otherwise.</returns>
		/// <param name="dateAsString">Date as string.</param>
		private bool CheckDateIfEligible(string dateAsString)
		{
			DateTime dt = DateTime.Today;
			bool isCorrectDate = DateTime.TryParse (dateAsString, out dt);
			return isCorrectDate;
		}

		/// <summary>
		/// Checks if given string is representing double value. If given string is not double or lower than zero then
		/// this method returns false because entrys can be only made with nonnegative value.
		/// </summary>
		/// <returns><c>true</c>, if if sum eligible was checked, <c>false</c> otherwise.</returns>
		/// <param name="sumAsString">Sum as string.</param>
		private bool CheckIfSumEligible(string sumAsString)
		{
			double i = 0.0;
			bool isNumber = double.TryParse (sumAsString, out i);
			if (i < 0 ) 											// negative numbers are also illegible for entry!
			{
				isNumber = false;
			}
			return isNumber;
		}

		/// <summary>
		/// Sends parameter data as toast message to the screen, used to display feedback to user.
		/// </summary>
		/// <param name="message">Message.</param>
		private void SendToastMessage(String message)
		{
			Toast.MakeText (this, message, ToastLength.Short).Show();
		}


	}
}

