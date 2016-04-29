/**
 * Created by paulocristo on 12/11/15.
 */
// Define the tour!
var tour = {
    id: "hello-hopscotch",
    steps: [
        {
            title: "Welcome!",
            content: "We have prepared a quick tour to help you get started.",
            target: "my_panel_title",
            placement: "right"
        },
        {
            title: "My Panel",
            content: "This is where we keep your things organized.",
            target: "my_panel_title",
            placement: "right"
        },
        {
            title: "My Trackables",
            content: "Here is where we show your current trackables.",
            target: "my_trackables",
            placement: "bottom"
        },
        {
            title: "Add New Trackable",
            content: "Here you can add a new trackable.",
            target: "add_trackable",
            placement: "bottom"
        },
        {
            title: "My Devices",
            content: "Here is where we show your current devices.",
            target: "my_devices",
            placement: "bottom"
        },
        {
            title: "Add New Device",
            content: "Here you can add a new device.",
            target: "add_device",
            placement: "bottom"
        },
        {
            title: "My Account",
            content: "Here is where you manage your account info.",
            target: "my_account",
            placement: "bottom"
        },
        {
            title: "Settings",
            content: "Here is where you can define some general tracking settings.",
            target: "my_settings",
            placement: "bottom"
        }
    ]
};

// Start the tour!
hopscotch.startTour(tour);