"""Content negotiation helpers for the JSON-only API."""

from rest_framework.negotiation import DefaultContentNegotiation


class JSONOnlyContentNegotiation(DefaultContentNegotiation):
    """Always select the first (JSON) renderer, ignoring the Accept header."""

    def select_renderer(self, request, renderers, format_suffix=None):
        renderer = renderers[0]
        return renderer, renderer.media_type
