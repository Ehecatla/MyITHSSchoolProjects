
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
	/// EntryListActivity is used to display list of entries saved in database.
	/// </summary>
	[Activity (Label = "Entry List")]			
	public class EntryListActivity : Activity
	{

		private ListView lv;
		private EntryListAdapter adapter;


		protected override void OnCreate (Bundle savedInstanceState)
		{
			base.OnCreate (savedInstanceState);
			SetContentView (Resource.Layout.EntryList);

			lv = FindViewById<ListView> (Resource.Id.entry_list_1);
			BookkeeperManager bkm = BookkeeperManager.Instance;
			adapter = new EntryListAdapter (this, bkm.Entries);
			lv.Adapter = adapter;
			lv.ItemClick += ClickedListItem;
		}

		protected override void OnStart ()
		{
			base.OnStart ();
			BookkeeperManager bkm = BookkeeperManager.Instance;
			adapter = new EntryListAdapter (this, bkm.Entries);
			lv.Adapter = adapter;
		}

		/// <summary>
		/// Clickeds the list item is listener event that starts up new activity with information on the clicked entry
		/// list item.
		/// </summary>
		/// <param name="sender">sender object</param>
		/// <param name="e">event arguments</param>
		public void ClickedListItem(object sender, AdapterView.ItemClickEventArgs e)
		{
			Entry e2 = adapter.GetEntry(e.Position);
			int entryId = e2.Id;
			Intent detailsIntent = new Intent (this, typeof(EntryDetailsActivity));
			detailsIntent.PutExtra (EntryDetailsActivity.ENTRY_INFO, entryId);
			StartActivity (detailsIntent);
		}
	}
}
