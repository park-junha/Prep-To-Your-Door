﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

using InfiniteMeals.Meals.Model;
using System.Net.Http;
using InfiniteMeals.Model.Database;
using Newtonsoft.Json;
using System.Collections.ObjectModel;
using System.Windows.Input;
using Xamarin.Forms.Internals;
using InfiniteMeals.Meals;

namespace InfiniteMeals.MealSelect
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AddOnChoices : ContentPage
    {
        private ObservableCollection<MealGroup> grouped { get; set; }
        String infoImg = "info.jpg";
        double subTotal = 0.00;
        public AddOnChoices()
        {
            InitializeComponent();
            getData();
        }

        public async void getData()
        {
            Boolean flag = false;
        // Normal Meals
        List<String> AddNames = new List<String>();
            List<String> AddDesc = new List<String>();
            List<double> AddPrice = new List<double>();
            List<int> AddQty = new List<int>();
            List<String> AddImage = new List<String>();

            // Additional Meals
            List<String> AddMealName = new List<String>();
            List<String> AddMealDesc = new List<String>();
            List<double> AddMealPrice = new List<double>();
            List<String> AddMealImage = new List<String>();
            List<int> AddMealQty = new List<int>();

            // Additional Smoothies
            List<String> AddSmoothiesName = new List<String>();
            List<String> AddSmoothiesDesc = new List<String>();
            List<double> AddSmoothiesPrice = new List<double>();
            List<String> AddSmoothiesImage = new List<String>();
            List<int> AddSmoothieQty = new List<int>();

            // Grouping
            grouped = new ObservableCollection<MealGroup>();
            var addAddOnGroup = new MealGroup() { LongName = "Add Ons", ShortName = "am" };
            var addMealGroup = new MealGroup() { LongName = "Additional Meals", ShortName = "asm" };
            var addSmoothieGroup = new MealGroup() { LongName = "Additional Smoothies", ShortName = "as" };

            HttpClient client = new HttpClient();
            var content = await client.GetStringAsync("https://uavi7wugua.execute-api.us-west-1.amazonaws.com/dev/api/v2/meals");
            var obj = JsonConvert.DeserializeObject<Data>(content);


            for (int placeHolder = 0; placeHolder < obj.Result.MenuForWeek1.Addons.AddonsAddons.Menu.Length; placeHolder++)
            {
                String imageMeal;
                AddNames.Add(obj.Result.MenuForWeek1.Addons.AddonsAddons.Menu[placeHolder].MealName);
                AddDesc.Add(obj.Result.MenuForWeek1.Addons.AddonsAddons.Menu[placeHolder].MealDesc);
                AddPrice.Add(Convert.ToDouble(obj.Result.MenuForWeek1.Addons.AddonsAddons.Menu[placeHolder].ExtraMealPrice));
                AddQty.Add(0);
                if (obj.Result.MenuForWeek1.Addons.AddonsAddons.Menu[placeHolder].MealPhotoUrl == null)
                {
                    imageMeal = "defaultmeal.png";
                    AddImage.Add(imageMeal);
                }
                else
                {
                    imageMeal = obj.Result.MenuForWeek1.Addons.AddonsAddons.Menu[placeHolder].MealPhotoUrl.ToString();
                    AddImage.Add(imageMeal);

                }

                addAddOnGroup.Add(new Meal
                {
                    name = AddNames[placeHolder],
                    price = AddPrice[placeHolder],
                    description = AddDesc[placeHolder],
                    imageUrl = imageMeal,
                    infoUrl = infoImg,
                    qty = AddQty[placeHolder],
                    total = 0.00,
                });
            }

            for (int j = 0; j < obj.Result.MenuForWeek1.Addons.Weekly.Menu.Length; j++)
            {
                String imageMeal;
                AddMealName.Add(obj.Result.MenuForWeek1.Addons.Weekly.Menu[j].MealName);
                AddMealDesc.Add(obj.Result.MenuForWeek1.Addons.Weekly.Menu[j].MealDesc);
                AddMealPrice.Add(Convert.ToDouble(obj.Result.MenuForWeek1.Addons.Weekly.Menu[j].ExtraMealPrice));
                AddMealQty.Add(0);
                if (obj.Result.MenuForWeek1.Addons.Weekly.Menu[j].MealPhotoUrl == null)
                {
                    imageMeal = "defaultmeal.png";
                    AddMealImage.Add(imageMeal);

                }
                else
                {
                    imageMeal = obj.Result.MenuForWeek1.Addons.Weekly.Menu[j].MealPhotoUrl.ToString();
                    AddMealImage.Add(imageMeal);

                }
                addMealGroup.Add(new Meal
                {
                    name = AddMealName[j],
                    price = AddMealPrice[j],
                    description = AddMealDesc[j],
                    imageUrl = imageMeal,
                    infoUrl = infoImg,
                    qty = AddMealQty[j],
                    total = 0.00,
                });
            }

            for (int k = 0; k < obj.Result.MenuForWeek1.Addons.Smoothies.Menu.Length; k++)
            {
                String imageMeal;
                AddSmoothiesName.Add(obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].MealName);
                AddSmoothiesDesc.Add(obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].MealDesc);
                AddSmoothiesPrice.Add(Convert.ToDouble(obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].ExtraMealPrice));
                AddSmoothieQty.Add(0);
                if (obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].MealPhotoUrl == null)
                {
                    imageMeal = "defaultmeal.png";
                    AddSmoothiesImage.Add(imageMeal);

                }
                else
                {
                    imageMeal = obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].MealPhotoUrl.ToString();
                    AddSmoothiesImage.Add(imageMeal);
                }
                addSmoothieGroup.Add(new Meal
                {
                    name = obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].MealName,
                    price = Convert.ToDouble(obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].ExtraMealPrice),
                    description = obj.Result.MenuForWeek1.Addons.Smoothies.Menu[k].MealDesc,
                    imageUrl = imageMeal,
                    infoUrl = infoImg,
                    qty = AddSmoothieQty[k],
                    total = 0.00,
                });

            }

            grouped.Add(addAddOnGroup);
            grouped.Add(addMealGroup);
            grouped.Add(addSmoothieGroup);

            ToolbarItem totalBar = new ToolbarItem
            {
                Text = "Close",
                IconImageSource = ImageSource.FromFile("example_icon.png"),
                Order = ToolbarItemOrder.Primary,
                Priority = 0,
            };
            totalBar.Clicked += GetText;
            totalBar.SetBinding(Label.TextProperty, "total");
            this.ToolbarItems.Add(totalBar);

            lstView.ItemsSource = grouped;
            lstView.SelectionMode = ListViewSelectionMode.None;
            lstView.IsGroupingEnabled = true;
            lstView.GroupDisplayBinding = new Binding("LongName");
            lstView.GroupShortNameBinding = new Binding("ShortName");

            lstView.ItemTemplate = new DataTemplate(() =>
            {
            var grid = new Grid
            {
                HeightRequest = 100,
                VerticalOptions = LayoutOptions.FillAndExpand
            };
            var nameLabel = new Label
            {
                FontAttributes = FontAttributes.Bold,
                HorizontalOptions = LayoutOptions.Center,
                VerticalOptions = LayoutOptions.Center
            };
            var costLabel = new Label
            {
                HorizontalOptions = LayoutOptions.Center,
                VerticalOptions = LayoutOptions.Center
            };
            var imgLabel = new Image
            {
                WidthRequest = 150,
                HeightRequest = 75,
                Aspect = Aspect.AspectFill,
                HorizontalOptions = LayoutOptions.CenterAndExpand,
                VerticalOptions = LayoutOptions.CenterAndExpand
            };
            imgLabel.Margin = new Thickness(10, 0, 0, 10);
            var infoButton = new ImageButton
            {
                WidthRequest = 20,
                HeightRequest = 20,
                Aspect = Aspect.AspectFit,
                HorizontalOptions = LayoutOptions.Center,
                VerticalOptions = LayoutOptions.Center,
            };
            infoButton.Clicked += (sender, e) =>
            {
                ImageButton stepper = sender as ImageButton;
                var model = stepper.BindingContext as Meal;
                DisplayAlert("Ingredients", model.description.ToString(), "OK");
            };

            var steppers = new Stepper
            {
                Value = 0,
                Maximum = 10,
                Increment = 1,
                HeightRequest = 50,
                Scale = 0.5,
                HorizontalOptions = LayoutOptions.End,
                VerticalOptions = LayoutOptions.Center,

            };
            steppers.Margin = new Thickness(40, 0, 0, 0); ;

            steppers.ValueChanged += (sender, e) =>
            {
                Stepper stepper = sender as Stepper;
                var model = stepper.BindingContext as Meal;
                var stepperVal = stepper.Value;


                if (stepperVal > model.qty)
                {
                    model.qty = (int)steppers.Value;
                    subTotal += model.price;
                    model.total = subTotal;
                }
                else if (stepperVal < model.qty)
                {

                    model.qty = (int)steppers.Value;
                    subTotal -= model.price;
                    model.total = subTotal;
                    if (subTotal < 0)
                    {
                        subTotal = 0.00;
                        model.total = subTotal;
                    }
                }

                if (subTotal == 0)
                {
                    totalBar.Text = "Close";
                    System.Diagnostics.Debug.WriteLine(" made it here flag" + flag);
                }
                else
                {
                    totalBar.Text = string.Format("Agree to Pay: ${0:#,0.00}", subTotal);
                    System.Diagnostics.Debug.WriteLine(" made it here flag 2" + flag);
                }


            };

                Label quantity = new Label
                {
                    FontSize = 15,
                    FontAttributes = FontAttributes.Bold,
                    HorizontalOptions = LayoutOptions.Start,
                    VerticalOptions = LayoutOptions.Center,
                    VerticalTextAlignment = TextAlignment.Center,
                    HorizontalTextAlignment = TextAlignment.Center,

                };

                nameLabel.SetBinding(Label.TextProperty, "name");
                costLabel.SetBinding(Label.TextProperty, "price");
                quantity.SetBinding(Label.TextProperty, "qty");
                costLabel.SetBinding(Label.TextProperty, "price");
                imgLabel.SetBinding(Image.SourceProperty, "imageUrl");
                infoButton.SetBinding(Image.SourceProperty, "infoUrl");

                grid.Children.Add(imgLabel, 0, 0);
                imgLabel.SetValue(Grid.RowSpanProperty, 2);
                imgLabel.SetValue(Grid.ColumnSpanProperty, 2);
                grid.Children.Add(nameLabel, 2, 0);
                nameLabel.SetValue(Grid.RowSpanProperty, 2);
                nameLabel.SetValue(Grid.ColumnSpanProperty, 2);
                grid.Children.Add(infoButton, 4, 0);
                grid.Children.Add(steppers, 3, 1);
                steppers.SetValue(Grid.ColumnSpanProperty, 3);
                grid.Children.Add(quantity, 5, 0);

                return new ViewCell { View = grid, Height = 100 };
            });

            Content = lstView;
            BindingContext = this;

        }


        void GetText(object sender, EventArgs e)
        {
            ToolbarItem tb = sender as ToolbarItem;
            String val = tb.Text.ToString();
            System.Diagnostics.Debug.WriteLine(val);

            if(val.Equals("Close"))
            {
                RefreshToSchedule();
            }
            else
            {
                BackToSchedule();
            }
        }

        void OnInfoClicked(Object sender, EventArgs args)
        {
            Button infoB = sender as Button;
            var model = infoB.BindingContext as Meal;
            DisplayAlert("Ingredients", model.description.ToString(), "OK");
        }

        private async void BackToSchedule()
        {
            await Navigation.PopAsync();
        }

        private async void RefreshToSchedule()
        {
            await Navigation.PushAsync(new MealSchedule());
        }
    }
}
