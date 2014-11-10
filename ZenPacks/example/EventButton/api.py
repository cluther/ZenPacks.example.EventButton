# stdlib Imports
import subprocess

# Zenoss Imports
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

    def pingDevices(self, evids):
        """Ping devices associated with evids."""
        if not evids:
            return DirectResponse.succeed(msg="No events selected.")

        # Gather unique devices.
        devices = {}

        zep = getFacade('zep')
        evt_filter = zep.createEventFilter(uuid=evids)
        evt_summaries = zep.getEventSummaries(offset=0, filter=evt_filter)
        for evt_summary in evt_summaries.get('events', []):
            device_id = evt_summary['occurrence'][0]['actor']['element_identifier']
            if device_id in devices:
                continue

            device = self.context.dmd.Devices.findDeviceByIdExact(device_id)
            if not device or not device.getManageIp():
                continue

            devices[device_id] = device

        # Run ping for each unique device.
        ping_output = {}

        for device_id, device in devices.iteritems():
            ping_output[device_id] = subprocess.check_output(
                "ping -c3 {} ; exit 0".format(device.getManageIp()),
                stderr=subprocess.STDOUT,
                shell=True)

        return DirectResponse.succeed(data=ping_output)
