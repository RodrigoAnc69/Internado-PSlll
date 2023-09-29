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

namespace Admin_Internado
{
	/// <summary>
	/// Lógica de interacción para Doctors.xaml
	/// </summary>
	public partial class Doctors : UserControl
	{
		public Doctors()
		{
			InitializeComponent();
		}

        private void btnRegistrar_Click(object sender, RoutedEventArgs e)
        {
            
        }

        #region
        private void txtAPaterno_MouseEnter(object sender, MouseEventArgs e)
        {
            elipse2.Fill = new SolidColorBrush(Colors.Green);
        }

        private void txtAPaterno_MouseLeave(object sender, MouseEventArgs e)
        {
            elipse2.Fill = new SolidColorBrush(Colors.Transparent);
        }

        private void txtNombre_MouseEnter(object sender, MouseEventArgs e)
        {
            elipse1.Fill = new SolidColorBrush(Colors.Green);
        }

        private void txtNombre_MouseLeave(object sender, MouseEventArgs e)
        {
            elipse1.Fill = new SolidColorBrush(Colors.Transparent);
        }

        private void txtApellidoMaterno_MouseEnter(object sender, MouseEventArgs e)
        {
            elipse_3.Fill = new SolidColorBrush(Colors.Green);
        }

        private void txtApellidoMaterno_MouseLeave(object sender, MouseEventArgs e)
        {
            elipse_3.Fill = new SolidColorBrush(Colors.Transparent);
        }
        #endregion
    }
}
