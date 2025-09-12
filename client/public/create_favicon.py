#!/usr/bin/env python3
import base64

# Base64 encoded 16x16 PNG favicon with ShopHub logo (simplified)
# This is a simple shopping bag icon in purple/indigo gradient
favicon_base64 = """
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB
8ElEQVQ4jY2TTUhUURTHf+e+N++NM6OjYzqaH5GVFkVFRLQIWrRoUdCiTZsWQS2CaBG0aNOiRYug
RdCmRUGLFi1aBC2KqCgiLfqwLMvKykZHZ3zvvXtvizfjODra/8+55/zOPffcK/yHRKvpdDqNiKBU
q/5m5d8WbrcbEaHVVKslSZJIJpMYhkEikUApRSqVwjAMTNPEMAx0Xce2bXRdR9d1bNsmFAqRSCSw
bRulFJZlYVkWlmVhGAaGYWDbNrZtY5ompmliWRaWZaGUQimFUgrbtrFtG8MwME0T0zQxDAPDMDBN
E9M0sSwLy7KwbRvbtlFKoZRCREgmkyilMAyDZDKJYRgkk0lM0ySZTGKaJslkEsMwSCaTGIZBMplE
KYVSCqUUSimUUiilUEqhlEIphVIKpRRKKZRSKKVQSqGUQimFUgqlFEoplFIopVBKoZRCRGg1x3Fw
HAcRwXEcHMfBcRwcx8FxHBzHwXEcHMfBcRwcx8FxHBzHwXEcHMfBcRwcx8FxHBzHwXEcHMeh1WKx
GKFQiFAoRCgUIhQKEQqFCIVChEIhQqEQoVCIUChEKBQiFAoRCoUIhUKEQiFCoRChUIhQKEQoFCIU
ChEKhWhERGg027ZxHIdGRYS/+3j8B/4AN3ZIgWC3iN4AAAAASUVORK5CYII=
"""

# Decode and write the favicon
with open('favicon.ico', 'wb') as f:
    f.write(base64.b64decode(favicon_base64))

print("favicon.ico created successfully!")