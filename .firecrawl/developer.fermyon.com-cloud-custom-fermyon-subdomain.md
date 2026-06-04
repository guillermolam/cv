# Apply Custom Fermyon Subdomain

- [Prerequisites](https://developer.fermyon.com/cloud/custom-fermyon-subdomain#prerequisites)
- [Select Your Spin Application](https://developer.fermyon.com/cloud/custom-fermyon-subdomain#select-your-spin-application)
- [Apply New Custom Fermyon Domain](https://developer.fermyon.com/cloud/custom-fermyon-subdomain#apply-new-custom-fermyon-domain)
- [Validate Custom Fermyon Subdomain Name](https://developer.fermyon.com/cloud/custom-fermyon-subdomain#validate-custom-fermyon-subdomain-name)
- [Next Steps](https://developer.fermyon.com/cloud/custom-fermyon-subdomain#next-steps)

Every Spin application running on Fermyon Cloud receives a domain name that has the following format: `<your-App-Name-randomlyAssignedString>.fermyon.app`. For a more easily recognizable domain name, you may want to change your Spin application’s domain name from `slats-the-cat-o7jecuug.fermyon.app` to `slatsthecat.fermyon.app`.

Custom Fermyon subdomain names allow you to rename the `<your-App-Name-randomyAssignedString>` subdomain. This custom Fermyon subdomain will be combined with the `.fermyon.app` apex domain to give your application a complete domain name.

## Prerequisites

Log into [Fermyon Cloud](https://cloud.fermyon.com/) and ensure you have a Spin application running on Fermyon Cloud. If you do not have a Spin application yet, follow our [quickstart guide](https://developer.fermyon.com/cloud/quickstart) to deploy one.

![Cloud UI with 1 application](https://developer.fermyon.com/static/image/cloud-dash-w-quickstart-app.png)

## Select Your Spin Application

Select the application whose domain name you intend to modify. Then select the _Edit Subdomain Name_ button in the top right corner.

![Cloud UI with app panel view open](https://developer.fermyon.com/static/image/app-panel-view-w-edit-subdomain-button.png)

## Apply New Custom Fermyon Domain

In the text box, you will see your application’s current subdomain, followed by the apex domain `fermyon.app`.

![Custom subdomain panel with original subdomain](https://developer.fermyon.com/static/image/custom-subdomain-panel-original.png)

Input your preferred subdomain name that meets the following characteristics:

- character length is at least 3
- character length is less than 63 characters
- subdomain name is unique

Then click save to apply your changes.

![Custom subdomain panel with new subdomain](https://developer.fermyon.com/static/image/custom-subdomain-panel-renamed.png)

## Validate Custom Fermyon Subdomain Name

If you view the application’s domain name in the panel view, you should see it has been updated to reflect your custom Fermyon subdomain name.

![App panel view with custom subdomain name](https://developer.fermyon.com/static/image/custom-subdomain-app-panel-view.png)

Visit the application’s domain name to validate the change has been applied successfully.

```bash
$ curl quickstart.fermyon.app
```

![Spin app responding at quickstart.fermyon.app](https://developer.fermyon.com/static/image/quickstart-custom-subdomain.png)

## Next Steps

Congratulations, you have successfully applied a custom Fermyon subdomain to your Spin application.

- [Delete an application](https://developer.fermyon.com/cloud/delete)
- Find known issues and file new ones with on the [Fermyon Cloud Feedback GitHub repository](https://github.com/fermyon/feedback)

Did you find the answers you were looking for?

Hi! Could we please enable some additional services for **Analytics**? You can always change or withdraw your consent later.

[Let me choose](https://developer.fermyon.com/cloud/custom-fermyon-subdomain#)

I declineThat's ok