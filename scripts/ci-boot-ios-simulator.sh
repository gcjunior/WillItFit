#!/usr/bin/env bash
# Boot the first available iPhone simulator and export DEVICE_UDID for later steps.
set -euo pipefail

DEVICE_UDID="$(
  xcrun simctl list devices available \
    | grep -E "iPhone (1[5-9]|[2-9][0-9])" \
    | grep -v "unavailable" \
    | head -1 \
    | sed -n 's/.*(\([0-9A-F-]\{36\}\)).*/\1/p'
)"

if [[ -z "${DEVICE_UDID}" ]]; then
  echo "No available iPhone simulator found"
  xcrun simctl list devices available
  exit 1
fi

echo "Using simulator UDID: ${DEVICE_UDID}"
echo "device_udid=${DEVICE_UDID}" >> "${GITHUB_OUTPUT}"

xcrun simctl boot "${DEVICE_UDID}" 2>/dev/null || true
xcrun simctl bootstatus "${DEVICE_UDID}" -b
open -a Simulator 2>/dev/null || true
