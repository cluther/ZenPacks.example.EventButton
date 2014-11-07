from AccessControl import getSecurityManager
from Products.ZenUtils.Ext import DirectRouter, DirectResponse
from Products.Zuul import getFacade


class ExampleEventButtonRouter(DirectRouter):

    """JSON API Endpoint."""

    def setResolution(self, evids, resolution):
        """Set the resolution for evids."""
        if not evids:
            return DirectResponse.succeed(msg="No events selected.")

        zep = getFacade('zep')
        username = getSecurityManager().getUser().getId()

        for evid in evids:
            zep.addNote(evid, resolution, username)
