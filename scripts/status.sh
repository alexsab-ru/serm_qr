#!/bin/sh
# Показывает активную версию (v1/v2) и последние коммиты обеих версий на сервере.
set -e
. scripts/deploy-lib.sh

ACTIVE=$(detect_active)
echo "Активная версия: $ACTIVE (неактивная: $(other_version "$ACTIVE"))"
echo
show_versions
echo
echo "Локальные коммиты:"
echo "root: $(git log --oneline -1)"
echo "inc:  $(git -C inc log --oneline -1)"
