
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
	/// Raport maker activity enables user to create Tax report and send it with email.
	/// </summary>
	[Activity (Label = "Raport Creator")]			
	public class RaportMakerActivity : Activity
	{
		private Button btn;

		protected override void OnCreate (Bundle savedInstanceState)
		{
			base.OnCreate (savedInstanceState);
			SetContentView (Resource.Layout.RaportMaker);

			btn = FindViewById<Button> (Resource.Id.raport_btn_1);
			btn.Click += delegate  {
				SendReport();
			};


		}

		/// <summary>
		/// Sends the tax report via email.
		/// </summary>
		private void SendReport()
		{
			BookkeeperManager bkm = BookkeeperManager.Instance;
			string report = bkm.GetTaxReport();

			Intent newEmail = new Intent (Android.Content.Intent.ActionSend);
			newEmail.PutExtra(Android.Content.Intent.ExtraSubject, Resources.GetString(Resource.String.raport_title_text));
			newEmail.PutExtra (Android.Content.Intent.ExtraText, report);

			newEmail.SetType ("message/rfc822");

			StartActivity (newEmail);

		}
	}
}

