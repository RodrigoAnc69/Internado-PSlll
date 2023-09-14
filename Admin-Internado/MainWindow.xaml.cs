using Admin_Internado;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Social_Blade_Dashboard
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            RenderPages.Children.Clear();
            RenderPages.Children.Add(new Dashboard());
        }

        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

		private void btn_Dashboard_Click(object sender, RoutedEventArgs e)
		{
			RenderPages.Children.Clear();
			RenderPages.Children.Add(new Dashboard());
		}

		private void btn_Hospitals_Click(object sender, RoutedEventArgs e)
		{
			RenderPages.Children.Clear();
			RenderPages.Children.Add(new Hospitals());
		}

		private void btn_Doctors_Click(object sender, RoutedEventArgs e)
		{
			RenderPages.Children.Clear();
			RenderPages.Children.Add(new Doctors());
		}

		private void btn_Students_Click(object sender, RoutedEventArgs e)
		{
			RenderPages.Children.Clear();
			RenderPages.Children.Add(new Students());
		}

		private void btn_Tasks_Click(object sender, RoutedEventArgs e)
		{
			//RenderPages.Children.Clear();
			//RenderPages.Children.Add(new ());
		}
	}
}
