using Android.App;
using Android.Widget;
using Android.OS;
using Android.Content;
using System;
using System.Linq;

namespace Labb2
{
	/// <summary>
	/// Main activity is the launch activity for application, it displays menu buttons leading to different functions in
	/// the app.
	/// </summary>
	[Activity (Label = "Bookkeeper", MainLauncher = true, Icon = "@mipmap/icon")]
	public class MainActivity : Activity
	{
		
		private Button btn1;
		private Button btn2;
		private Button btn3;

		protected override void OnCreate (Bundle savedInstanceState)
		{
			
			base.OnCreate (savedInstanceState);
			SetContentView (Resource.Layout.Main);

			btn1 = FindViewById<Button> (Resource.Id.menu_btn_1);
			btn2 = FindViewById<Button> (Resource.Id.menu_btn_2);
			btn3 = FindViewById<Button> (Resource.Id.menu_btn_3);

			btn1.Click += StartNewEntry;
			btn2.Click += StartEntryManager;
			btn3.Click += StartRaportMaker;

			BookkeeperManager bk = BookkeeperManager.Instance;


		}

		/// <summary>
		/// Starts the new entry.
		/// </summary>
		/// <param name="sender">Sender.</param>
		/// <param name="e">E.</param>
		public void StartNewEntry(object sender, EventArgs e)
		{
			Intent i = new Intent(this, typeof(NewEntryActivity));
			StartActivity(i);
		} 

		/// <summary>
		/// Starts the entry manager.
		/// </summary>
		/// <param name="sender">Sender.</param>
		/// <param name="e">E.</param>
		public void StartEntryManager(object sender, EventArgs e)
		{
			Intent i = new Intent(this, typeof(EntryListActivity));
			StartActivity(i);
		}

		/// <summary>
		/// Starts the raport maker.
		/// </summary>
		/// <param name="sender">Sender.</param>
		/// <param name="e">E.</param>
		public void StartRaportMaker(object sender, EventArgs e)
		{
			Intent i = new Intent(this, typeof(RaportMakerActivity));
			StartActivity(i);
		}



	}
}
