# Mendix Browser extension

**Contents**
- Introduction
- Installation instructions
- Keyword documentation
- Example usage

## Introduction
The Mendix Browser extension is an extension built on top of the Robot Framework Browser library and enables you to automate Mendix applications more easily and quickly as there is no need for xpath or css selectors in case of standard Mendix functionality. Instead you will be using a key=value method making your keywords more readable and maintainable.

The extension is based on a Mendix Keywords resource file that was created for a Mendix project that was running Mendix version 5. The approach that was being used in the resource file and which is now being used in the extension has worked over all Mendix versions since.

> It's important to note that the extension is developed based on a standard Mendix implementation, where out of the box functionality/elements, as provided by Mendix, are being used. Meaning that if the Mendix application is heavily customized there is a chance this extension will not work.

Any change requests or new ideas are appreciated. Contributions to any further development is also highly appreciated. If you decide to contribute in anyway make sure to do so conform the robotframework-browser-extensions documentation.

## Installation instructions
### Pre-requisites
As this extension is buit on top of Robot Framework and the Browser library it goes without saying you need to have both of them, and their pre-requisites, installed. If you've not already done so please install [Robot Framework](https://github.com/robotframework/robotframework#installation) and the [Browser library](https://github.com/MarketSquare/robotframework-browser#installation-instructions).

### Date-fns
As you now also have NPM installed, as part of Browser library installation, we will be executing the following command in order to download and install the date-fns library.

```
    npm install date-fns --save
```

> In order to have the date-fns functioning over all your projects make sure to have it installed in e.g. your PATH (environment variables) or add the location to your PATH.

> If you rather have it installed separately for a single project, execute the command on your project folder level. This is not the recommended approach however.

### Add extension to your project
The extension can, for now, simply be added to your project by adding the _mendixKeywords.js_ file to your project.

With the file now added to our project we'll have to generate the libspec file. To do this, run the following command:

**Windows:**
```
    python -m robot.libdoc -f libspec Browser::jsextension="<path to .js file>" "<path to libspec folder>\filename.libspec"
```

**Mac/Linux:**
```
    python -m robot.libdoc -f libspec Browser::jsextension="<path to .js file>" "<path to libspec folder>/filename.libspec"
```

- For "<path to .js file>" copy the path to the extension and paste it in here.
- For "<path to libspec folder>" create a folder, e.g. within your project, and paste the path in here.
- For "filename.libspec", define your own name, e.g. mendixExtension.libspec, and fill it in here.

Once this step has succesfully been completed you should be able to acces and use the extension keywords. In order to get access to these keywords we'll have to import the browser library as we would normally do and pass the jsextension parameter our path to the extension. This should look like:

```
    Library   Browser  jsextension=${CURDIR}/mendixKeywords.js
```

You should now be able to use the keywords and (kick-)start your test automation for your Mendix project.

## Keyword documentation
We did our best to document our keywords in as much detail as possible. Within the documentation you'll find information on the basic and the slightly more advanced usage. Keyword documentation can be found [here](https://marketsquare.github.io/robotframework-browser-extensions/MendixKeywords.html#Mendix%20Check).

## Example usage
Below example shows the basic usage of all keywords as provided currently.

```
    Mendix Text    label=Name    input=John Doe
    Mendix Select    label=Gender    select=Male
    Mendix Text Area    label=About me    value=Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla metus tellus, tristique ut consectetur ornare, consequat sit amet ex.
    Mendix Date    label=Date of employment    operator=<    datetype=years    increment=6    dateFormat=dd-MM-yyyy
    Mendix Check    label=Available    select=true
```

In the above example we've hardcoded our values, but for a better approach we would of course be making use of variables.
