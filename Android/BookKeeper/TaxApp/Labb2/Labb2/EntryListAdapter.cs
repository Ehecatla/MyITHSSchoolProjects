using System;
using Android.Widget;
using Android.Views;
using System.Collections.Generic;
using System.Linq;
using Android.Content;

namespace Labb2
{
	/// <summary>
	/// Entry list adapter used to display list of Entry objects in manner date, description and sum of money.
	/// </summary>
	public class EntryListAdapter : BaseAdapter
	{
		private Context context;
		private LayoutInflater layoutInflater;
		private List<Entry> entryList;

		/// <summary>
		/// Initializes a new instance of the <see cref="Labb2.EntryListAdapter"/> class.
		/// </summary>
		/// <param name="c">activitys context</param>
		/// <param name="entryList">list containing objects of type Entry</param>
		public EntryListAdapter (Context c, List<Entry> entryList)
		{
			context = c;
			this.entryList = entryList;
			layoutInflater = LayoutInflater.FromContext (context);
		}

		#region implemented abstract members of BaseAdapter

		public override Java.Lang.Object GetItem (int position)	
		{
			return null;
		}

		/// <summary>
		/// Gets the object of Entry class from entry list at given position.
		/// </summary>
		/// <returns>The entry.</returns>
		/// <param name="position">Position.</param>
		public Entry GetEntry(int position)
		{
			return entryList[position];
		}
			

		public override long GetItemId (int position)
		{
			return position;
		}


		public override Android.Views.View GetView (int position, Android.Views.View convertView, Android.Views.ViewGroup parent)
		{
			View v = convertView;
			if (v == null) 
			{
				v = layoutInflater.Inflate(Resource.Layout.EntryListRow, null);
			} 

			TextView tv_date =  v.FindViewById<TextView>(Resource.Id.entry_list_date_tv);
			TextView tv_description =  v.FindViewById<TextView>(Resource.Id.entry_list_description_tv);
			TextView tv_amount = v.FindViewById<TextView>(Resource.Id.entry_list_sum_tv);

			tv_description.Text = entryList [position].Description;
			tv_date.Text = entryList [position].TheDate.ToString("yyyy-MM-dd");
			tv_amount.Text = Convert.ToString (entryList [position].TotalAmount);
			return v;
		}


		public override int Count 
		{
			get 
			{
				return entryList.Count();
			}
		}

		#endregion
	}
}

