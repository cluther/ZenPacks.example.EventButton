# ZenPacks.example.EventButton

This ZenPack serves as an example of how to add a new button to the Zenoss event console that performs some action on selected events. In this specific case that action is to add the same note to many events at the same time.

## Files

The only relevant files are:

 * ZenPacks/example/EventButton/configure.zcml
 * ZenPacks/example/EventButton/resources/eventclass.js
 * ZenPacks/example/EventButton/api.py

### configure.zcml

configure.zcml is used to register a resource directory out of which the necessary JavaScript file can be served.

A viewlet is then registered to deliver the eventclass.js JavaScript to the user when they're looking at an EventClass. This is what the user is looking at on the event console.

Finally a *directRouter* is registered that will add a new *setResolution()* API method. The JavaScript will call this method.

### eventclass.js

JavaScript that adds a *Resolution* button to the right side of the event console toolbar. When the user clicks this button, a window will appear that allows the user to type in the resolution. Upon clicking OK, the *setResolution()* method of the API will be called with the selected event IDs, and the user's resolution text.

### api.py

Defines the *ExampleEventButtonRouter* JSON API class and its single *setResolution()* method.

## Notes

You must restart Zenoss after installing this ZenPack. As with installing any ZenPack.
